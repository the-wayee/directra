// ─── Project ─────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | "DRAFT"
  | "INTENT_PARSED"
  | "SKILL_SELECTED"
  | "BRIEF_CONFIRMED"
  | "OUTLINE_CONFIRMED"
  | "SCRIPT_CONFIRMED"
  | "STORYBOARD_CONFIRMED"
  | "GENERATING"
  | "WAITING_CONFIRMATION"
  | "EDITING"
  | "EXPORTED"

export type ProjectPhase =
  | "BRIEF"
  | "OUTLINE"
  | "SCRIPT"
  | "STORYBOARD"
  | "STUDIO"

export interface Project {
  id: string
  title: string
  skill: SkillId
  status: ProjectStatus
  phase: ProjectPhase
  createdAt: string
  updatedAt: string
  thumbnail?: string | null
  brief?: Brief
  outline?: Outline
  shots?: Shot[]
}

// ─── Skill ───────────────────────────────────────────────────────────────────

export type SkillId =
  | "knowledge"
  | "marketing"
  | "children_story"
  | "course"
  | "vlog"
  | "news"

export interface Skill {
  id: SkillId
  name: string
  description: string
  icon: string
  tags: string[]
}

// ─── Content Objects ─────────────────────────────────────────────────────────

export interface Brief {
  videoType: string
  targetAudience: string
  duration: string
  coreTopic: string
  narrativeStyle: string
}

export interface OutlineItem {
  id: string
  act: number
  title: string
  duration: string
  scenes: { id: string; title: string }[]
}

export interface Outline {
  items: OutlineItem[]
}

// Script segment — 文字脚本，用户可逐段编辑
export interface ScriptSegment {
  id: string
  actTitle: string
  sceneTitle: string
  voiceover: string      // 口播/旁白文字
  visualNote: string     // 画面说明（给后续图片/视频生成用）
  duration: string
}

// Shot — 分镜描述，先是纯文字，图片/视频生成后才有 imageUrl/videoUrl
export interface Shot {
  id: string
  index: number
  duration: number
  type: string           // 全景 / 特写 / 动画 / 口播
  description: string    // 画面描述（文字）
  script: string         // 对应口播台词
  locked: boolean
  imageUrl?: string | null   // 生成后才有
  videoUrl?: string | null   // 生成后才有
  generationStatus?: "pending" | "generating" | "done" | "failed"
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant"
export type MessageType = "text" | "confirmation"

export interface Message {
  id: string
  role: MessageRole
  type: MessageType
  content: string
  confirmationId?: string
  confirmationDescription?: string
  confirmed?: boolean
}
