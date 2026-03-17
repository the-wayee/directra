"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { GradientBlob } from "./shared/gradient-blob"

export function DemoShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden">
      <GradientBlob color="violet" size="lg" className="-right-40 top-0 opacity-20" />
      <GradientBlob color="blue" size="md" className="-left-20 bottom-0 opacity-15" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-violet-600 mb-3"
          >
            产品体验
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-900"
          >
            看看 Directra 如何工作
          </motion.h2>
        </div>

        <motion.div style={{ y }} className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 overflow-hidden">
            {/* Video placeholder */}
            <div className="aspect-video bg-gradient-to-br from-slate-50 via-violet-50/20 to-blue-50/20 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-300/40 cursor-pointer"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.div>
                <p className="text-sm text-slate-500">产品演示视频</p>
                <p className="text-xs text-slate-400 mt-1">2 分钟了解完整工作流程</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
