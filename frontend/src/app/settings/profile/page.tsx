"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { authClient, useSession } from "@/lib/auth-client"

const spring = { type: "spring" as const, stiffness: 380, damping: 30 }

export default function ProfilePage() {
  const { data: session } = useSession()
  const user = session?.user

  const [name, setName] = useState("")
  const [nameLoading, setNameLoading] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  // ── 修改名称 ──────────────────────────────────────
  const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return
    setNameLoading(true)
    setNameMsg(null)

    const { error } = await authClient.updateUser({ name: name.trim() })
    if (error) {
      setNameMsg({ type: "err", text: error.message || "修改失败" })
    } else {
      setNameMsg({ type: "ok", text: "名称已更新" })
      setName("")
    }
    setNameLoading(false)
  }

  // ── 修改密码 ──────────────────────────────────────
  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newPwd.length < 8) {
      setPwdMsg({ type: "err", text: "新密码至少 8 个字符" })
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: "err", text: "两次输入的密码不一致" })
      return
    }
    setPwdLoading(true)
    setPwdMsg(null)

    const { error } = await authClient.changePassword({
      currentPassword: currentPwd,
      newPassword: newPwd,
      revokeOtherSessions: true,
    })
    if (error) {
      const msg = error.message?.toLowerCase().includes("incorrect")
        ? "当前密码不正确"
        : error.message || "修改失败"
      setPwdMsg({ type: "err", text: msg })
    } else {
      setPwdMsg({ type: "ok", text: "密码已更新" })
      setCurrentPwd("")
      setNewPwd("")
      setConfirmPwd("")
    }
    setPwdLoading(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-slate-400">
        加载中...
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="space-y-8"
    >
      <div>
        <h1 className="text-lg font-semibold text-slate-900">个人资料</h1>
        <p className="text-sm text-slate-500 mt-0.5">管理你的账号信息</p>
      </div>

      {/* ── 基本信息 ── */}
      <Section title="基本信息">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-violet-100 flex items-center justify-center text-lg font-semibold text-violet-700 shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateName} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">显示名称</label>
            <input
              type="text"
              placeholder={user.name || "输入新的名称"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-sm px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              type="submit"
              disabled={nameLoading || !name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              whileTap={{ scale: 0.97 }}
            >
              {nameLoading ? "保存中..." : "保存"}
            </motion.button>
            {nameMsg && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-xs ${nameMsg.type === "ok" ? "text-emerald-600" : "text-red-500"}`}
              >
                {nameMsg.text}
              </motion.span>
            )}
          </div>
        </form>
      </Section>

      {/* ── 修改密码 ── */}
      <Section title="修改密码">
        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">当前密码</label>
            <PasswordField value={currentPwd} onChange={setCurrentPwd} show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} placeholder="输入当前密码" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">新密码</label>
            <PasswordField value={newPwd} onChange={setNewPwd} show={showNew} onToggle={() => setShowNew((v) => !v)} placeholder="至少 8 个字符" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">确认新密码</label>
            <PasswordField value={confirmPwd} onChange={setConfirmPwd} show={showNew} onToggle={() => setShowNew((v) => !v)} placeholder="再次输入新密码" />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <motion.button
              type="submit"
              disabled={pwdLoading || !currentPwd || !newPwd || !confirmPwd}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              whileTap={{ scale: 0.97 }}
            >
              {pwdLoading ? "更新中..." : "更新密码"}
            </motion.button>
            {pwdMsg && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-xs ${pwdMsg.type === "ok" ? "text-emerald-600" : "text-red-500"}`}
              >
                {pwdMsg.text}
              </motion.span>
            )}
          </div>
        </form>
      </Section>
    </motion.div>
  )
}

// ─── Shared components ───────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-800 mb-4">{title}</h2>
      {children}
    </div>
  )
}

function PasswordField({ value, onChange, show, onToggle, placeholder }: {
  value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder: string
}) {
  return (
    <div className="relative max-w-sm">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all placeholder:text-slate-400 [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        tabIndex={-1}
      >
        {show ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  )
}
