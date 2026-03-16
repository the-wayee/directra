"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Project, Shot, ScriptSegment } from "@/lib/types"

const PHASES = [
  { id: "BRIEF", label: "概要" },
  { id: "OUTLINE", label: "大纲" },
  { id: "SCRIPT", label: "脚本" },
  { id: "STORYBOARD", label: "分镜" },
] as const

interface ContentPreviewProps {
  project: Project
  shots: Shot[]
  script: ScriptSegment[]
  onShotUpdate: (shotId: string, changes: Partial<Shot>) => void
  onScriptUpdate: (segId: string, changes: Partial<ScriptSegment>) => void
  onStartGeneration: () => void
}

export function ContentPreview({
  project,
  shots,
  script,
  onShotUpdate,
  onScriptUpdate,
  onStartGeneration,
}: ContentPreviewProps) {
  const phaseOrder = ["BRIEF", "OUTLINE", "SCRIPT", "STORYBOARD"]
  const currentPhaseIndex = phaseOrder.indexOf(
    project.phase === "STUDIO" ? "STORYBOARD" : project.phase
  )
  const [activeTab, setActiveTab] = useState<string>(
    project.phase === "STUDIO" ? "STORYBOARD" : project.phase
  )

  return (
    <div className="flex flex-col h-full">
      {/* Phase tabs */}
      <div className="border-b border-slate-200 px-4 py-2.5 flex items-center gap-1 shrink-0 bg-white">
        {PHASES.map((phase, index) => {
          const isDone = index < currentPhaseIndex
          const isCurrent = index === currentPhaseIndex
          const isAvailable = index <= currentPhaseIndex

          return (
            <button
              key={phase.id}
              onClick={() => isAvailable && setActiveTab(phase.id)}
              disabled={!isAvailable}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all",
                isAvailable ? "cursor-pointer" : "cursor-not-allowed",
                activeTab === phase.id
                  ? "bg-slate-100 text-slate-800"
                  : isDone
                  ? "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  : isCurrent
                  ? "text-slate-600 hover:bg-slate-50"
                  : "text-slate-300"
              )}
            >
              <span
                className={cn(
                  "w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] shrink-0",
                  isDone
                    ? "border-emerald-400 bg-emerald-50 text-emerald-500"
                    : isCurrent
                    ? "border-violet-400 bg-violet-50 text-violet-500"
                    : "border-slate-200 text-slate-300"
                )}
              >
                {isDone ? "✓" : index + 1}
              </span>
              {phase.label}
              {index < PHASES.length - 1 && (
                <span className="text-slate-300 ml-0.5 text-[10px]">›</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "BRIEF" && project.brief && (
          <BriefView brief={project.brief} />
        )}
        {activeTab === "OUTLINE" && project.outline && (
          <OutlineView outline={project.outline} />
        )}
        {activeTab === "SCRIPT" && (
          <ScriptView
            segments={script}
            onUpdate={onScriptUpdate}
          />
        )}
        {activeTab === "STORYBOARD" && (
          <StoryboardView
            shots={shots}
            onUpdate={onShotUpdate}
            onStartGeneration={onStartGeneration}
          />
        )}
      </div>
    </div>
  )
}

// ─── Brief View ───────────────────────────────────────────────────────────────

function BriefView({ brief }: { brief: NonNullable<Project["brief"]> }) {
  return (
    <div className="space-y-3 max-w-xl">
      <h3 className="text-xs font-medium text-slate-400">项目概要</h3>
      <div className="rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
        {[
          { label: "视频类型", value: brief.videoType },
          { label: "目标受众", value: brief.targetAudience },
          { label: "预计时长", value: brief.duration },
          { label: "核心主题", value: brief.coreTopic },
          { label: "叙事方式", value: brief.narrativeStyle },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-4 px-4 py-2.5">
            <span className="w-20 shrink-0 text-xs text-slate-400">{label}</span>
            <span className="text-sm text-slate-700">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Outline View ─────────────────────────────────────────────────────────────

function OutlineView({ outline }: { outline: NonNullable<Project["outline"]> }) {
  return (
    <div className="space-y-3 max-w-xl">
      <h3 className="text-xs font-medium text-slate-400">大纲结构</h3>
      <div className="space-y-2">
        {outline.items.map((act) => (
          <div
            key={act.id}
            className="rounded-lg border border-slate-200 bg-white overflow-hidden"
          >
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-violet-600 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded">
                  Act {act.act}
                </span>
                <span className="text-sm font-medium text-slate-700">{act.title}</span>
              </div>
              <span className="text-xs text-slate-400">{act.duration}</span>
            </div>
            <div className="px-3.5 py-2 space-y-1">
              {act.scenes.map((scene) => (
                <div
                  key={scene.id}
                  className="flex items-center gap-2 text-xs text-slate-500 py-0.5"
                >
                  <span className="text-slate-300 font-mono">└─</span>
                  <span>{scene.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Script View（可编辑）─────────────────────────────────────────────────────

function ScriptView({
  segments,
  onUpdate,
}: {
  segments: ScriptSegment[]
  onUpdate: (id: string, changes: Partial<ScriptSegment>) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)

  if (segments.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-400">
        脚本将在大纲确认后生成
      </div>
    )
  }

  const grouped: Record<string, ScriptSegment[]> = {}
  for (const seg of segments) {
    if (!grouped[seg.actTitle]) grouped[seg.actTitle] = []
    grouped[seg.actTitle].push(seg)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-slate-400">脚本草稿 · 点击任意段落直接编辑</h3>
        <span className="text-[10px] text-slate-400">{segments.length} 个段落</span>
      </div>

      {Object.entries(grouped).map(([actTitle, segs]) => (
        <div key={actTitle} className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] text-slate-400 shrink-0">{actTitle}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          {segs.map((seg) => (
            <ScriptSegmentCard
              key={seg.id}
              segment={seg}
              isEditing={editingId === seg.id}
              onStartEdit={() => setEditingId(seg.id)}
              onDoneEdit={() => setEditingId(null)}
              onUpdate={(changes) => onUpdate(seg.id, changes)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function ScriptSegmentCard({
  segment,
  isEditing,
  onStartEdit,
  onDoneEdit,
  onUpdate,
}: {
  segment: ScriptSegment
  isEditing: boolean
  onStartEdit: () => void
  onDoneEdit: () => void
  onUpdate: (changes: Partial<ScriptSegment>) => void
}) {
  const [voiceover, setVoiceover] = useState(segment.voiceover)
  const [visualNote, setVisualNote] = useState(segment.visualNote)

  function handleSave() {
    onUpdate({ voiceover, visualNote })
    onDoneEdit()
  }

  return (
    <div
      className={cn(
        "rounded-lg border transition-all",
        isEditing
          ? "border-violet-300 bg-white shadow-sm shadow-violet-100"
          : "border-slate-200 bg-white hover:border-slate-300 cursor-pointer"
      )}
      onClick={() => !isEditing && onStartEdit()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-100">
        <span className="text-xs font-medium text-slate-700">{segment.sceneTitle}</span>
        <span className="text-[10px] text-slate-400">{segment.duration}</span>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-3">
        {/* Voiceover */}
        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">口播</span>
          {isEditing ? (
            <textarea
              value={voiceover}
              onChange={(e) => setVoiceover(e.target.value)}
              className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded p-2 resize-none min-h-[80px] outline-none focus:border-violet-400 leading-relaxed"
              autoFocus
            />
          ) : (
            <p className="text-sm text-slate-700 leading-relaxed">{segment.voiceover}</p>
          )}
        </div>

        {/* Visual note */}
        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">画面说明</span>
          {isEditing ? (
            <input
              value={visualNote}
              onChange={(e) => setVisualNote(e.target.value)}
              className="w-full text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-violet-400"
            />
          ) : (
            <p className="text-xs text-slate-400 italic">{segment.visualNote}</p>
          )}
        </div>

        {/* Edit actions */}
        {isEditing && (
          <div className="flex gap-2 pt-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleSave() }}
              className="h-6 px-3 text-[10px] bg-violet-600 hover:bg-violet-500 text-white rounded transition-colors cursor-pointer"
            >
              保存
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDoneEdit() }}
              className="h-6 px-3 text-[10px] border border-slate-200 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
            >
              取消
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Storyboard View（纯文字分镜 + 生成入口）────────────────────────────────

function StoryboardView({
  shots,
  onUpdate,
  onStartGeneration,
}: {
  shots: Shot[]
  onUpdate: (id: string, changes: Partial<Shot>) => void
  onStartGeneration: () => void
}) {
  const allConfirmed = shots.length > 0
  const hasGenerated = shots.some((s) => s.imageUrl || s.generationStatus === "done")

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-slate-400">分镜方案 · {shots.length} 个镜头</h3>
        <span className="text-xs text-slate-400">
          总时长约 {shots.reduce((acc, s) => acc + s.duration, 0)}s
        </span>
      </div>

      {/* Shot list */}
      <div className="space-y-2">
        {shots.map((shot) => (
          <ShotTextCard key={shot.id} shot={shot} onUpdate={(c) => onUpdate(shot.id, c)} />
        ))}
      </div>

      {/* Generate CTA */}
      {allConfirmed && !hasGenerated && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center space-y-3 mt-4">
          <p className="text-sm text-slate-700 font-medium">分镜文字方案已就绪</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            确认所有镜头描述后，可以开始生成图片预览。<br />
            图片生成需要几分钟，生成期间可以继续对话。
          </p>
          <button
            onClick={onStartGeneration}
            className="inline-flex items-center gap-2 h-9 px-5 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors cursor-pointer"
          >
            ✨ 开始生成分镜图片
          </button>
          <p className="text-[10px] text-slate-400">视频生成将在图片确认后进行</p>
        </div>
      )}
    </div>
  )
}

function ShotTextCard({
  shot,
  onUpdate,
}: {
  shot: Shot
  onUpdate: (changes: Partial<Shot>) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(shot.description)
  const [script, setScript] = useState(shot.script)

  function handleSave() {
    onUpdate({ description, script })
    setIsEditing(false)
  }

  return (
    <div
      className={cn(
        "rounded-lg border transition-all bg-white",
        shot.locked
          ? "border-amber-200 bg-amber-50/30"
          : isEditing
          ? "border-violet-300 shadow-sm shadow-violet-100"
          : "border-slate-200 hover:border-slate-300"
      )}
    >
      {/* Shot header */}
      <div className="flex items-center gap-3 px-3.5 py-2.5 border-b border-slate-100">
        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
          #{shot.index}
        </span>
        <span className="text-[10px] text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
          {shot.type}
        </span>
        <span className="text-[10px] text-slate-400">{shot.duration}s</span>
        <div className="flex-1" />
        {shot.locked ? (
          <button
            onClick={() => onUpdate({ locked: false })}
            className="text-[10px] text-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
          >
            🔒 已锁定
          </button>
        ) : (
          !isEditing && (
            <div className="flex gap-1.5">
              <button
                onClick={() => setIsEditing(true)}
                className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer px-1"
              >
                编辑
              </button>
              <button
                onClick={() => onUpdate({ locked: true })}
                className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer px-1"
              >
                锁定
              </button>
            </div>
          )
        )}
      </div>

      {/* Shot content */}
      <div className="p-3.5 space-y-3">
        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">画面</span>
          {isEditing ? (
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 outline-none focus:border-violet-400"
            />
          ) : (
            <p className="text-sm text-slate-700">{shot.description}</p>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-[9px] text-slate-400 uppercase tracking-wider">台词</span>
          {isEditing ? (
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded p-2 resize-none min-h-[60px] outline-none focus:border-violet-400 leading-relaxed italic"
            />
          ) : (
            <p className="text-xs text-slate-500 italic leading-relaxed">"{shot.script}"</p>
          )}
        </div>

        {/* Generation status */}
        {shot.generationStatus === "generating" && (
          <div className="flex items-center gap-1.5 text-[10px] text-violet-500">
            <span className="w-3 h-3 border border-violet-400 border-t-transparent rounded-full animate-spin" />
            图片生成中...
          </div>
        )}
        {shot.generationStatus === "done" && shot.imageUrl && (
          <img
            src={shot.imageUrl}
            alt={`Shot ${shot.index}`}
            className="w-full aspect-video object-cover rounded border border-slate-200"
          />
        )}

        {isEditing && (
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              className="h-6 px-3 text-[10px] bg-violet-600 hover:bg-violet-500 text-white rounded transition-colors cursor-pointer"
            >
              保存
            </button>
            <button
              onClick={() => { setDescription(shot.description); setScript(shot.script); setIsEditing(false) }}
              className="h-6 px-3 text-[10px] border border-slate-200 text-slate-400 rounded transition-colors cursor-pointer"
            >
              取消
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
