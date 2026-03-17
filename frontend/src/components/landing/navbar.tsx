"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useSession } from "@/lib/auth-client"

const navLinks = [
  { label: "功能", href: "#features" },
  { label: "工作流程", href: "#how-it-works" },
  { label: "领域", href: "#skills" },
  { label: "定价", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const { data: session } = useSession()
  const user = session?.user

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50)
  })

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-violet-200">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 5-10 5V3z" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-900 tracking-tight">
            Directra
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/70 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA — 根据登录状态切换 */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/home"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-200/50 hover:shadow-lg hover:shadow-violet-300/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                进入工作台
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 7h12M8 2l5 5-5 5" />
                </svg>
              </Link>
              <Link href="/home" className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-transparent hover:ring-violet-200 transition-all">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-700">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:block text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-200/50 hover:shadow-lg hover:shadow-violet-300/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                免费开始
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 7h12M8 2l5 5-5 5" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
