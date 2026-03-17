"use client"

import { motion } from "framer-motion"
import { SectionWrapper } from "./shared/section-wrapper"

const skills = [
  { name: "产品测评", desc: "开箱、功能演示、对比评测，专业的测评剪辑节奏", icon: "📱", color: "bg-violet-50 border-violet-200 text-violet-700" },
  { name: "知识讲解", desc: "把复杂概念变成清晰有趣的科普视频", icon: "📚", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { name: "品牌营销", desc: "产品展示、品牌故事、商业广告短片", icon: "📢", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { name: "课程教程", desc: "教学视频、操作演示、分步骤讲解剪辑", icon: "🎓", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  { name: "口播 Vlog", desc: "真人出镜 + B-roll 画面素材，适合自媒体博主", icon: "🎙️", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { name: "新闻解读", desc: "热点事件解读、信息整合、快节奏出稿", icon: "📰", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
]

export function Skills() {
  return (
    <SectionWrapper id="skills" className="py-24 lg:py-32">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-violet-600 mb-3"
        >
          领域 Skill
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl lg:text-4xl font-bold text-slate-900"
        >
          每种视频都有专业的剪辑节奏
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg text-slate-500 max-w-xl mx-auto"
        >
          Skill 不是模板，而是领域化的创作与剪辑协议——脚本结构、镜头节奏、转场风格都不一样
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-4xl mx-auto">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ scale: 1.03 }}
            className={`p-5 rounded-2xl border ${skill.color} cursor-default transition-shadow duration-300 hover:shadow-md`}
          >
            <span className="text-2xl block mb-3">{skill.icon}</span>
            <h3 className="font-semibold text-base mb-1">{skill.name}</h3>
            <p className="text-sm opacity-70">{skill.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-slate-400 mt-8"
      >
        更多创作领域持续扩展中，也支持自定义 Skill
      </motion.p>
    </SectionWrapper>
  )
}
