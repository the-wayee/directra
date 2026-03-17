"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./shared/section-wrapper"

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "项目式管理",
    description: "每个视频是一个完整项目，可以持续推进、暂停、修改、多版本管理。不是用完即弃的一次性生成。",
    color: "violet",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Skill 领域工作流",
    description: "知识讲解、品牌营销、儿童故事……每种视频类型都有专业的制作协议，而不是通用 prompt。",
    color: "blue",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
    title: "多轮确认机制",
    description: "Agent 主导推进，但你掌控决策。方向、大纲、脚本、分镜——每个关键节点都需要你的确认。",
    color: "emerald",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "长视频一致性",
    description: "角色外观、场景风格、故事连续性——跨镜头、跨场景自动保持连贯，不再前后矛盾。",
    color: "amber",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 6v12" />
        <path d="M10 6v12" />
        <path d="M14 6v12" />
        <path d="M18 6v12" />
      </svg>
    ),
    title: "Studio 时间轴编辑器",
    description: "专业级时间轴，拖拽片段、调整时长、修改字幕、替换音乐。局部重做，不强迫从头来。",
    color: "rose",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8" />
        <path d="M8 13h4" />
      </svg>
    ),
    title: "自然语言控制",
    description: "「第三个镜头更紧张一点」——直接用自然语言驱动编辑操作，不需要学复杂的软件。",
    color: "indigo",
  },
]

const colorConfig: Record<string, { iconBg: string; iconText: string }> = {
  violet: { iconBg: "bg-violet-50 group-hover:bg-violet-100", iconText: "text-violet-600" },
  blue: { iconBg: "bg-blue-50 group-hover:bg-blue-100", iconText: "text-blue-600" },
  emerald: { iconBg: "bg-emerald-50 group-hover:bg-emerald-100", iconText: "text-emerald-600" },
  amber: { iconBg: "bg-amber-50 group-hover:bg-amber-100", iconText: "text-amber-600" },
  rose: { iconBg: "bg-rose-50 group-hover:bg-rose-100", iconText: "text-rose-600" },
  indigo: { iconBg: "bg-indigo-50 group-hover:bg-indigo-100", iconText: "text-indigo-600" },
}

export function Features() {
  return (
    <SectionWrapper id="features" className="py-24 lg:py-32">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-violet-600 mb-3"
        >
          核心能力
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl lg:text-4xl font-bold text-slate-900"
        >
          不只是生成，更是制作
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-slate-500 max-w-xl mx-auto"
        >
          每一项能力都为"可控的视频项目"而设计
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {features.map((feature, i) => {
          const colors = colorConfig[feature.color]
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-11 h-11 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center mb-4 transition-colors duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
