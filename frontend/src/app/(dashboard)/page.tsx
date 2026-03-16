import Link from "next/link"
import { ProjectCard } from "@/components/project/project-card"
import { mockProjects } from "@/lib/mock/projects"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const projects = mockProjects

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">我的项目</h1>
          <p className="text-sm text-slate-500 mt-0.5">{projects.length} 个视频项目</p>
        </div>
        <Link href="/new">
          <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white border-0 h-8 text-xs px-4 cursor-pointer">
            + 新建项目
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* New project card */}
          <Link href="/new" className="group block">
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 overflow-hidden hover:border-violet-400 hover:bg-violet-50/50 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer">
              <div className="aspect-video flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full border border-slate-300 group-hover:border-violet-400 flex items-center justify-center transition-colors">
                  <span className="text-xl text-slate-400 group-hover:text-violet-500 transition-colors leading-none">+</span>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors">新建项目</span>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-sm text-slate-400 group-hover:text-slate-500 transition-colors">从一句话开始...</p>
              </div>
            </div>
          </Link>

          {/* Project cards */}
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl mb-4">🎬</div>
      <h2 className="text-lg font-medium text-slate-800 mb-2">开始你的第一个视频项目</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        用一句话描述你想做的视频，Directra 会帮你完成脚本、分镜和后续所有制作步骤
      </p>
      <Link href="/new">
        <Button className="bg-violet-600 hover:bg-violet-500 text-white border-0 cursor-pointer">
          + 新建项目
        </Button>
      </Link>
    </div>
  )
}
