import { cn } from "@/lib/utils"
import type { ProjectStatus, SkillId } from "@/lib/types"
import { statusConfig, skillConfig } from "@/lib/utils/project"

interface StatusBadgeProps {
  status: ProjectStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const isGenerating = status === "GENERATING"
  const isWaiting = status === "WAITING_CONFIRMATION"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border",
        config.color,
        className
      )}
    >
      {isGenerating && (
        <span className="w-2.5 h-2.5 border border-current border-t-transparent rounded-full animate-spin" />
      )}
      {isWaiting && (
        <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />
      )}
      {!isGenerating && !isWaiting && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      {config.label}
    </span>
  )
}

interface SkillBadgeProps {
  skill: SkillId
  className?: string
  showIcon?: boolean
}

export function SkillBadge({ skill, className, showIcon = true }: SkillBadgeProps) {
  const config = skillConfig[skill]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border",
        config.color,
        className
      )}
    >
      {showIcon && <span>{config.icon}</span>}
      {config.name}
    </span>
  )
}
