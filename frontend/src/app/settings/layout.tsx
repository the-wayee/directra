"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const sidebarItems = [
  {
    label: "个人资料",
    href: "/settings/profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "关联账号",
    href: "/settings/accounts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    label: "订阅管理",
    href: "/settings/subscription",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <path d="M1 10h22" />
      </svg>
    ),
  },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="h-14 border-b border-slate-200 bg-white/90 backdrop-blur-sm flex items-center px-6">
        <Link href="/home" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center text-xs font-bold text-white">D</div>
          <span className="font-semibold text-sm text-slate-900 tracking-tight">Directra</span>
        </Link>
        <span className="mx-3 text-slate-300">/</span>
        <span className="text-sm text-slate-500">设置</span>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <nav className="w-48 shrink-0">
          <div className="space-y-0.5">
            {sidebarItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${
                    active
                      ? "text-violet-700 font-medium bg-violet-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="settings-nav-indicator"
                      className="absolute inset-0 bg-violet-50 rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <Link
              href="/home"
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              返回工作台
            </Link>
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
