"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
            D
          </div>
          <span className="font-semibold text-sm text-slate-900 tracking-tight">Directra</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/new">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white border-0 h-8 text-xs px-3 cursor-pointer">
              + 新建项目
            </Button>
          </Link>
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600 cursor-pointer hover:bg-slate-300 transition-colors">
            U
          </div>
        </div>
      </div>
    </header>
  )
}
