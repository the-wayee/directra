"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { GradientBlob } from "./shared/gradient-blob"

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <GradientBlob color="violet" size="lg" className="-left-32 top-0 opacity-25" />
      <GradientBlob color="blue" size="md" className="right-0 bottom-0 opacity-20" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 relative">
            让 AI 帮你剪视频
          </h2>
          <p className="text-violet-200 text-base lg:text-lg mb-8 max-w-lg mx-auto relative">
            免费开始，不需要信用卡。告诉 Agent 你想做什么视频，剩下的交给 AI。
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-violet-700 font-semibold text-sm rounded-full hover:bg-violet-50 shadow-lg shadow-indigo-800/20 transition-all duration-300 hover:-translate-y-0.5 relative"
          >
            免费开始创作
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 8h14M9 2l6 6-6 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
