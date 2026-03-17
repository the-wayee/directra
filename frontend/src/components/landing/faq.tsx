"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SectionWrapper } from "./shared/section-wrapper"

const faqs = [
  {
    q: "Directra 和其他 AI 视频工具有什么不同？",
    a: "大多数工具是「输入 prompt → 输出视频」的一次性生成。Directra 是项目系统——它帮你把想法组织成结构化项目，经过多轮确认逐步推进，最终在编辑器中精修导出。你掌控每个环节，而不是完全交给 AI。",
  },
  {
    q: "视频生成需要多长时间？",
    a: "文字内容（脚本、分镜描述）几秒内完成。图片生成通常 10-30 秒。视频片段生成根据时长和质量，一般 1-5 分钟。整个过程是异步的，生成中你可以继续编辑其他内容。",
  },
  {
    q: "我可以只修改视频的某一部分吗？",
    a: "当然可以。这是 Directra 的核心设计——你可以只改某段脚本、只重做某个镜头、只替换某个片段的音乐或字幕。不需要全部推倒重来。",
  },
  {
    q: "支持哪些类型的视频？",
    a: "目前内置 6 个领域 Skill：知识讲解、品牌营销、儿童故事、课程视频、口播+B-roll、新闻解读。每种类型都有专业的制作流程。更多领域持续扩展中。",
  },
  {
    q: "积分是怎么计算的？",
    a: "不同操作消耗不同积分。文字内容（对话、脚本）消耗很少（1-10 积分），图片生成中等（20-40 积分），视频生成较多（200-500 积分/5秒）。免费用户每月 500 积分，Pro 用户 10,000 积分。",
  },
  {
    q: "可以导出什么格式？",
    a: "支持 MP4 导出，分辨率从 720p（免费）到 4K（Pro）。后续会支持更多格式和平台直发功能。",
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
