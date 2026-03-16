"use client"

import { useState } from "react"
import Link from "next/link"
import { use } from "react"
import { ChatPanel } from "@/components/agent/chat-panel"
import { ContentPreview } from "@/components/agent/content-preview"
import { SkillBadge } from "@/components/shared/status-badge"
import { mockProjects, mockMessages, mockShots, mockScript } from "@/lib/mock/projects"
import type { Message, Shot, ScriptSegment } from "@/lib/types"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = mockProjects.find((p) => p.id === id) ?? mockProjects[0]

  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [shots, setShots] = useState<Shot[]>(mockShots)
  const [script, setScript] = useState<ScriptSegment[]>(mockScript)

  function handleConfirm(confirmationId: string) {
    setMessages((prev) =>
      prev.map((m) =>
        m.confirmationId === confirmationId ? { ...m, confirmed: true } : m
      )
    )
  }

  function handleSend(text: string) {
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      type: "text",
      content: text,
    }
    setMessages((prev) => [...prev, userMsg])

    setTimeout(() => {
      const replyMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        type: "text",
        content: "收到，我来帮你调整。右侧内容已更新，请查看是否符合你的预期。",
      }
      setMessages((prev) => [...prev, replyMsg])
    }, 600)
  }

  function handleShotUpdate(shotId: string, changes: Partial<Shot>) {
    setShots((prev) => prev.map((s) => (s.id === shotId ? { ...s, ...changes } : s)))
  }

  function handleScriptUpdate(segId: string, changes: Partial<ScriptSegment>) {
    setScript((prev) => prev.map((s) => (s.id === segId ? { ...s, ...changes } : s)))
  }

  function handleStartGeneration() {
    setShots((prev) =>
      prev.map((s) => (!s.locked ? { ...s, generationStatus: "generating" as const } : s))
    )
    setTimeout(() => {
      setShots((prev) =>
        prev.map((s) =>
          s.generationStatus === "generating"
            ? { ...s, generationStatus: "done" as const }
            : s
        )
      )
      const doneMsg: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        type: "text",
        content: "分镜图片已生成完毕。你可以在右侧查看每个镜头的效果，有不满意的直接告诉我，我来重新生成该镜头。\n\n全部满意后，可以进入 Studio 进行最终剪辑和视频合成。",
      }
      setMessages((prev) => [...prev, doneMsg])
    }, 3000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Sub-header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← 项目列表
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-medium text-slate-800 max-w-48 truncate">
            {project.title}
          </span>
          <SkillBadge skill={project.skill} />
        </div>
        <Link
          href={`/projects/${id}/studio`}
          className="flex items-center gap-1.5 h-7 px-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded border border-slate-200 hover:border-slate-300 transition-all"
        >
          进入 Studio ↗
        </Link>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat */}
        <div className="w-[400px] shrink-0 border-r border-slate-200 flex flex-col overflow-hidden bg-white">
          <ChatPanel
            messages={messages}
            onConfirm={handleConfirm}
            onSend={handleSend}
            phase={project.phase}
          />
        </div>

        {/* Right: Content preview */}
        <div className="flex-1 overflow-hidden bg-slate-50">
          <ContentPreview
            project={project}
            shots={shots}
            script={script}
            onShotUpdate={handleShotUpdate}
            onScriptUpdate={handleScriptUpdate}
            onStartGeneration={handleStartGeneration}
          />
        </div>
      </div>
    </div>
  )
}
