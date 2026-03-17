"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { authClient, useSession } from "@/lib/auth-client"

const spring = { type: "spring" as const, stiffness: 380, damping: 30 }

interface LinkedAccount {
  id: string
  providerId: string
  accountId: string
  createdAt: Date
}

const providers = [
  {
    id: "github",
    name: "GitHub",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    color: "bg-slate-900 text-white",
    hoverColor: "hover:bg-slate-800",
  },
  {
    id: "google",
    name: "Google",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
    color: "bg-white text-slate-700 border border-slate-200",
    hoverColor: "hover:bg-slate-50",
  },
]

export default function AccountsPageWrapper() {
  return (
    <Suspense>
      <AccountsPage />
    </Suspense>
  )
}

function AccountsPage() {
  const { data: session } = useSession()
  const user = session?.user

  const [accounts, setAccounts] = useState<LinkedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [hasPassword, setHasPassword] = useState(false)

  // ── Pick up OAuth error from URL (e.g. ?error=email_doesn't_match) ──
  const searchParams = useSearchParams()
  useEffect(() => {
    const err = searchParams.get("error")
    if (err) {
      const translated: Record<string, string> = {
        "email_doesn't_match": "绑定失败：GitHub/Google 邮箱与当前账号不一致",
        "account_already_linked": "该第三方账号已绑定到其他用户",
      }
      setMsg({ type: "err", text: translated[err] || `绑定失败：${err}` })
      // Clean up URL
      window.history.replaceState({}, "", "/settings/accounts")
    }
  }, [searchParams])

  // ── Load linked accounts ────────────────────────────
  const loadAccounts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await authClient.listAccounts()
      const list = (data ?? []) as LinkedAccount[]
      setAccounts(list)
      // Check if user has a credential (email/password) account
      setHasPassword(list.some((a) => a.providerId === "credential"))
    } catch {
      // silent
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user) loadAccounts()
  }, [user, loadAccounts])

  // ── Link ────────────────────────────────────────────
  const handleLink = async (providerId: string) => {
    setActionLoading(providerId)
    setMsg(null)
    try {
      const res = await authClient.linkSocial({
        provider: providerId as "github" | "google",
        callbackURL: "/settings/accounts",
        errorCallbackURL: "/settings/accounts",
      })
      if (res.error) {
        setMsg({ type: "err", text: res.error.message || "绑定失败，请重试" })
        setActionLoading(null)
        return
      }
      if (res.data?.url) {
        // 直接跳转，不经过 React re-render
        window.location.replace(res.data.url)
        return
      }
      setMsg({ type: "err", text: "未获取到跳转链接" })
      setActionLoading(null)
    } catch {
      setMsg({ type: "err", text: "绑定失败，请重试" })
      setActionLoading(null)
    }
  }

  // ── Unlink ──────────────────────────────────────────
  const handleUnlink = async (providerId: string) => {
    // Safety: must have at least 2 login methods (or password + this provider)
    const totalMethods = accounts.length
    if (totalMethods <= 1) {
      setMsg({ type: "err", text: "至少需要保留一种登录方式" })
      return
    }
    // If removing this would leave only one non-credential method AND no password
    if (!hasPassword && totalMethods <= 2) {
      const otherProviders = accounts.filter((a) => a.providerId !== providerId && a.providerId !== "credential")
      if (otherProviders.length === 0) {
        setMsg({ type: "err", text: "至少需要保留一种登录方式，请先设置密码" })
        return
      }
    }

    setActionLoading(providerId)
    setMsg(null)

    const { error } = await authClient.unlinkAccount({ providerId })
    if (error) {
      setMsg({ type: "err", text: error.message || "解绑失败" })
    } else {
      setMsg({ type: "ok", text: "已解绑" })
      await loadAccounts()
    }
    setActionLoading(null)
  }

  const isLinked = (providerId: string) => accounts.some((a) => a.providerId === providerId)

  if (!user) {
    return <div className="flex items-center justify-center h-64 text-sm text-slate-400">加载中...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="space-y-8"
    >
      <div>
        <h1 className="text-lg font-semibold text-slate-900">关联账号</h1>
        <p className="text-sm text-slate-500 mt-0.5">管理你的第三方登录方式</p>
      </div>

      {/* 当前登录方式总览 */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">登录方式</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Email/Password */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 6L2 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">邮箱密码</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {hasPassword ? "已设置" : "未设置"}
              </span>
            </div>

            {/* Social providers */}
            {providers.map((p) => {
              const linked = isLinked(p.id)
              const account = accounts.find((a) => a.providerId === p.id)
              const isLoading = actionLoading === p.id

              return (
                <motion.div
                  key={p.id}
                  layout
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                  transition={{ layout: spring }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      p.id === "github" ? "bg-slate-900 text-white" : "bg-white border border-slate-200"
                    }`}>
                      {p.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.name}</p>
                      {linked && account ? (
                        <p className="text-xs text-slate-500">
                          已绑定 · {new Date(account.createdAt).toLocaleDateString("zh-CN")}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">未绑定</p>
                      )}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {linked ? (
                      <motion.button
                        key="unlink"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => handleUnlink(p.id)}
                        disabled={isLoading}
                        className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        whileTap={{ scale: 0.95 }}
                      >
                        {isLoading ? "处理中..." : "解绑"}
                      </motion.button>
                    ) : (
                      <motion.button
                        key="link"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => handleLink(p.id)}
                        disabled={isLoading}
                        className="text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        whileTap={{ scale: 0.95 }}
                      >
                        {isLoading ? "跳转中..." : "绑定"}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Status message */}
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`mt-4 text-xs px-3 py-2 rounded-lg ${
                msg.type === "ok" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}
            >
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Security note */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4">
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>安全提示：</strong>为确保账号安全，至少需要保留一种登录方式。
          如果你只绑定了一个第三方账号且未设置密码，该账号将无法解绑。
        </p>
      </div>
    </motion.div>
  )
}
