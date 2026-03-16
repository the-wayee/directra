"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { StatusBadge, SkillBadge } from "@/components/shared/status-badge"
import { skillConfig, formatRelativeTime } from "@/lib/utils/project"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const skill = skillConfig[project.skill]

  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden hover:border-slate-300 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60">
        {/* Cover */}
        <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50" />

          {/* Title initial */}
          <span className="relative text-4xl font-bold text-slate-300 select-none">
            {project.title.charAt(0)}
          </span>

          {/* Skill badge top-right */}
          <div className="absolute top-2 right-2">
            <SkillBadge skill={project.skill} />
          </div>

          {/* More menu top-left (hover) */}
          <button
            className="absolute top-2 left-2 w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            ···
          </button>
        </div>

        {/* Info */}
        <div className="px-3 py-2.5">
          <p className="text-sm font-medium text-slate-900 truncate mb-1.5">{project.title}</p>
          <div className="flex items-center justify-between">
            <StatusBadge status={project.status} />
            <span className="text-[10px] text-slate-400">{formatRelativeTime(project.updatedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="aspect-video bg-slate-100 shimmer" />
      <div className="px-3 py-2.5 space-y-2">
        <div className="h-4 bg-slate-100 rounded shimmer w-3/4" />
        <div className="h-3 bg-slate-100 rounded shimmer w-1/2" />
      </div>
    </div>
  )
}
