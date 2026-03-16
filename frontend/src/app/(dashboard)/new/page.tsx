"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { mockSkills } from "@/lib/mock/skills"
import { mockProjects } from "@/lib/mock/projects"
import { cn } from "@/lib/utils"
import type { SkillId } from "@/lib/types"

const EXAMPLES = [
  "做一个 5 分钟讲清楚量子纠缠的科普视频，面向高中生",
  "为我的咖啡品牌做一支 30 秒宣传片，风格温暖文艺",
  "给 4-6 岁小朋友讲一个关于小兔子学勇敢的睡前故事",
  "用 10 分钟系统讲解 React Hooks 的核心用法，面向初学者",
]

interface ParsedIntent {
  videoType: string
  targetAudience: string
  duration: string
  coreTopic: string
  narrativeStyle: string
  recommendedSkill: SkillId
}

function parseIntent(input: string): ParsedIntent {
  const lower = input.toLowerCase()
  let recommendedSkill: SkillId = "knowledge"
  let videoType = "知识讲解"
  let narrativeStyle = "讲解 + 动画示意"

  if (lower.includes("宣传") || lower.includes("品牌") || lower.includes("营销")) {
    recommendedSkill = "marketing"
    videoType = "品牌营销"
    narrativeStyle = "情感驱动 + 产品展示"
  } else if (lower.includes("故事") || lower.includes("小朋友") || lower.includes("儿童")) {
    recommendedSkill = "children_story"
    videoType = "儿童故事"
    narrativeStyle = "温暖叙事 + 角色对话"
  } else if (lower.includes("课程") || lower.includes("教程") || lower.includes("教学") || lower.includes("hooks")) {
    recommendedSkill = "course"
    videoType = "课程视频"
    narrativeStyle = "步骤拆解 + 实操演示"
  }

  const durationMatch = input.match(/(\d+)\s*分钟/)
  const duration = durationMatch ? `${durationMatch[1]} 分钟` : "5 分钟"

  const audiencePatterns = [
    { pattern: /高中生/, label: "高中生" },
    { pattern: /初学者|新手/, label: "初学者" },
    { pattern: /小朋友|儿童|4[-~]6岁/, label: "4-6 岁儿童" },
    { pattern: /程序员|开发者/, label: "程序员" },
  ]
  let targetAudience = "普通大众"
  for (const { pattern, label } of audiencePatterns) {
    if (pattern.test(input)) { targetAudience = label; break }
  }

  const topic = input.split(/，|。|,/)[0].replace(/做一个.*?分钟|为我的|给.*?小朋友|用.*?分钟/, "").trim() || "视频主题"

  return { videoType, targetAudience, duration, coreTopic: topic, narrativeStyle, recommendedSkill }
}

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [input, setInput] = useState("")
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState<ParsedIntent | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<SkillId | null>(null)

  async function handleAnalyze() {
    if (!input.trim()) return
    setParsing(true)
    await new Promise((r) => setTimeout(r, 700))
    const result = parseIntent(input)
    setParsed(result)
    setSelectedSkill(result.recommendedSkill)
    setParsing(false)
    setStep(2)
  }

  function handleStart() {
    router.push(`/projects/${mockProjects[0].id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {step === 1 ? (
        <Step1
          input={input}
          onInputChange={setInput}
          onAnalyze={handleAnalyze}
          parsing={parsing}
        />
      ) : (
        <Step2
          input={input}
          parsed={parsed!}
          selectedSkill={selectedSkill!}
          onSelectSkill={setSelectedSkill}
          onBack={() => setStep(1)}
          onStart={handleStart}
        />
      )}
    </div>
  )
}

function Step1({
  input,
  onInputChange,
  onAnalyze,
  parsing,
}: {
  input: string
  onInputChange: (v: string) => void
  onAnalyze: () => void
  parsing: boolean
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">新建视频项目</h1>
        <p className="text-sm text-slate-500">告诉 Directra 你想做什么视频</p>
      </div>

      <div className="space-y-3">
        <Textarea
          placeholder="你想做什么视频？&#10;例如：做一个 5 分钟讲清楚量子纠缠的科普视频，面向高中生"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          className="min-h-[120px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 resize-none text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAnalyze()
          }}
        />
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400">{input.length} 字 · ⌘Enter 提交</span>
          <Button
            onClick={onAnalyze}
            disabled={!input.trim() || parsing}
            className="bg-violet-600 hover:bg-violet-500 text-white border-0 h-8 text-xs px-4 cursor-pointer disabled:opacity-40"
          >
            {parsing ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                分析中...
              </span>
            ) : (
              "开始分析 →"
            )}
          </Button>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <p className="text-xs text-slate-400">示例</p>
        <div className="space-y-1.5">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              onClick={() => onInputChange(example)}
              className="w-full text-left text-xs text-slate-500 hover:text-slate-700 px-3 py-2 rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
            >
              · {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  function handleAnalyze() {
    onAnalyze()
  }
}

function Step2({
  input,
  parsed,
  selectedSkill,
  onSelectSkill,
  onBack,
  onStart,
}: {
  input: string
  parsed: ParsedIntent
  selectedSkill: SkillId
  onSelectSkill: (s: SkillId) => void
  onBack: () => void
  onStart: () => void
}) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full mb-1">
          <span>✓</span> 已理解你的项目意图
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">确认项目方向</h1>
      </div>

      {/* Parsed intent */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2">
        <p className="text-xs font-medium text-slate-500 mb-3">项目概要</p>
        {[
          { label: "视频类型", value: parsed.videoType },
          { label: "目标受众", value: parsed.targetAudience },
          { label: "预计时长", value: parsed.duration },
          { label: "核心主题", value: parsed.coreTopic },
          { label: "叙事方式", value: parsed.narrativeStyle },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start gap-4 text-sm">
            <span className="w-20 shrink-0 text-slate-400 text-xs pt-0.5">{label}</span>
            <span className="text-slate-700 text-xs">{value}</span>
          </div>
        ))}
      </div>

      {/* Skill selection */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-slate-500">推荐 Skill</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {mockSkills.map((skill) => {
            const isSelected = selectedSkill === skill.id
            const isRecommended = skill.id === parsed.recommendedSkill
            return (
              <button
                key={skill.id}
                onClick={() => onSelectSkill(skill.id)}
                className={cn(
                  "relative rounded-lg border p-3 text-left transition-all cursor-pointer",
                  isSelected
                    ? "border-violet-400 bg-violet-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {isRecommended && (
                  <span className="absolute top-2 right-2 text-[9px] text-amber-500">★ 推荐</span>
                )}
                <div className="text-xl mb-1.5">{skill.icon}</div>
                <div className="text-xs font-medium text-slate-800 mb-0.5">{skill.name}</div>
                <div className="text-[10px] text-slate-400 leading-snug">{skill.description}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          ← 重新描述
        </button>
        <Button
          onClick={onStart}
          className="bg-violet-600 hover:bg-violet-500 text-white border-0 h-9 text-sm px-6 cursor-pointer"
        >
          确认，开始制作 →
        </Button>
      </div>
    </div>
  )
}
