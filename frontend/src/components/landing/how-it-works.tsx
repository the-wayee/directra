"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./shared/section-wrapper"

const steps = [
  {
    number: "01",
    title: "说出你的想法",
    description: "用一句自然语言描述你想做的视频。系统会自动解析你的项目意图——类型、受众、时长、风格，全部帮你理清楚。",
    color: "violet",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="rgb(124 58 237)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "AI 帮你规划",
    description: "导演台 Agent 自动匹配最适合的领域 Skill，规划完整制作流程。你不需要懂视频制作，系统帮你安排一切。",
    color: "blue",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="rgb(59 130 246)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 12h10M4 18h14" />
        <path d="M20 14l4 4-4 4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "逐步确认打磨",
    description: "脚本、大纲、分镜——每个关键节点都会停下来让你确认。不满意就改，满意了再继续。你掌控每个决策。",
    color: "emerald",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="rgb(16 185 129)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l3 3 7-7" />
        <circle cx="14" cy="14" r="10" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Studio 精修导出",
    description: "进入时间轴编辑器，像专业剪辑师一样调整每个细节。局部替换、字幕调整、音乐更换，然后一键导出。",
    color: "amber",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="rgb(245 158 11)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="8" width="20" height="12" rx="2" />
        <path d="M12 12l5 3-5 3v-6z" />
      </svg>
    ),
  },
]

const colorMap: Record<string, { bg: string; border: string; numberText: string }> = {
  violet: { bg: "bg-violet-50", border: "border-violet-200", numberText: "text-violet-300" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", numberText: "text-blue-300" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", numberText: "text-emerald-300" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", numberText: "text-amber-300" },
}

export function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works" className="py-24 lg:py-32">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-violet-600 mb-3"
        >
          工作流程
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl lg:text-4xl font-bold text-slate-900"
        >
          四步，从想法到成片
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-slate-500 max-w-xl mx-auto"
        >
          Agent 主导流程推进，你只需要在关键节点做决策
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {steps.map((step, i) => {
          const colors = colorMap[step.color]
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative p-6 lg:p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Step number watermark */}
              <span className={`absolute top-4 right-5 text-5xl font-black ${colors.numberText} select-none`}>
                {step.number}
              </span>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-5`}>
                {step.icon}
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Connector line (desktop only) */}
      <div className="hidden md:flex justify-center mt-8">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-0.5 w-64 bg-gradient-to-r from-violet-200 via-blue-200 to-emerald-200 rounded-full origin-left"
        />
      </div>
    </SectionWrapper>
  )
}
