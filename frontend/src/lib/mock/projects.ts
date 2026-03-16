import type { Project, Message, Shot, Outline, Brief } from "@/lib/types"

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    title: "量子纠缠科普视频",
    skill: "knowledge",
    status: "WAITING_CONFIRMATION",
    phase: "STORYBOARD",
    createdAt: "2024-03-14T10:00:00Z",
    updatedAt: "2024-03-14T12:00:00Z",
    thumbnail: null,
    brief: {
      videoType: "科普 / 知识讲解",
      targetAudience: "高中生",
      duration: "5 分钟",
      coreTopic: "量子纠缠的基本概念与现实意义",
      narrativeStyle: "讲解 + 动画示意",
    },
    outline: {
      items: [
        {
          id: "act-1",
          act: 1,
          title: "引入概念",
          duration: "1:30",
          scenes: [
            { id: "scene-1-1", title: "什么是量子" },
            { id: "scene-1-2", title: "叠加态直觉理解" },
          ],
        },
        {
          id: "act-2",
          act: 2,
          title: "核心解释",
          duration: "2:00",
          scenes: [
            { id: "scene-2-1", title: "EPR 悖论" },
            { id: "scene-2-2", title: "贝尔不等式实验" },
          ],
        },
        {
          id: "act-3",
          act: 3,
          title: "现实意义与展望",
          duration: "1:30",
          scenes: [
            { id: "scene-3-1", title: "量子通信应用" },
            { id: "scene-3-2", title: "未来展望" },
          ],
        },
      ],
    },
  },
  {
    id: "proj-002",
    title: "夏季新品发布宣传片",
    skill: "marketing",
    status: "GENERATING",
    phase: "SCRIPT",
    createdAt: "2024-03-14T13:00:00Z",
    updatedAt: "2024-03-14T13:30:00Z",
    thumbnail: null,
  },
  {
    id: "proj-003",
    title: "小熊找星星的故事",
    skill: "children_story",
    status: "EDITING",
    phase: "STUDIO",
    createdAt: "2024-03-13T09:00:00Z",
    updatedAt: "2024-03-13T18:00:00Z",
    thumbnail: null,
  },
  {
    id: "proj-004",
    title: "Python 入门第一课",
    skill: "course",
    status: "DRAFT",
    phase: "BRIEF",
    createdAt: "2024-03-11T08:00:00Z",
    updatedAt: "2024-03-11T08:00:00Z",
    thumbnail: null,
  },
]

// ─── Mock chat messages — 体现正确的多轮对话 + 先文字确认流程 ────────────────

export const mockMessages: Message[] = [
  // 用户发起意图
  {
    id: "msg-1",
    role: "user",
    type: "text",
    content: "做一个5分钟讲清楚量子纠缠的科普视频，面向高中生",
  },

  // Agent：澄清问题（多轮对话阶段）
  {
    id: "msg-2",
    role: "assistant",
    type: "text",
    content: `我理解你想做一个量子纠缠的科普视频。在开始规划之前，我想确认几个点：

**关于内容深度**：你希望停留在直觉理解层面（类比+示意），还是需要涉及一些数学推导（比如贝尔不等式的具体计算）？

**关于叙事风格**：偏向纪录片式的旁白讲解，还是模拟一个"教授向学生解释"的对话感？`,
  },

  // 用户回答
  {
    id: "msg-3",
    role: "user",
    type: "text",
    content: "直觉理解就好，不要数学。风格轻松一点，像和朋友解释那种感觉",
  },

  // Agent：确认理解，展示 Brief
  {
    id: "msg-4",
    role: "assistant",
    type: "text",
    content: `好，我来整理一下项目方向：

- **内容深度**：直觉理解，用类比和动画示意，不涉及数学
- **叙事风格**：轻松对话感，像朋友解释，有点幽默感
- **目标受众**：高中生，有基础理科背景
- **时长**：5 分钟左右

我选了**知识讲解** Skill 来驱动这个项目。

请确认这个方向，确认后我会生成大纲。`,
  },

  // 确认节点：Brief 确认
  {
    id: "msg-5",
    role: "assistant",
    type: "confirmation",
    content: "确认项目方向",
    confirmationId: "brief-confirm",
    confirmationDescription: "确认后开始生成大纲，你可以在右侧对任何字段进行修改。",
    confirmed: true,
  },

  // 用户确认
  {
    id: "msg-6",
    role: "user",
    type: "text",
    content: "确认",
  },

  // Agent：给出大纲（文字）
  {
    id: "msg-7",
    role: "assistant",
    type: "text",
    content: `大纲已在右侧展示，共 3 个 Act：

**Act 1** 引入概念（~1分30秒）——用硬币类比引出叠加态，再引出纠缠
**Act 2** 核心解释（~2分钟）——EPR 悖论 → 贝尔实验结果 → 为什么"非定域性"是真的
**Act 3** 现实意义（~1分30秒）——量子通信、量子计算，展望未来

有没有哪个 Act 的侧重点你想调整？比如 Act 2 是否需要花更多时间解释？`,
  },

  // 确认节点：大纲确认
  {
    id: "msg-8",
    role: "assistant",
    type: "confirmation",
    content: "确认大纲",
    confirmationId: "outline-confirm",
    confirmationDescription: "大纲在右侧可以直接编辑每个 Scene 的标题和时长，确认后开始逐段生成脚本。",
    confirmed: true,
  },

  // 用户：提出修改意见
  {
    id: "msg-9",
    role: "user",
    type: "text",
    content: "Act 2 的贝尔不等式可以再简单一点，别讲实验细节，直接说结论就好",
  },

  // Agent 响应修改
  {
    id: "msg-10",
    role: "assistant",
    type: "text",
    content: `好，Act 2 的 Scene 2.2 调整为：直接告诉观众实验结论——"科学家做了实验，量子世界的结果和爱因斯坦的预测不符，纠缠是真实的"，跳过实验设计细节。

大纲已在右侧更新，脚本也会按这个方向写。

继续生成脚本吗？`,
  },

  // 确认节点：开始写脚本
  {
    id: "msg-11",
    role: "assistant",
    type: "confirmation",
    content: "确认，开始生成脚本",
    confirmationId: "script-start",
    confirmationDescription: "脚本会分段生成并展示在右侧，每段都可以直接编辑或告诉我修改意见。",
    confirmed: true,
  },

  // 用户
  {
    id: "msg-12",
    role: "user",
    type: "text",
    content: "好的",
  },

  // Agent：脚本已出
  {
    id: "msg-13",
    role: "assistant",
    type: "text",
    content: `脚本已在右侧展示，共 6 个段落。每段都可以直接点击编辑，或者告诉我"第X段改成..."。

你觉得整体语气怎么样？是否足够轻松？`,
  },

  // 用户反馈脚本
  {
    id: "msg-14",
    role: "user",
    type: "text",
    content: "第一段的开头可以更抓人一点，现在太平了",
  },

  // Agent 修改
  {
    id: "msg-15",
    role: "assistant",
    type: "text",
    content: `第一段开头已更新为：

> "你有没有想过，两个粒子可以跨越整个宇宙，瞬间'感应'对方？这不是科幻，这是被实验证明的量子纠缠。"

右侧脚本已同步，其他段落都满意的话我们可以进入分镜规划了。`,
  },

  // 确认节点：进入分镜
  {
    id: "msg-16",
    role: "assistant",
    type: "confirmation",
    content: "脚本确认，开始规划分镜",
    confirmationId: "storyboard-start",
    confirmationDescription: "分镜是每个画面的文字描述，包括镜头类型、画面内容、对应台词。确认后可进一步调整，全部满意后才开始图片生成。",
    confirmed: false,
  },
]

// ─── Mock shots（文字分镜，无图片）─────────────────────────────────────────

export const mockShots: Shot[] = [
  {
    id: "shot-1",
    index: 1,
    duration: 5,
    type: "动画",
    description: "宇宙星空背景，两颗粒子从中心向两侧飞出，连线闪烁",
    script: "你有没有想过，两个粒子可以跨越整个宇宙，瞬间'感应'对方？这不是科幻，这是被实验证明的量子纠缠。",
    locked: false,
    imageUrl: null,
  },
  {
    id: "shot-2",
    index: 2,
    duration: 4,
    type: "动画",
    description: "一枚硬币旋转，慢慢模糊化，变成半透明的正面+反面叠加状态",
    script: "先说叠加态。想象一枚旋转中的硬币，在你看它之前，它既不是正面，也不是反面，而是两种状态的叠加。",
    locked: false,
    imageUrl: null,
  },
  {
    id: "shot-3",
    index: 3,
    duration: 5,
    type: "动画",
    description: "两颗粒子靠近、碰撞、产生连线，之后被分开，连线依然存在，变成虚线",
    script: "当两个粒子发生纠缠，就像给它们之间建立了一条无论多远都无法断开的'量子热线'。",
    locked: true,
    imageUrl: null,
  },
  {
    id: "shot-4",
    index: 4,
    duration: 4,
    type: "特写",
    description: "爱因斯坦皱眉的插画风格图，旁边飘出问号和感叹号",
    script: "爱因斯坦不相信这个。他说这是'幽灵般的超距作用'，认为量子力学一定哪里算错了。",
    locked: false,
    imageUrl: null,
  },
  {
    id: "shot-5",
    index: 5,
    duration: 5,
    type: "动画",
    description: "实验室场景，两个探测器同时亮起，结果板显示'Einstein was wrong'",
    script: "但科学家做了实验，结果很清楚：量子纠缠是真实存在的，宇宙的运作方式就是这么奇怪。",
    locked: false,
    imageUrl: null,
  },
  {
    id: "shot-6",
    index: 6,
    duration: 4,
    type: "全景",
    description: "量子卫星在轨道运行，地面两个站点之间出现蓝色光束连线",
    script: "今天，量子纠缠已经用于量子通信——理论上无法被监听的加密方式，中国的墨子号卫星已经在做了。",
    locked: false,
    imageUrl: null,
  },
]

// ─── Mock script（文字脚本，分段可编辑）─────────────────────────────────────

export const mockScript = [
  {
    id: "script-1",
    actTitle: "Act 1 — 引入概念",
    sceneTitle: "开场",
    voiceover: "你有没有想过，两个粒子可以跨越整个宇宙，瞬间'感应'对方？这不是科幻，这是被实验证明的量子纠缠。",
    visualNote: "宇宙星空 + 粒子飞出动画",
    duration: "0:00 – 0:15",
  },
  {
    id: "script-2",
    actTitle: "Act 1 — 引入概念",
    sceneTitle: "叠加态类比",
    voiceover: "先说叠加态。想象一枚旋转中的硬币，在你看它之前，它既不是正面，也不是反面，而是两种状态的叠加。量子粒子也是这样——观测之前，它同时处于多个状态。",
    visualNote: "旋转硬币 → 模糊叠加态动画",
    duration: "0:15 – 0:45",
  },
  {
    id: "script-3",
    actTitle: "Act 1 — 引入概念",
    sceneTitle: "纠缠定义",
    voiceover: "当两个粒子发生纠缠，就像给它们之间建立了一条无论多远都无法断开的量子热线。测量其中一个，另一个的状态瞬间确定。",
    visualNote: "粒子碰撞 → 纠缠连线动画",
    duration: "0:45 – 1:20",
  },
  {
    id: "script-4",
    actTitle: "Act 2 — 核心解释",
    sceneTitle: "EPR 悖论",
    voiceover: "爱因斯坦不相信这个。他说这是幽灵般的超距作用，认为信息不可能比光速更快地传递，量子力学一定哪里算错了。",
    visualNote: "爱因斯坦插画，皱眉质疑",
    duration: "1:20 – 2:00",
  },
  {
    id: "script-5",
    actTitle: "Act 2 — 核心解释",
    sceneTitle: "实验结论",
    voiceover: "但科学家做了实验，结果很清楚：量子纠缠是真实的。宇宙的运作方式，就是比爱因斯坦想象的还要奇怪。",
    visualNote: "实验室 + 结果板动画",
    duration: "2:00 – 2:40",
  },
  {
    id: "script-6",
    actTitle: "Act 3 — 现实意义",
    sceneTitle: "量子通信",
    voiceover: "今天，量子纠缠已经用于量子通信——理论上无法被监听的加密方式。中国的墨子号卫星已经在太空中实现了这一点。",
    visualNote: "量子卫星轨道动画",
    duration: "2:40 – 3:30",
  },
  {
    id: "script-7",
    actTitle: "Act 3 — 现实意义",
    sceneTitle: "结尾",
    voiceover: "量子纠缠告诉我们：宇宙比我们想象的更加奇妙，而我们才刚刚开始理解它。",
    visualNote: "回到宇宙星空，渐出",
    duration: "3:30 – 4:00",
  },
]
