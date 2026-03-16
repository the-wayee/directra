"use client"

import { useState } from "react"
import Link from "next/link"
import { use } from "react"
import { cn } from "@/lib/utils"
import { mockProjects, mockShots } from "@/lib/mock/projects"
import type { Shot } from "@/lib/types"

export default function StudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = mockProjects.find((p) => p.id === id) ?? mockProjects[0]
  const [shots, setShots] = useState(mockShots)
  const [selectedShot, setSelectedShot] = useState<Shot | null>(shots[0])
  const [chatOpen, setChatOpen] = useState(true)
  const [chatInput, setChatInput] = useState("")

  function handleLockToggle(shotId: string) {
    setShots((prev) =>
      prev.map((s) => (s.id === shotId ? { ...s, locked: !s.locked } : s))
    )
    if (selectedShot?.id === shotId) {
      setSelectedShot((prev) => prev ? { ...prev, locked: !prev.locked } : prev)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-slate-50">
      {/* Studio TopBar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${id}`}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
          >
            ← 返回创作模式
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-700 truncate max-w-48">{project.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors cursor-pointer text-xs">
            ↩
          </button>
          <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors cursor-pointer text-xs">
            ↪
          </button>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button className="h-7 px-3 text-xs border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 rounded transition-colors cursor-pointer">
            保存
          </button>
          <button className="h-7 px-3 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded transition-colors cursor-pointer flex items-center gap-1">
            导出 ▾
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Shot list */}
        <div className="w-[200px] shrink-0 border-r border-slate-200 flex flex-col bg-white">
          <div className="px-3 py-2.5 border-b border-slate-200">
            <span className="text-xs text-slate-400">片段列表</span>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {shots.map((shot) => (
              <button
                key={shot.id}
                onClick={() => setSelectedShot(shot)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-left transition-colors cursor-pointer group",
                  selectedShot?.id === shot.id
                    ? "bg-violet-50 text-slate-800"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <div className={cn(
                  "w-8 h-5 rounded shrink-0 flex items-center justify-center text-[8px] border",
                  selectedShot?.id === shot.id
                    ? "bg-violet-100 border-violet-200 text-violet-600"
                    : "bg-slate-100 border-slate-200 text-slate-400"
                )}>
                  {shot.index}
                </div>
                <span className="text-xs flex-1 truncate">Shot {shot.index}</span>
                {shot.locked && <span className="text-[10px] text-slate-400">🔒</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video preview */}
          <div className="flex-1 flex items-center justify-center p-8 bg-slate-100/60">
            <div className="w-full max-w-2xl aspect-video bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center relative">
              <div className="text-4xl text-slate-300">▶</div>
              {selectedShot && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500 bg-white/90 px-2 py-1 rounded border border-slate-100">
                    Shot {selectedShot.index} · {selectedShot.type}
                  </span>
                  <span className="text-xs text-slate-400 bg-white/90 px-2 py-1 rounded border border-slate-100">
                    {selectedShot.duration}s
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-3 px-4 py-2 border-t border-slate-200 bg-white">
            <button className="text-slate-400 hover:text-slate-600 transition-colors text-xs cursor-pointer">⏮</button>
            <button className="text-slate-700 hover:text-slate-900 transition-colors cursor-pointer">▶</button>
            <button className="text-slate-400 hover:text-slate-600 transition-colors text-xs cursor-pointer">⏭</button>
            <span className="text-xs text-slate-400 font-mono ml-1">00:04.2 / 00:26.0</span>
            <div className="flex-1 mx-2 h-1 bg-slate-200 rounded-full">
              <div className="h-full w-1/6 bg-violet-500 rounded-full" />
            </div>
            <button className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">⛶</button>
          </div>
        </div>

        {/* Right: Properties panel */}
        <div className="w-[220px] shrink-0 border-l border-slate-200 flex flex-col bg-white">
          <div className="px-3 py-2.5 border-b border-slate-200">
            <span className="text-xs text-slate-400">属性</span>
          </div>
          {selectedShot ? (
            <div className="flex-1 p-3 space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">基本信息</p>
                <div className="space-y-1.5">
                  {[
                    { label: "镜头", value: `Shot ${selectedShot.index}` },
                    { label: "时长", value: `${selectedShot.duration}s` },
                    { label: "类型", value: selectedShot.type },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">台词</p>
                <p className="text-[10px] text-slate-600 leading-relaxed bg-slate-50 rounded p-2 border border-slate-100">
                  {selectedShot.script}
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <button className="w-full h-7 text-[10px] border border-slate-200 hover:border-violet-400 text-slate-500 hover:text-violet-600 rounded transition-colors cursor-pointer">
                  重新生成此片段
                </button>
                <button className="w-full h-7 text-[10px] border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer">
                  替换素材
                </button>
                <button
                  onClick={() => handleLockToggle(selectedShot.id)}
                  className={cn(
                    "w-full h-7 text-[10px] border rounded transition-colors cursor-pointer",
                    selectedShot.locked
                      ? "border-amber-200 bg-amber-50 text-amber-600 hover:border-amber-300"
                      : "border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-600"
                  )}
                >
                  {selectedShot.locked ? "🔒 已锁定 · 解锁" : "锁定"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-xs text-slate-400 text-center">选择片段查看属性</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t border-slate-200 bg-white shrink-0">
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-100">
          <span className="text-[10px] text-slate-400">时间轴</span>
          <button className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer">+ 添加轨道</button>
        </div>
        <div className="px-4 py-2 space-y-1.5 overflow-x-auto">
          {/* Time ruler */}
          <div className="flex gap-0 mb-1">
            {Array.from({ length: 27 }).map((_, i) => (
              <div key={i} className="w-8 shrink-0 text-[8px] text-slate-300 border-l border-slate-100 pl-0.5">
                {i}s
              </div>
            ))}
          </div>
          {/* Video track */}
          <TrackRow label="视频" shots={shots} selectedId={selectedShot?.id} onSelect={setSelectedShot} />
          {/* Subtitle track */}
          <TrackRowSimple label="字幕" color="bg-blue-100 border-blue-200" shots={shots} />
          {/* Music track */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400 w-10 shrink-0">音乐</span>
            <div className="h-5 flex-1 bg-emerald-50 border border-emerald-200 rounded text-[9px] text-emerald-600 flex items-center px-2">
              背景音乐 · 全程
            </div>
          </div>
        </div>
      </div>

      {/* Chat bar */}
      <div className={cn("border-t border-slate-200 bg-white shrink-0 transition-all", chatOpen ? "h-14" : "h-8")}>
        {chatOpen ? (
          <div className="flex items-center gap-2 h-full px-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="告诉我你想怎么修改... 例如：第三个镜头更紧张一点"
              className="flex-1 bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none"
            />
            <button className="h-6 px-2.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded transition-colors cursor-pointer">
              发送
            </button>
            <button
              onClick={() => setChatOpen(false)}
              className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer px-1"
            >
              ▼ 收起
            </button>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            ▲ 展开对话
          </button>
        )}
      </div>
    </div>
  )
}

function TrackRow({
  label,
  shots,
  selectedId,
  onSelect,
}: {
  label: string
  shots: Shot[]
  selectedId?: string
  onSelect: (shot: Shot) => void
}) {
  const colors = [
    "bg-violet-100 border-violet-200 text-violet-600",
    "bg-indigo-100 border-indigo-200 text-indigo-600",
    "bg-purple-100 border-purple-200 text-purple-600",
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-slate-400 w-10 shrink-0">{label}</span>
      <div className="flex gap-0.5">
        {shots.map((shot, i) => (
          <button
            key={shot.id}
            onClick={() => onSelect(shot)}
            style={{ width: `${shot.duration * 8}px` }}
            className={cn(
              "h-5 rounded text-[8px] border transition-all shrink-0 cursor-pointer truncate px-1",
              colors[i % colors.length],
              selectedId === shot.id ? "ring-1 ring-violet-400 ring-offset-1" : "hover:brightness-95",
              shot.locked ? "opacity-50" : ""
            )}
          >
            S{shot.index}
          </button>
        ))}
      </div>
    </div>
  )
}

function TrackRowSimple({
  label,
  color,
  shots,
}: {
  label: string
  color: string
  shots: Shot[]
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-slate-400 w-10 shrink-0">{label}</span>
      <div className="flex gap-0.5">
        {shots.map((shot) => (
          <div
            key={shot.id}
            style={{ width: `${shot.duration * 8}px` }}
            className={cn("h-3 rounded border shrink-0", color)}
          />
        ))}
      </div>
    </div>
  )
}
