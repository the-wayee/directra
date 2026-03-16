import type { Skill } from "@/lib/types"

export const mockSkills: Skill[] = [
  {
    id: "knowledge",
    name: "知识讲解",
    description: "适合科普、学科解析、概念拆解，逻辑清晰，配合动画说明",
    icon: "🎓",
    tags: ["科普", "教育", "知识"],
  },
  {
    id: "marketing",
    name: "品牌营销",
    description: "适合产品宣传、品牌故事、活动推广，强调情感共鸣与转化",
    icon: "📢",
    tags: ["品牌", "营销", "宣传"],
  },
  {
    id: "children_story",
    name: "儿童故事",
    description: "适合 3-8 岁儿童，温暖叙事，角色鲜明，画面生动可爱",
    icon: "🌟",
    tags: ["儿童", "故事", "动画"],
  },
  {
    id: "course",
    name: "课程视频",
    description: "适合技能教学、步骤拆解、在线课程，结构化强，有练习引导",
    icon: "📚",
    tags: ["教程", "课程", "技能"],
  },
  {
    id: "vlog",
    name: "口播 + B-roll",
    description: "适合 vlog、观点分享、生活记录，真实自然，剪辑感强",
    icon: "🎬",
    tags: ["口播", "vlog", "生活"],
  },
  {
    id: "news",
    name: "新闻解读",
    description: "适合热点解析、事件梳理、深度报道，客观严谨，信息密度高",
    icon: "📰",
    tags: ["新闻", "时事", "解读"],
  },
]
