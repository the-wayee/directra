"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { GradientBlob } from "./shared/gradient-blob"

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const mockupScale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <section ref={ref} className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background blobs */}
      <GradientBlob color="violet" size="lg" className="-top-32 -right-32 opacity-40" />
      <GradientBlob color="blue" size="md" className="top-1/3 -left-20 opacity-30" />
      <GradientBlob color="pink" size="sm" className="bottom-20 right-1/4 opacity-30" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-50 border border-violet-200/60 rounded-full">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-violet-700">Agent Video Clip — AI 驱动的视频创作与剪辑平台</span>
          </div>
        </motion.div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight"
          >
            不只是生成视频
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              更是 AI 剪辑视频
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-6 text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto"
          >
            为视频创作者打造的 AI 助手——从脚本构思到剪辑成片，
            <br className="hidden sm:block" />
            用对话驱动创作，用 Agent 完成剪辑。你的想法，我们帮你剪出来。
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/home"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-300/40 hover:shadow-xl hover:shadow-violet-300/50 transition-all duration-300 hover:-translate-y-0.5"
            >
              免费开始创作
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 8h14M9 2l6 6-6 6" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              了解工作流程
            </a>
          </motion.div>
        </div>

        {/* Product Mockup */}
        <motion.div
          style={{ y: mockupY, scale: mockupScale }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-16 lg:mt-20 relative"
        >
          {/* Browser frame */}
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-amber-300" />
                <div className="w-3 h-3 rounded-full bg-emerald-300" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 bg-white rounded-md border border-slate-200 text-xs text-slate-400">
                  directra.app
                </div>
              </div>
              <div className="w-12" />
            </div>
            {/* Simulated Agent Creation Mode UI */}
            <div className="aspect-[16/9] bg-slate-50 flex">
              {/* Left: Chat Panel */}
              <div className="w-[38%] border-r border-slate-200 bg-white flex flex-col">
                {/* Chat header */}
                <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="white"><path d="M3 3l10 5-10 5V3z" /></svg>
                  </div>
                  <span className="text-[10px] font-medium text-slate-700">Directra Agent</span>
                  <span className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
                {/* Messages */}
                <div className="flex-1 p-3 space-y-2.5 overflow-hidden">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-violet-600 rounded-lg rounded-tr-sm px-2.5 py-1.5 max-w-[85%]">
                      <p className="text-[9px] text-white leading-relaxed">帮我剪一个 3 分钟的科技测评视频，突出产品卖点</p>
                    </div>
                  </div>
                  {/* Agent message */}
                  <div className="flex gap-1.5 items-start">
                    <div className="w-4 h-4 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[7px]">🤖</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg rounded-tl-sm px-2.5 py-1.5 max-w-[85%]">
                      <p className="text-[9px] text-slate-600 leading-relaxed">收到！已识别为<span className="text-violet-600 font-medium">「产品测评」</span>类型。我来帮你规划脚本结构和剪辑节奏，建议时长 3 分钟。</p>
                    </div>
                  </div>
                  {/* Confirmation card */}
                  <div className="flex gap-1.5 items-start">
                    <div className="w-4 h-4 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[7px]">🤖</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg rounded-tl-sm px-2.5 py-1.5 max-w-[90%]">
                      <p className="text-[8px] font-medium text-emerald-700 mb-1">📋 剪辑大纲已生成</p>
                      <div className="space-y-0.5 text-[8px] text-emerald-600">
                        <p>1. 开场：3 秒快剪 + 产品亮相 hook</p>
                        <p>2. 核心：功能演示 + 画面特写 B-roll</p>
                        <p>3. 对比：竞品对比 + 数据可视化</p>
                        <p>4. 结尾：总结推荐 + CTA 引导</p>
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        <div className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[8px] font-medium">确认</div>
                        <div className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded text-[8px]">修改</div>
                      </div>
                    </div>
                  </div>
                  {/* Agent continuing */}
                  <div className="flex gap-1.5 items-start">
                    <div className="w-4 h-4 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[7px]">🤖</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg rounded-tl-sm px-2.5 py-1.5 max-w-[85%]">
                      <p className="text-[9px] text-slate-600 leading-relaxed">大纲已确认，正在生成分镜和剪辑方案<span className="inline-block w-1 h-3 bg-violet-400 animate-pulse ml-0.5 rounded-sm" /></p>
                    </div>
                  </div>
                </div>
                {/* Input */}
                <div className="px-3 py-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-200">
                    <span className="text-[9px] text-slate-400 flex-1">输入你的想法或反馈...</span>
                    <div className="w-5 h-5 rounded-md bg-violet-600 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M2 8h12M9 3l5 5-5 5" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Content Preview */}
              <div className="flex-1 flex flex-col">
                {/* Tabs */}
                <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-1">
                  <div className="px-2 py-0.5 text-[9px] text-slate-400 rounded">脚本</div>
                  <div className="px-2 py-0.5 text-[9px] bg-violet-100 text-violet-700 rounded font-medium">剪辑方案</div>
                  <div className="px-2 py-0.5 text-[9px] text-slate-400 rounded">分镜</div>
                  <div className="px-2 py-0.5 text-[9px] text-slate-400 rounded">素材</div>
                  <div className="ml-auto px-2 py-0.5 text-[8px] bg-violet-600 text-white rounded font-medium">进入 Studio</div>
                </div>
                {/* Outline content */}
                <div className="flex-1 p-4 space-y-3 overflow-hidden">
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-2/5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                    </div>
                    <span className="text-[8px] text-slate-400">剪辑方案确认中</span>
                  </div>

                  {/* Act 1 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded bg-violet-100 flex items-center justify-center text-[8px] font-bold text-violet-600">1</div>
                      <span className="text-[10px] font-semibold text-slate-800">开场 Hook</span>
                      <span className="ml-auto text-[8px] text-slate-400">0:00 - 0:08</span>
                    </div>
                    <div className="pl-7 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[9px] text-slate-500">快剪：3 秒产品多角度特写</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[9px] text-slate-500">口播：一句话引出核心卖点</span>
                      </div>
                    </div>
                  </div>

                  {/* Act 2 */}
                  <div className="bg-white rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600">2</div>
                      <span className="text-[10px] font-semibold text-slate-800">功能演示</span>
                      <span className="ml-auto text-[8px] text-slate-400">0:08 - 1:45</span>
                    </div>
                    <div className="pl-7 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[9px] text-slate-500">口播 + B-roll：逐一展示核心功能</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[9px] text-slate-500">画中画：操作录屏 + 真人出镜</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[9px] text-slate-500">数据卡片：关键参数对比可视化</span>
                      </div>
                    </div>
                  </div>

                  {/* Act 3 */}
                  <div className="bg-white rounded-lg border border-emerald-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-600">3</div>
                      <span className="text-[10px] font-semibold text-slate-800">总结 + CTA</span>
                      <span className="ml-auto text-[8px] text-emerald-500 font-medium">生成中...</span>
                    </div>
                    <div className="pl-7 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[9px] text-slate-400">快剪回顾 + 购买引导 + 片尾卡片</span>
                      </div>
                      <div className="h-2 w-24 bg-slate-100 rounded animate-pulse ml-2.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating decorative cards */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 top-1/3 hidden lg:block"
          >
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-lg shadow-slate-200/40 p-3 w-48">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center">
                  <span className="text-xs">🎯</span>
                </div>
                <span className="text-xs font-medium text-slate-700">剪辑方案就绪</span>
              </div>
              <div className="text-[10px] text-slate-400">类型: 产品测评 · 3分钟</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 top-1/4 hidden lg:block"
          >
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-lg shadow-slate-200/40 p-3 w-44">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
                  <span className="text-xs">✅</span>
                </div>
                <span className="text-xs font-medium text-slate-700">时间轴已生成</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-emerald-400 rounded-full" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
