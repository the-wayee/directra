"use client"

import { useState, useRef, useEffect, use } from "react"
import { motion } from "framer-motion"
import { AppSidebar, SidebarToggle } from "@/components/shared/app-sidebar"
import { useProjectsStore } from "@/lib/store/projects"
import type { Message } from "@/lib/types"

// ─── Mock AI responses（后续替换为 Python SSE 流式回复）─────────────────────
const mockReplies = [
  `我理解你的需求了。在开始之前，我想确认几个关键点：

**视频时长**：你期望多长？30秒短片还是3-5分钟的完整视频？

**目标受众**：主要给谁看？社交媒体观众、客户演示、还是内部培训？

**风格偏好**：偏向轻松活泼、专业严肃、还是电影感？`,

  `好的，方向很清晰了。我来帮你规划一下：

**项目方向**
- 类型：产品宣传短片
- 时长：约 30 秒
- 风格：轻快、现代感
- 受众：社交媒体用户

我会按这个方向生成脚本和分镜，你随时可以调整。先确认这个方向吗？`,

  `脚本初稿已生成，一共 4 个段落：

**开场（0-5秒）**：产品全景展示 + 品牌 Logo 淡入
**功能亮点（5-15秒）**：3 个核心功能快切 + 字幕说明
**使用场景（15-25秒）**：真实使用场景演示
**结尾（25-30秒）**：品牌标语 + CTA

你觉得节奏怎么样？哪个部分需要调整？`,
]

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const replyIndex = useRef(0)

  const conversation = useProjectsStore((s) => s.conversations.find((c) => c.id === id))
  const setActiveId = useProjectsStore((s) => s.setActiveId)
  const addMessage = useProjectsStore((s) => s.addMessage)
  const addMessageToDb = useProjectsStore((s) => s.addMessageToDb)
  const loadProjectMessages = useProjectsStore((s) => s.loadProjectMessages)
  const loaded = useProjectsStore((s) => s.loaded)
  const loadProjects = useProjectsStore((s) => s.loadProjects)

  // Load projects list if not loaded (direct page visit)
  useEffect(() => {
    if (!loaded) loadProjects()
  }, [loaded, loadProjects])

  // Load messages for this project from DB
  useEffect(() => {
    if (loaded && conversation && conversation.messages.length === 0) {
      loadProjectMessages(id)
    }
  }, [id, loaded, conversation, loadProjectMessages])

  // Set active conversation
  useEffect(() => {
    setActiveId(id)
    return () => setActiveId(null)
  }, [id, setActiveId])

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 200) + "px"
  }, [input])

  // Simulate AI reply when a new user message has no following assistant message
  // TODO: Replace with real Python SSE streaming
  useEffect(() => {
    if (!conversation) return
    const msgs = conversation.messages
    if (msgs.length === 0) return
    const last = msgs[msgs.length - 1]
    if (last.role !== "user") return

    // Simulate typing delay
    setIsTyping(true)
    const timer = setTimeout(async () => {
      const content = mockReplies[replyIndex.current % mockReplies.length]
      replyIndex.current++
      try {
        // Persist mock reply to DB
        await addMessageToDb(id, { role: "assistant", type: "text", content })
      } catch {
        // Fallback: add locally only
        addMessage(id, {
          id: `msg-${Date.now()}`,
          role: "assistant",
          type: "text",
          content,
        })
      }
      setIsTyping(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [conversation?.messages.length, conversation, id, addMessage, addMessageToDb])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    const content = input.trim()
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"

    try {
      await addMessageToDb(id, { role: "user", type: "text", content })
    } catch {
      // Fallback: local only
      addMessage(id, { id: `msg-${Date.now()}`, role: "user", type: "text", content })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const messages = conversation?.messages ?? []

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <AppSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center h-14 px-4 border-b border-slate-100 shrink-0 bg-white/80 backdrop-blur-sm">
          {!sidebarOpen && <SidebarToggle onClick={() => setSidebarOpen(true)} />}
          <h1 className="text-sm font-medium text-slate-700 truncate ml-1">
            {conversation?.title || "新对话"}
          </h1>
          <div className="flex-1" />
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 3l10 5-10 5V3z" fill="white" />
                  </svg>
                </div>
                <div className="flex items-center gap-1 py-3">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                  />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="border-t border-slate-100 bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 focus-within:shadow-md focus-within:border-violet-300 focus-within:ring-2 focus-within:ring-violet-100">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="继续对话... (Enter 发送，Shift+Enter 换行)"
                rows={1}
                className="w-full resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 px-4 pt-3.5 pb-11 rounded-2xl focus:outline-none min-h-[48px] max-h-[200px]"
              />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 pb-2.5">
                <div className="flex items-center gap-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer" title="上传素材">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.49" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                    input.trim() && !isTyping
                      ? "bg-violet-600 text-white hover:bg-violet-500 shadow-sm"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Message bubble ─────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] bg-violet-600 rounded-2xl rounded-tr-md px-4 py-3 text-sm text-white leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M3 3l10 5-10 5V3z" fill="white" />
        </svg>
      </div>
      <div className="flex-1 text-sm text-slate-700 leading-relaxed max-w-none min-w-0">
        <MarkdownText text={message.content} />
      </div>
    </motion.div>
  )
}

function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n")
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />
        // Bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g)
        return (
          <p key={i}>
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>
              }
              return <span key={j}>{part}</span>
            })}
          </p>
        )
      })}
    </div>
  )
}
