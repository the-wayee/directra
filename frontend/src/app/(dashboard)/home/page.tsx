"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AppSidebar, SidebarToggle } from "@/components/shared/app-sidebar"
import { useProjectsStore } from "@/lib/store/projects"

// Load projects on first mount
function useLoadProjects() {
  const loadProjects = useProjectsStore((s) => s.loadProjects)
  const loaded = useProjectsStore((s) => s.loaded)
  useEffect(() => {
    if (!loaded) loadProjects()
  }, [loaded, loadProjects])
}

const suggestions = [
  {
    icon: "🎬",
    title: "剪辑一段产品宣传片",
    desc: "从素材到成片，AI 帮你完成剪辑",
  },
  {
    icon: "📚",
    title: "做一个 5 分钟科普视频",
    desc: "知识讲解 + 动画分镜 + 配音",
  },
  {
    icon: "✂️",
    title: "把长视频剪成短视频",
    desc: "AI 识别高光片段，自动裁剪",
  },
  {
    icon: "🎨",
    title: "儿童故事动画",
    desc: "角色一致的故事视频，自动配音",
  },
]

export default function HomePage() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const createConversation = useProjectsStore((s) => s.createConversation)
  const setActiveId = useProjectsStore((s) => s.setActiveId)

  useLoadProjects()

  // Clear active conversation when on home
  useEffect(() => {
    setActiveId(null)
  }, [setActiveId])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"
  }, [input])

  const handleSubmit = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      const conversationId = await createConversation(input.trim())
      router.push(`/c/${conversationId}`)
    } catch (err) {
      console.error("创建对话失败:", err)
      setError(err instanceof Error ? err.message : String(err))
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <AppSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center h-14 px-4 shrink-0">
          {!sidebarOpen && <SidebarToggle onClick={() => setSidebarOpen(true)} />}
          <div className="flex-1" />
        </header>

        {/* Center — chat input */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-2xl"
          >
            {/* Brand */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 25 }}
                className="inline-flex items-center gap-2 mb-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200/50">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path d="M3 3l10 5-10 5V3z" fill="white" />
                  </svg>
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-semibold text-slate-900 mb-2"
              >
                告诉我你想做什么视频
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm text-slate-500"
              >
                从创意到成片，AI 帮你完成脚本、分镜、剪辑全流程
              </motion.p>
            </div>

            {/* Input box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100 hover:shadow-md hover:border-slate-300 transition-all duration-200 focus-within:shadow-md focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="描述你想做的视频，比如：帮我剪辑一段 30 秒的产品宣传片..."
                rows={1}
                className="w-full resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 px-4 pt-4 pb-12 rounded-2xl focus:outline-none min-h-[52px] max-h-[200px]"
              />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" title="上传素材">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() || sending}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                    input.trim() && !sending
                      ? "bg-violet-600 text-white hover:bg-violet-500 shadow-sm"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>

            {/* Error display */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <strong>错误：</strong>{error}
                <button onClick={() => setError(null)} className="ml-2 underline">关闭</button>
              </div>
            )}

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="grid grid-cols-2 gap-2 mt-4"
            >
              {suggestions.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  onClick={() => {
                    setInput(s.title)
                    textareaRef.current?.focus()
                  }}
                  className="flex items-start gap-3 px-3.5 py-3 text-left bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <span className="text-lg shrink-0 mt-0.5">{s.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{s.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{s.desc}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
