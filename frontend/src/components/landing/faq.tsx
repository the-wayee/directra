"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "./shared/section-wrapper"

const faqs = [
  {
    q: "Directra 和其他 AI 视频工具有什么不同？",
    a: "大多数 AI 视频工具只做「生成」——输入 prompt 出一段视频。Directra 是 Agent Video Clip，不仅帮你生成内容，更帮你规划剪辑方案、组织镜头语言、在时间轴上精细调整。它是视频创作者的 AI 剪辑搭档。",
  },
  {
    q: "适合什么样的视频创作者？",
    a: "所有短视频创作者——测评博主、知识 UP 主、Vlog 博主、带货主播、自媒体运营。你有内容想法但缺乏剪辑能力或时间？Directra 就是为你设计的。",
  },
  {
    q: "我可以只修改视频的某一部分吗？",
    a: "当然可以，这是 Directra 的核心设计。某个镜头不满意？只改那一个。某段节奏太慢？只调那一段。不需要全部推倒重来。",
  },
  {
    q: "支持哪些类型的视频？",
    a: "目前内置 6 个领域 Skill：产品测评、知识讲解、品牌营销、课程教程、口播 Vlog、新闻解读。每种类型都有专业的剪辑节奏和制作流程。更多领域持续扩展中。",
  },
  {
    q: "和 Premiere / 剪映 有什么区别？",
    a: "传统剪辑软件需要你手动完成所有操作。Directra 用 AI Agent 帮你完成 80% 的重复工作——脚本、分镜、粗剪、字幕配乐，你只需要在 Studio 中做最后的精修。",
  },
  {
    q: "可以导出什么格式？",
    a: "支持 MP4 导出，分辨率从 720p（免费）到 4K（Pro）。后续会支持更多格式和平台直发功能（抖音、B站、YouTube）。",
  },
]

function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="text-sm font-medium text-slate-900 group-hover:text-violet-700 transition-colors pr-4">
          {q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-slate-500 group-hover:text-violet-600 transition-colors">
            <path d="M6 2v8M2 6h8" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-500 leading-relaxed pr-10">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <SectionWrapper id="faq" className="py-24 lg:py-32">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-bold text-slate-900"
        >
          常见问题
        </motion.h2>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8">
        {faqs.map((faq, i) => (
          <FaqItem
            key={i}
            q={faq.q}
            a={faq.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </SectionWrapper>
  )
}
