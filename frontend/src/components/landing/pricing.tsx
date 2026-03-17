"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { SectionWrapper } from "./shared/section-wrapper"

const plans = [
  {
    name: "免费版",
    price: "¥0",
    period: "永久免费",
    description: "体验核心功能，开始你的第一个视频项目",
    features: [
      "3 个视频项目",
      "基础 Skill（知识讲解、口播）",
      "500 积分/月",
      "720p 导出",
      "社区支持",
    ],
    cta: "免费开始",
    highlight: false,
  },
  {
    name: "Pro",
    price: "¥99",
    period: "/月",
    description: "专业创作者的完整工具箱",
    features: [
      "无限视频项目",
      "全部 6 个领域 Skill",
      "10,000 积分/月",
      "4K 导出",
      "长视频一致性引擎",
      "优先客服",
      "自定义 Skill（即将推出）",
    ],
    cta: "升级 Pro",
    highlight: true,
  },
  {
    name: "团队版",
    price: "即将推出",
    period: "",
    description: "适合内容团队和机构",
    features: [
      "多成员协作",
      "共享素材库",
      "团队积分池",
      "API 接入",
      "专属客户经理",
    ],
    cta: "联系我们",
    highlight: false,
  },
]

export function Pricing() {
  return (
    <SectionWrapper id="pricing" className="py-24 lg:py-32">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-violet-600 mb-3"
        >
          定价方案
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl lg:text-4xl font-bold text-slate-900"
        >
          简单透明，按需选择
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
              plan.highlight
                ? "bg-white border-violet-200 shadow-lg shadow-violet-100/50 ring-1 ring-violet-100"
                : "bg-white border-slate-100 shadow-sm hover:shadow-md"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-medium rounded-full">
                最受欢迎
              </div>
            )}

            <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
            <div className="mt-3 mb-1">
              <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
              <span className="text-sm text-slate-500">{plan.period}</span>
            </div>
            <p className="text-sm text-slate-500 mb-6">{plan.description}</p>

            <ul className="space-y-2.5 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8l3.5 3.5L13 5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/home"
              className={`block w-full text-center py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                plan.highlight
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-200/40"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
