"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useProjectsStore } from "@/lib/store/projects"
import { useSession, signOut } from "@/lib/auth-client"

interface AppSidebarProps {
  open: boolean
  onToggle: () => void
}

export function AppSidebar({ open, onToggle }: AppSidebarProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const { conversations, activeId, removeProject } = useProjectsStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [menuOpen])

  // Group conversations by date
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const groups: { label: string; items: typeof conversations }[] = []
  const todayItems = conversations.filter((c) => {
    const d = new Date(c.updatedAt)
    return d.toDateString() === today.toDateString()
  })
  const yesterdayItems = conversations.filter((c) => {
    const d = new Date(c.updatedAt)
    return d.toDateString() === yesterday.toDateString()
  })
  const olderItems = conversations.filter((c) => {
    const d = new Date(c.updatedAt)
    return d.toDateString() !== today.toDateString() && d.toDateString() !== yesterday.toDateString()
  })

  if (todayItems.length) groups.push({ label: "今天", items: todayItems })
  if (yesterdayItems.length) groups.push({ label: "昨天", items: yesterdayItems })
  if (olderItems.length) groups.push({ label: "更早", items: olderItems })

  const handleSignOut = async () => {
    setMenuOpen(false)
    await signOut()
    router.push("/")
  }

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative flex flex-col border-r border-slate-200 bg-white overflow-hidden shrink-0 h-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 5-10 5V3z" fill="white" />
                </svg>
              </div>
              <span className="font-semibold text-sm text-slate-900 tracking-tight">Directra</span>
            </Link>
            <button
              onClick={onToggle}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 3v18" />
              </svg>
            </button>
          </div>

          {/* New chat */}
          <div className="px-3 pt-3 pb-1 shrink-0">
            <Link
              href="/home"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              新对话
            </Link>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto px-3 py-2">
            {groups.map((group) => (
              <div key={group.label} className="mb-3">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider px-2 mb-1">{group.label}</p>
                <div className="space-y-0.5">
                  {group.items.map((conv) => (
                    <div key={conv.id} className="relative group/item">
                      <Link
                        href={`/projects/${conv.id}`}
                        className={`flex items-center gap-2 px-2.5 py-2 text-sm rounded-lg transition-colors ${
                          activeId === conv.id
                            ? "bg-slate-100 text-slate-900 font-medium"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-slate-400">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className={`truncate flex-1 ${conv.titleGenerating ? "text-slate-400 italic" : ""}`}>
                          {conv.titleGenerating ? "生成标题中..." : conv.title}
                        </span>
                      </Link>
                      <button
                        onClick={async (e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          await removeProject(conv.id)
                          if (activeId === conv.id) router.push("/home")
                        }}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/item:opacity-100 cursor-pointer"
                        title="删除对话"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer — user */}
          <div className="border-t border-slate-100 px-3 py-2 shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-[10px] font-medium text-violet-700">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <span className="truncate flex-1 text-left">{user?.name || user?.email || "用户"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {/* Popup menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-14 left-3 right-3 bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 py-1 z-50"
                >
                  <Link
                    href="/settings/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    用户资料
                  </Link>
                  <Link
                    href="/settings/accounts"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    关联账号
                  </Link>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      退出登录
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

// Toggle button shown when sidebar is closed
export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
      </svg>
    </motion.button>
  )
}
