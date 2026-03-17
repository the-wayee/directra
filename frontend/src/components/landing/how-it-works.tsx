"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./shared/section-wrapper"

const steps = [
  {
    number: "01",
    title: "描述你的视频需求",
    description: "告诉 Agent 你想做什么——测评、教程、Vlog、带货……一句话就够，AI 自动理解你的创作意图和受众。",
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
    title: "AI 生成脚本与剪辑方案",
    description: "Agent 自动规划脚本结构、镜头语言和剪辑节奏。口播段落、B-roll 插入点、转场方式，全部帮你安排好。",
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
    title: "逐段确认，随时修改",
    description: "脚本、分镜、剪辑方案——每个环节都可以确认或修改。某段不满意？只改那一段，不用全部重来。",
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
    title: "时间轴精修，一键导出",
    description: "进入 Studio 编辑器，在时间轴上精细调整——剪切、变速、转场、字幕、配乐，像专业剪辑师一样输出成片。",
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
          AI Agent 帮你规划和剪辑，你只需在关键节点做决策
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
