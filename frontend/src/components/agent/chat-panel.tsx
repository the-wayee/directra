"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import type { Message, ProjectPhase } from "@/lib/types"

interface ChatPanelProps {
  messages: Message[]
  onConfirm: (confirmationId: string) => void
  onSend: (text: string) => void
  phase: ProjectPhase
}

export function ChatPanel({ messages, onConfirm, onSend, phase }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSend() {
    if (!input.trim()) return
    onSend(input.trim())
    setInput("")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} onConfirm={onConfirm} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-3">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="告诉 Directra 你的想法... (Enter 发送，Shift+Enter 换行)"
            className="min-h-[72px] max-h-32 resize-none bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm pr-16 focus-visible:ring-violet-500/40 focus-visible:border-violet-600/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute bottom-2.5 right-2.5 h-7 px-2.5 text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({
  message,
  onConfirm,
}: {
  message: Message
  onConfirm: (id: string) => void
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-violet-600 rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-white">
          {message.content}
        </div>
      </div>
    )
  }

  if (message.type === "confirmation") {
    return <ConfirmationCard message={message} onConfirm={onConfirm} />
  }

  return (
    <div className="flex gap-2.5">
      <div className="w-6 h-6 rounded bg-violet-100 border border-violet-200 flex items-center justify-center text-xs text-violet-600 shrink-0 mt-0.5">
        D
      </div>
      <div className="flex-1 text-sm text-slate-700 leading-relaxed max-w-none">
        <MarkdownText text={message.content} />
      </div>
    </div>
  )
}

function ConfirmationCard({
  message,
  onConfirm,
}: {
  message: Message
  onConfirm: (id: string) => void
}) {
  const isConfirmed = message.confirmed

  return (
    <div className="flex gap-2.5">
      <div className="w-6 h-6 rounded bg-violet-100 border border-violet-200 flex items-center justify-center text-xs text-violet-600 shrink-0 mt-0.5">
        D
      </div>
      <div
        className={cn(
          "flex-1 rounded-lg border p-3.5 transition-all",
          isConfirmed
            ? "border-slate-200 bg-slate-50 opacity-60"
            : "border-slate-200 bg-white border-l-violet-500 border-l-2"
        )}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm font-medium text-slate-800">
            {isConfirmed ? "✓ " : "📋 "}
            {message.content}
          </span>
        </div>
        {message.confirmationDescription && (
          <p className="text-xs text-slate-500 mb-3">{message.confirmationDescription}</p>
        )}
        {!isConfirmed && (
          <div className="flex gap-2">
            <button
              onClick={() => onConfirm(message.confirmationId!)}
              className="h-7 px-3 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded transition-colors cursor-pointer"
            >
              ✓ 确认，继续生成
            </button>
            <button className="h-7 px-3 text-xs border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 rounded transition-colors cursor-pointer">
              ✎ 我想修改
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function MarkdownText({ text }: { text: string }) {
  // Simple inline markdown: **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-slate-900 font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
