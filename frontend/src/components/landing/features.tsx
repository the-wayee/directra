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
    title: "AI 脚本 + 剪辑规划",
    description: "告诉 Agent 你想做什么视频，自动生成脚本结构和剪辑方案——镜头节奏、B-roll 插入、转场设计，一步到位。",
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
    title: "领域化剪辑 Skill",
    description: "测评、教程、Vlog、带货……每种视频类型都有专业的剪辑节奏和制作协议，不是通用模板。",
    color: "blue",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
    title: "逐段确认，局部修改",
    description: "某个镜头不满意？只改那一个。某段节奏太慢？只调那一段。不需要推倒重来，创作者掌控每个决策。",
    color: "emerald",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "长视频一致性引擎",
    description: "角色形象、画面风格、配乐主题——跨镜头、跨场景自动保持连贯，让长视频不再前后矛盾。",
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
    title: "专业时间轴剪辑台",
    description: "拖拽片段、剪切拼接、变速调整、字幕配乐——像 Premiere 一样精细控制，但门槛低得多。",
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
    title: "自然语言剪辑",
    description: "「第三个镜头节奏加快」「这里加个转场」——直接用自然语言控制剪辑，不需要学任何软件。",
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
          不只是生成视频，更是剪辑视频
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-slate-500 max-w-xl mx-auto"
        >
          为视频创作者打造的全流程 AI 助手
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
