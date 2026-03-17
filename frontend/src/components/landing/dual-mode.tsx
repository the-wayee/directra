"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "./shared/section-wrapper"

const modes = [
  {
    id: "agent",
    label: "Agent 创作模式",
    subtitle: "从 0 到 1，对话驱动创作与剪辑",
    description: "告诉 Agent 你的视频需求，AI 自动规划脚本结构、镜头语言和剪辑节奏。你只需要在关键节点确认或修改。",
    points: [
      "一句话描述需求，AI 理解创作意图",
      "自动匹配领域 Skill（测评/教程/Vlog…）",
      "脚本、分镜、剪辑方案逐段确认",
      "某段不满意？只改那一段，不用全部重来",
    ],
    mockup: (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Mock chat interface */}
        <div className="p-4 space-y-3">
          <div className="flex gap-2 items-start">
            <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px]">🤖</span>
            </div>
            <div className="bg-slate-50 rounded-lg rounded-tl-none px-3 py-2 text-xs text-slate-600 max-w-[80%]">
              我已经理解了你的视频意图。这是一个 5 分钟的知识讲解视频，目标受众是对科技感兴趣的年轻人。
            </div>
          </div>
          <div className="flex gap-2 items-start justify-end">
            <div className="bg-violet-600 rounded-lg rounded-tr-none px-3 py-2 text-xs text-white max-w-[70%]">
              对，帮我先出一个大纲看看
            </div>
          </div>
          <div className="flex gap-2 items-start">
            <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px]">🤖</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg rounded-tl-none px-3 py-2 text-xs max-w-[85%]">
              <div className="font-medium text-emerald-700 mb-1">📋 大纲已生成</div>
              <div className="text-emerald-600 text-[10px] space-y-0.5">
                <div>第一幕：引入问题，抛出悬念</div>
                <div>第二幕：核心概念拆解</div>
                <div>第三幕：实际案例展示</div>
                <div>第四幕：总结与行动引导</div>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px]">确认</div>
                <div className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded text-[10px]">修改</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "studio",
    label: "Studio 剪辑模式",
    subtitle: "专业剪辑台，精细控制",
    description: "AI 生成初稿后，进入专业时间轴剪辑台。像 Premiere 一样精细调整每个镜头，也可以用自然语言控制剪辑。",
    points: [
      "时间轴拖拽剪辑，所见即所得",
      "剪切、变速、局部替换任意片段",
      "字幕、配乐、转场精确控制",
      "多版本管理，一键导出成片",
    ],
    mockup: (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Mock timeline */}
        <div className="p-4">
          {/* Preview area */}
          <div className="bg-slate-100 rounded-lg aspect-video mb-3 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-1">▶️</div>
              <div className="text-[10px] text-slate-400">00:00:15.24 / 00:05:00.00</div>
            </div>
          </div>
          {/* Timeline tracks */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-10">视频</span>
              <div className="flex-1 flex gap-0.5 h-6">
                <div className="bg-violet-200 rounded flex-[3] flex items-center px-1.5"><span className="text-[8px] text-violet-700 truncate">开场</span></div>
                <div className="bg-violet-300 rounded flex-[5] flex items-center px-1.5"><span className="text-[8px] text-violet-800 truncate">核心讲解</span></div>
                <div className="bg-violet-200 rounded flex-[2] flex items-center px-1.5"><span className="text-[8px] text-violet-700 truncate">结尾</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-10">字幕</span>
              <div className="flex-1 flex gap-0.5 h-5">
                <div className="bg-blue-100 rounded flex-[3]" />
                <div className="bg-blue-100 rounded flex-[5]" />
                <div className="bg-blue-100 rounded flex-[2]" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-10">音乐</span>
              <div className="flex-1 h-5">
                <div className="bg-amber-100 rounded w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export function DualMode() {
  const [active, setActive] = useState("agent")
  const activeMode = modes.find((m) => m.id === active)!

  return (
    <SectionWrapper className="py-24 lg:py-32">
      <div className="text-center mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-violet-600 mb-3"
        >
          双模式设计
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl lg:text-4xl font-bold text-slate-900"
        >
          AI 创作 + 专业剪辑，无缝切换
        </motion.h2>
      </div>

      {/* Tab switcher */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-slate-100 rounded-full p-1">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActive(mode.id)}
              className={`relative px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
                active === mode.id ? "text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {active === mode.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-5xl mx-auto"
        >
          {/* Text */}
          <div>
            <p className="text-sm text-violet-600 font-medium mb-2">{activeMode.subtitle}</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{activeMode.label}</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">{activeMode.description}</p>
            <ul className="space-y-3">
              {activeMode.points.map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgb(124 58 237)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 5l2.5 2.5L8 3" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          {/* Mockup */}
          <div>{activeMode.mockup}</div>
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  )
}
