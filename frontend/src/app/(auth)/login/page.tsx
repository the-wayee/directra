"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { authClient, signIn, signUp } from "@/lib/auth-client"

// ─── Modes ─────────────────────────────────────────────
// login:    邮箱 + 密码 → 登录
// register: 姓名 + 邮箱 + 密码 + Turnstile → 注册 → 自动发 OTP
// verify:   6 位验证码 → 验证邮箱 / 重置密码
// forgot:   邮箱 + Turnstile → 发 OTP → verify
type Mode = "login" | "register" | "verify" | "forgot"

// ─── Animation presets ─────────────────────────────────
const spring = { type: "spring" as const, stiffness: 380, damping: 30 }

const stagger = {
  animate: { transition: { staggerChildren: 0.045 } },
}

const fadeSlide = {
  initial: { opacity: 0, y: 14, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: spring },
  exit: { opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.15 } },
}

const pageFade = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { ...spring, staggerChildren: 0.045 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.18 } },
}

// ─── Component ─────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingEmail, setPendingEmail] = useState("")
  const [verifyPurpose, setVerifyPurpose] = useState<"email-verification" | "forget-password">("email-verification")

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  // Resend cooldown (seconds)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Turnstile
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<TurnstileInstance>(null)

  const resetTurnstile = useCallback(() => {
    setTurnstileToken(null)
    turnstileRef.current?.reset()
  }, [])

  // ── Helpers ──────────────────────────────────────────
  const switchTo = (m: Mode) => {
    setError(null)
    setOtp(["", "", "", "", "", ""])
    resetTurnstile()
    // Start 60s cooldown when OTP was just sent (entering verify screen)
    if (m === "verify") setResendCooldown(60)
    setMode(m)
  }

  const verifyTurnstile = async (token: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/turnstile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      return data.success === true
    } catch {
      return false
    }
  }

  // ── Handlers ─────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await signIn.email({ email, password })
      if (error) {
        // Handle unverified email — let user resend verification
        if (error.message?.toLowerCase().includes("verify") || error.message?.toLowerCase().includes("verified")) {
          setPendingEmail(email)
          setVerifyPurpose("email-verification")
          switchTo("verify")
          // Auto-send new OTP
          await authClient.emailOtp.sendVerificationOtp({ email, type: "email-verification" })
          setLoading(false)
          return
        }
        setError(translateAuthError(error.message))
        setLoading(false)
        return
      }
      router.push("/home")
    } catch {
      setError("网络错误，请重试")
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!turnstileToken) { setError("请完成人机验证"); return }

    setLoading(true)
    setError(null)

    // 1) Verify Turnstile server-side
    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) {
      setError("人机验证失败，请重试")
      resetTurnstile()
      setLoading(false)
      return
    }

    // 2) Create account — Better Auth auto-sends OTP (sendVerificationOnSignUp)
    try {
      const { error } = await signUp.email({ name, email, password })
      if (error) {
        setError(translateAuthError(error.message))
        resetTurnstile()
        setLoading(false)
        return
      }
      setPendingEmail(email)
      setVerifyPurpose("email-verification")
      setLoading(false)
      switchTo("verify")
    } catch {
      setError("网络错误，请重试")
      resetTurnstile()
      setLoading(false)
    }
  }

  const handleForgotSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!turnstileToken) { setError("请完成人机验证"); return }

    setLoading(true)
    setError(null)

    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) {
      setError("人机验证失败，请重试")
      resetTurnstile()
      setLoading(false)
      return
    }

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: "forget-password" })
      if (error) {
        setError(error.message || "发送失败，请检查邮箱地址")
        resetTurnstile()
        setLoading(false)
        return
      }
      setPendingEmail(email)
      setVerifyPurpose("forget-password")
      setLoading(false)
      switchTo("verify")
    } catch {
      setError("网络错误，请重试")
      resetTurnstile()
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    const code = otp.join("")
    if (code.length < 6) { setError("请输入完整的 6 位验证码"); return }

    setLoading(true)
    setError(null)

    try {
      if (verifyPurpose === "email-verification") {
        const { error } = await authClient.emailOtp.verifyEmail({ email: pendingEmail, otp: code })
        if (error) {
          setError(translateAuthError(error.message))
          setLoading(false)
          return
        }
        // autoSignInAfterVerification=true in auth.ts ensures session cookie is set before this redirect
        router.push("/home")
      } else {
        const { error } = await authClient.signIn.emailOtp({ email: pendingEmail, otp: code })
        if (error) {
          setError(translateAuthError(error.message))
          setLoading(false)
          return
        }
        router.push("/home")
      }
    } catch {
      setError("网络错误，请重试")
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: pendingEmail,
        type: verifyPurpose,
      })
      if (error) {
        setError(error.message || "发送失败")
      } else {
        setResendCooldown(60)
      }
    } catch {
      setError("网络错误")
    }
    setLoading(false)
  }

  // ── OTP input helpers ────────────────────────────────
  const handleOtpInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
    if (e.key === "Enter" && otp.join("").length === 6) {
      handleVerify()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!paste) return
    e.preventDefault()
    const next = [...otp]
    paste.split("").forEach((c, i) => { if (i < 6) next[i] = c })
    setOtp(next)
    otpRefs.current[Math.min(paste.length, 5)]?.focus()
  }

  // ─── OAuth ───────────────────────────────────────────
  const handleOAuth = async (provider: "github" | "google") => {
    setLoading(true)
    setError(null)
    await signIn.social({ provider, callbackURL: "/home" })
  }

  // ─── Render helpers ──────────────────────────────────
  const headings: Record<Mode, { title: string; sub: string }> = {
    login: { title: "欢迎回来", sub: "登录以继续你的视频项目" },
    register: { title: "创建账号", sub: "开始你的视频制作之旅" },
    verify: {
      title: verifyPurpose === "email-verification" ? "验证邮箱" : "验证身份",
      sub: `验证码已发送至 ${pendingEmail}`,
    },
    forgot: { title: "找回密码", sub: "我们将向你的邮箱发送验证码" },
  }

  const h = headings[mode]

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 overflow-hidden">
      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)" }}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="w-full max-w-[400px] relative">
        <LayoutGroup>
          {/* ── Logo ── */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.05 }}
          >
            <Link href="/" className="inline-flex items-center gap-2.5 mb-7">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200/60"
                whileHover={{ scale: 1.08, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 5-10 5V3z" fill="white" />
                </svg>
              </motion.div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Directra</span>
            </Link>

            {/* Heading — crossfade on mode change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode + verifyPurpose}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <h1 className="text-[26px] font-bold text-slate-900 mb-1.5 tracking-tight">{h.title}</h1>
                <p className="text-[13px] text-slate-500 leading-relaxed">{h.sub}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ── Card (layout-animated height) ── */}
          <motion.div
            layout
            className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden"
            transition={{ layout: { ...spring, duration: 0.45 } }}
          >
            <div className="p-6">
              <AnimatePresence mode="wait" initial={false}>
                {/* ════════════════════ LOGIN ════════════════════ */}
                {mode === "login" && (
                  <motion.div key="login" {...pageFade}>
                    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3 mb-5">
                      <motion.div variants={fadeSlide}>
                        <OAuthButton provider="github" loading={loading} onClick={() => handleOAuth("github")} />
                      </motion.div>
                      <motion.div variants={fadeSlide}>
                        <OAuthButton provider="google" loading={loading} onClick={() => handleOAuth("google")} />
                      </motion.div>
                    </motion.div>

                    <Divider />

                    <form onSubmit={handleLogin}>
                      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
                        <motion.div variants={fadeSlide}>
                          <Input type="email" placeholder="邮箱地址" value={email} onChange={setEmail} />
                        </motion.div>
                        <motion.div variants={fadeSlide}>
                          <Input type="password" placeholder="密码" value={password} onChange={setPassword} minLength={8} showToggle show={showPassword} onToggleShow={() => setShowPassword((v) => !v)} />
                        </motion.div>

                        {error && <ErrorMsg text={error} />}

                        <motion.div variants={fadeSlide}>
                          <SubmitButton loading={loading} text="登录" />
                        </motion.div>
                      </motion.div>
                    </form>

                    <motion.div
                      className="flex items-center justify-between mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      <button onClick={() => switchTo("forgot")} className="text-xs text-slate-400 hover:text-violet-600 transition-colors cursor-pointer">
                        忘记密码？
                      </button>
                      <button onClick={() => switchTo("register")} className="text-xs text-slate-500 cursor-pointer hover:text-violet-600 transition-colors">
                        没有账号？<span className="font-medium text-violet-600">注册</span>
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                {/* ════════════════════ REGISTER ════════════════════ */}
                {mode === "register" && (
                  <motion.div key="register" {...pageFade}>
                    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3 mb-5">
                      <motion.div variants={fadeSlide}>
                        <OAuthButton provider="github" loading={loading} onClick={() => handleOAuth("github")} />
                      </motion.div>
                      <motion.div variants={fadeSlide}>
                        <OAuthButton provider="google" loading={loading} onClick={() => handleOAuth("google")} />
                      </motion.div>
                    </motion.div>

                    <Divider />

                    <form onSubmit={handleRegister}>
                      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
                        <motion.div variants={fadeSlide}>
                          <Input type="text" placeholder="你的名字" value={name} onChange={setName} />
                        </motion.div>
                        <motion.div variants={fadeSlide}>
                          <Input type="email" placeholder="邮箱地址" value={email} onChange={setEmail} />
                        </motion.div>
                        <motion.div variants={fadeSlide}>
                          <Input type="password" placeholder="密码（至少 8 位）" value={password} onChange={setPassword} minLength={8} showToggle show={showPassword} onToggleShow={() => setShowPassword((v) => !v)} />
                        </motion.div>

                        {/* Turnstile CAPTCHA */}
                        <motion.div variants={fadeSlide} className="flex justify-center pt-1">
                          <Turnstile
                            ref={turnstileRef}
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                            onSuccess={setTurnstileToken}
                            onError={() => setTurnstileToken(null)}
                            onExpire={() => setTurnstileToken(null)}
                            options={{ theme: "light", size: "normal" }}
                          />
                        </motion.div>

                        {error && <ErrorMsg text={error} />}

                        <motion.div variants={fadeSlide}>
                          <SubmitButton loading={loading} text="注册" disabled={!turnstileToken} />
                        </motion.div>
                      </motion.div>
                    </form>

                    <motion.div
                      className="text-center mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button onClick={() => switchTo("login")} className="text-xs text-slate-500 cursor-pointer hover:text-violet-600 transition-colors">
                        已有账号？<span className="font-medium text-violet-600">登录</span>
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                {/* ════════════════════ VERIFY OTP ════════════════════ */}
                {mode === "verify" && (
                  <motion.div key="verify" {...pageFade}>
                    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-5">
                      {/* 6-digit OTP */}
                      <motion.div variants={fadeSlide} className="flex gap-2.5 justify-center" onPaste={handleOtpPaste}>
                        {otp.map((digit, i) => (
                          <motion.input
                            key={i}
                            ref={(el) => { otpRefs.current[i] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpInput(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className="w-[46px] h-[52px] text-center text-xl font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all caret-violet-500"
                            initial={{ opacity: 0, y: 12, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ ...spring, delay: i * 0.04 }}
                          />
                        ))}
                      </motion.div>

                      {error && <ErrorMsg text={error} />}

                      <motion.div variants={fadeSlide}>
                        <SubmitButton
                          loading={loading}
                          text="确认验证"
                          onClick={handleVerify}
                          disabled={otp.join("").length < 6}
                        />
                      </motion.div>

                      <motion.div variants={fadeSlide} className="text-center">
                        <button
                          onClick={handleResendOtp}
                          disabled={loading || resendCooldown > 0}
                          className="text-xs transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 text-slate-400 enabled:hover:text-violet-600"
                        >
                          {resendCooldown > 0
                            ? `重新发送（${resendCooldown}s）`
                            : "没收到？重新发送"}
                        </button>
                      </motion.div>

                      <motion.div variants={fadeSlide} className="text-center border-t border-slate-100 pt-4">
                        <button
                          onClick={() => switchTo("login")}
                          className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          ← 返回登录
                        </button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {/* ════════════════════ FORGOT PASSWORD ════════════════════ */}
                {mode === "forgot" && (
                  <motion.div key="forgot" {...pageFade}>
                    <form onSubmit={handleForgotSend}>
                      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-3">
                        <motion.div variants={fadeSlide}>
                          <Input type="email" placeholder="注册时使用的邮箱" value={email} onChange={setEmail} />
                        </motion.div>

                        <motion.div variants={fadeSlide} className="flex justify-center pt-1">
                          <Turnstile
                            ref={turnstileRef}
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                            onSuccess={setTurnstileToken}
                            onError={() => setTurnstileToken(null)}
                            onExpire={() => setTurnstileToken(null)}
                            options={{ theme: "light", size: "normal" }}
                          />
                        </motion.div>

                        {error && <ErrorMsg text={error} />}

                        <motion.div variants={fadeSlide}>
                          <SubmitButton loading={loading} text="发送验证码" disabled={!turnstileToken} />
                        </motion.div>
                      </motion.div>
                    </form>

                    <motion.div
                      className="text-center mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <button onClick={() => switchTo("login")} className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        ← 返回登录
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer — always visible on login/register */}
            <AnimatePresence>
              {(mode === "login" || mode === "register") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-slate-100 px-6 py-3.5"
                >
                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    继续即表示你同意我们的
                    <a href="#" className="text-violet-500 hover:underline mx-0.5">服务条款</a>
                    和
                    <a href="#" className="text-violet-500 hover:underline mx-0.5">隐私政策</a>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {/* Back to home */}
        <motion.div
          className="text-center mt-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            ← 返回首页
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Error translation ─────────────────────────────────
function translateAuthError(msg?: string | null): string {
  if (!msg) return "操作失败，请重试"
  const m = msg.toLowerCase()
  if (m.includes("user already exists") || m.includes("email already")) return "该邮箱已注册，请直接登录"
  if (m.includes("invalid otp") || m.includes("incorrect otp")) return "验证码错误，请重新输入"
  if (m.includes("otp expired") || m.includes("expired")) return "验证码已过期，请重新发送"
  if (m.includes("too many") || m.includes("rate limit")) return "操作过于频繁，请稍后重试"
  if (m.includes("invalid email") || m.includes("email not found")) return "邮箱地址不存在"
  if (m.includes("invalid password") || m.includes("incorrect password")) return "邮箱或密码错误"
  if (m.includes("email not verified")) return "邮箱未验证，请先完成验证"
  if (m.includes("user not found")) return "账号不存在"
  return msg
}

// ─── Sub-components ────────────────────────────────────

function OAuthButton({ provider, loading, onClick }: { provider: "github" | "google"; loading: boolean; onClick: () => void }) {
  const isGithub = provider === "github"
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
        isGithub
          ? "bg-slate-900 hover:bg-slate-800 text-white"
          : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300"
      }`}
      whileHover={{ y: -1, boxShadow: isGithub ? "0 8px 20px -6px rgba(15,23,42,0.2)" : "0 8px 20px -6px rgba(100,116,139,0.12)" }}
      whileTap={{ scale: 0.98 }}
    >
      {isGithub ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      )}
      {isGithub ? "GitHub 登录" : "Google 登录"}
    </motion.button>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <span className="text-[11px] text-slate-400 font-medium">或使用邮箱</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </div>
  )
}

function Input({ type, placeholder, value, onChange, minLength, showToggle, show, onToggleShow }: {
  type: string; placeholder: string; value: string; onChange: (v: string) => void
  minLength?: number; showToggle?: boolean; show?: boolean; onToggleShow?: () => void
}) {
  const inputType = showToggle ? (show ? "text" : "password") : type
  return (
    <div className="relative">
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={minLength}
        className={`w-full px-4 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden ${showToggle ? "pr-11" : ""}`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
          tabIndex={-1}
        >
          {show ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}

function SubmitButton({ loading, text, onClick, disabled }: {
  loading: boolean; text: string; onClick?: () => void; disabled?: boolean
}) {
  return (
    <motion.button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-md shadow-violet-200/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      whileHover={!loading && !disabled ? { y: -1, boxShadow: "0 10px 24px -6px rgba(124,58,237,0.3)" } : {}}
      whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner /> 处理中...
        </span>
      ) : text}
    </motion.button>
  )
}

function ErrorMsg({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -4, height: 0 }}
      className="text-xs text-red-500 px-1"
    >
      {text}
    </motion.p>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
