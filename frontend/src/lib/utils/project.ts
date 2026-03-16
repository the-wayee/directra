import type { ProjectStatus, SkillId } from "@/lib/types"

export const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; dot?: boolean; pulse?: boolean }
> = {
  DRAFT: { label: "草稿", color: "text-slate-500 bg-slate-100 border-slate-200" },
  INTENT_PARSED: { label: "解析中", color: "text-blue-600 bg-blue-50 border-blue-200" },
  SKILL_SELECTED: { label: "已选 Skill", color: "text-blue-600 bg-blue-50 border-blue-200" },
  BRIEF_CONFIRMED: { label: "概要已确认", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  OUTLINE_CONFIRMED: { label: "大纲已确认", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  SCRIPT_CONFIRMED: { label: "脚本已确认", color: "text-violet-600 bg-violet-50 border-violet-200" },
  STORYBOARD_CONFIRMED: { label: "分镜已确认", color: "text-violet-600 bg-violet-50 border-violet-200" },
  GENERATING: { label: "生成中", color: "text-blue-600 bg-blue-50 border-blue-200", pulse: true },
  WAITING_CONFIRMATION: { label: "等待确认", color: "text-amber-600 bg-amber-50 border-amber-200", pulse: true },
  EDITING: { label: "编辑中", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  EXPORTED: { label: "已导出", color: "text-purple-600 bg-purple-50 border-purple-200" },
}

export const skillConfig: Record<SkillId, { name: string; icon: string; color: string }> = {
  knowledge: { name: "知识讲解", icon: "🎓", color: "text-blue-600 bg-blue-50 border-blue-200" },
  marketing: { name: "品牌营销", icon: "📢", color: "text-orange-600 bg-orange-50 border-orange-200" },
  children_story: { name: "儿童故事", icon: "🌟", color: "text-pink-600 bg-pink-50 border-pink-200" },
  course: { name: "课程视频", icon: "📚", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  vlog: { name: "口播 + B-roll", icon: "🎬", color: "text-cyan-600 bg-cyan-50 border-cyan-200" },
  news: { name: "新闻解读", icon: "📰", color: "text-slate-600 bg-slate-100 border-slate-200" },
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return "刚刚"
  if (diffMin < 60) return `${diffMin} 分钟前`
  if (diffHour < 24) return `${diffHour} 小时前`
  if (diffDay === 1) return "昨天"
  if (diffDay < 7) return `${diffDay} 天前`
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
}
