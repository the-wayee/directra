# Directra — 渐进式迭代任务列表

> 每次开发后必须更新本文档：勾选完成项、移入"已完成"区域、记录关键决策。
> 产品思想参见 [development.md](./development.md)，架构与技术栈参见 [CLAUDE.md](./CLAUDE.md)。

**产品定位**：ToC，面向短视频创作者
**开发策略**：前端优先——先把 UI/交互跑通（用 mock 数据），明确产品形态后再接后端
**技术栈速查**：
- 前端：Next.js 15 + shadcn/ui v4 + Tailwind v4 + TanStack Query + Zustand + Vercel AI SDK v5 + Better Auth
- 后端：Python FastAPI + Dramatiq + Redis + PostgreSQL + S3
- 数据库迁移：Prisma（前端侧 schema 管理）

---

## 当前阶段：Phase 0 — 前端脚手架 ✅

**目标**：搭建前端工程，用 mock 数据跑通核心页面，不依赖后端。

---

### 0.1 — 项目初始化 ✅

- [x] `npx create-next-app@latest` (TypeScript, App Router, Tailwind, ESLint) — Next.js 16.1.6
- [x] 安装并初始化 shadcn/ui v4（`npx shadcn init`）
- [x] 安装核心依赖：
  - `@tanstack/react-query` v5
  - `zustand`
  - `ai`（Vercel AI SDK v5）
  - `react-hook-form` + `zod` + `@hookform/resolvers`
- [x] 路径别名已配置（`@/` → `src/`，create-next-app 默认）

---

### 0.2 — 项目目录结构 ✅

按以下结构组织（前端侧）：

```
src/
  app/                  # Next.js App Router 路由
    (auth)/             # 登录/注册页（Route Group）
    (dashboard)/        # 主应用（Route Group）
      page.tsx          # 项目列表首页
      projects/
        [id]/
          page.tsx      # 项目详情页（Agent 创作模式）
          studio/
            page.tsx    # Studio 编辑模式
  components/
    ui/                 # shadcn/ui 原始组件（自动生成）
    shared/             # 跨模块通用组件
    agent/              # Agent 创作模式相关组件
    studio/             # Studio 编辑器相关组件
    project/            # 项目列表、项目卡片等
  lib/
    api/                # API 请求封装（TanStack Query hooks）
    store/              # Zustand stores
    types/              # TypeScript 类型定义
    utils/              # 工具函数
    mock/               # Mock 数据（前端优先阶段使用）
  hooks/                # 自定义 React hooks
```

- [x] 创建上述目录结构
- [x] 创建 `lib/mock/` 目录，放置所有 mock 数据

---

### 0.3 — 核心 Mock 数据定义 ✅

- [x] 定义核心 TypeScript 类型（`lib/types/index.ts`）
- [x] 写 mock 数据文件（`lib/mock/projects.ts`、`lib/mock/skills.ts`）
- [x] 工具函数（`lib/utils/project.ts`）：statusConfig、skillConfig、formatRelativeTime

---

### 0.4 — 首页：项目列表 ✅

- [x] 路由：`/`（`(dashboard)/page.tsx`）
- [x] NavBar（Logo + 新建项目按钮 + 用户头像）
- [x] 项目列表网格 + ProjectCard 组件（封面占位 / Skill badge / Status badge / 时间）
- [x] 顶部"新建项目"按钮
- [x] 空状态引导 UI
- [x] "新建项目"卡片（第一格，虚线边框）
- [x] mock 数据渲染（4个项目）

---

### 0.5 — 新建项目：意图输入 ✅

- [x] 独立页面（`/new`），两步流程
- [x] Step 1：大文本框 + 示例项目卡片 + 分析按钮（loading 状态）
- [x] Step 2：解析结果概要 + Skill 卡片选择（推荐高亮）+ 确认按钮
- [x] mock 解析逻辑（700ms 延迟，按关键词匹配 Skill）

---

### 0.6 & 0.7 — Agent 创作模式 + 分镜视图 ✅

- [x] 路由：`/projects/[id]`
- [x] 左右双栏布局（左 400px Chat，右侧内容预览）
- [x] Chat Panel：用户/Agent 消息气泡 + 确认节点卡片（带确认/修改按钮）+ 输入框
- [x] 确认节点：确认后变灰显示已确认状态
- [x] 内容预览区：阶段进度 Tab（Brief/大纲/脚本/分镜）
- [x] Brief 视图、Outline 视图（Act/Scene 树状）、分镜网格视图
- [x] Shot 卡片：图片占位 + 镜头类型 + 台词 + 重新生成/锁定按钮
- [x] 锁定状态视觉区分（斜纹背景 + 🔒 图标）
- [x] 顶部面包屑 + "进入 Studio" 按钮

---

### 0.8 — Studio 编辑模式（基础框架）✅

- [x] 路由：`/projects/[id]/studio`
- [x] 顶部工具栏（返回 / 项目名 / 撤销重做 / 保存 / 导出）
- [x] 左侧片段列表（可选中高亮）
- [x] 中间视频预览占位 + 播放控制条 + 进度条
- [x] 右侧属性面板（基本信息 / 台词 / 重生成 / 锁定按钮）
- [x] 时间轴（视频轨 / 字幕轨 / 音乐轨，静态 mock 渲染）
- [x] 底部 Chat Bar（可收起/展开）

---

### 0.9 — 整体 UI 打磨（下一步）

- [x] 统一深色主题（zinc 色阶 + violet 主色调）
- [x] 状态 badge / Skill badge 颜色规范
- [x] 骨架屏组件（ProjectCardSkeleton）
- [ ] 确认节点"修改"按钮：聚焦输入框并给出引导文字
- [ ] 响应式适配（1280px 以上）
- [ ] 整体走查交互逻辑

**关键决策记录（2026-03-16）**：
- Next.js 16.1.6（最新稳定版）
- Tailwind v4 + shadcn v4（`@import "tailwindcss"` 新语法）
- 项目放在 `frontend/` 子目录中
- mock 数据全部在 `lib/mock/`，类型在 `lib/types/index.ts`

---

## Phase 1 — 数据库 & Prisma 接入

**目标**：用 Prisma 定义 schema，搭建迁移体系，为后端接入做准备。

- [ ] 在项目根目录初始化 Prisma（`npx prisma init`）
- [ ] 本地起 PostgreSQL（Docker Compose）
- [ ] 按 [development.md §12](./development.md#12-关键数据对象分层) 定义完整 schema.prisma：
  - Project 系列
  - Skill 系列
  - 内容结构对象（Brief / Outline / Script / Storyboard / Act / Scene / Shot / Clip）
  - 一致性对象
  - 编辑工程对象
  - **计费占位**：User.credits（积分余额）、CreditTransaction（充值/消耗流水）、OperationLog（操作成本记录）—— 字段先建，逻辑 Phase 9 再实现
- [ ] 第一次 `prisma migrate dev`
- [ ] 生成 Prisma Client，封装 `lib/db.ts`
- [ ] 用 `prisma db seed` 写入 mock Skill 数据

---

## Phase 2 — Better Auth 接入

- [ ] 配置 Better Auth（邮箱登录先跑通）
- [ ] 登录 / 注册页面（复用 `(auth)` route group）
- [ ] 用户 session 与 Project 绑定（user_id）
- [ ] 路由鉴权（未登录跳转）
- [ ] 后续加：Google OAuth / 微信登录

---

## Phase 3 — 后端 Python FastAPI 搭建

**目标**：Python 后端独立运行，提供 REST API，前端替换 mock 数据。

- [ ] 初始化 Python 项目（`uv` 管理依赖）
- [ ] FastAPI + Uvicorn 基础结构
- [ ] 连接 PostgreSQL（通过 Prisma 迁移的表，Python 侧用 SQLAlchemy 或直接 asyncpg）
- [ ] 基础路由：`/health`、`/api/v1/projects`
- [ ] CORS 配置
- [ ] 前端替换 mock → 真实 API 请求

---

## Phase 4 — Agent 编排接入

- [ ] Anthropic Python SDK 接入
- [ ] Intent Agent（意图解析）
- [ ] Skill Router（Skill 匹配）
- [ ] Planner / Script / Storyboard Agent
- [ ] ApprovalGate 暂停机制
- [ ] 前端 Vercel AI SDK v5 对接流式输出

---

## Phase 5 — 中间件接入

- [ ] Redis：Docker Compose 起服务，Python 接入 `redis-py`
- [ ] Dramatiq + Redis：消息队列，处理异步生成任务
- [ ] S3 / MinIO：文件上传，presigned URL 直传
- [ ] 前端接入文件上传（素材上传到 S3）

---

## Phase 6 — 生成层接入

- [ ] 定义统一生成接口协议（可插拔）
- [ ] 图片生成（分镜预览图）
- [ ] TTS 语音合成（口播音频）
- [ ] 视频生成 API（先跑通一个：Runway / Kling / Pika）
- [ ] 背景音乐 API

---

## Phase 7 — Studio 编辑器完整实现

- [ ] 时间轴方案调研选型（Remotion / 自研）
- [ ] 时间轴真实交互（拖拽、调整时长）
- [ ] 片段替换、增删镜头
- [ ] 字幕轨道编辑
- [ ] 音乐轨道
- [ ] 锁定功能
- [ ] 版本快照 + 回退
- [ ] 服务端 FFmpeg 合成导出

---

## Phase 8 — 一致性引擎

- [ ] `ConsistencyManager` Python 模块
- [ ] Character Registry
- [ ] Scene / Style Memory
- [ ] Continuity Checker
- [ ] Shot Bridge Planner

---

## Phase 9 — 计费系统 & 上线准备

> 详细设计见 [development.md §16](./development.md#16-计费系统与多提供商架构)

### 计费系统
- [ ] Stripe 接入（充值页面、Webhook 处理）
- [ ] 积分包定价（1积分 = $0.001，充值 $10 = 10,000 积分）
- [ ] Node BFF 层：操作前积分校验 + 预扣 + 结算中间件
- [ ] 操作消耗配置表（对话/脚本/图片/视频/TTS 各自积分消耗）
- [ ] 失败自动退还积分
- [ ] 用户积分余额页面 + 充值入口
- [ ] 消费明细记录展示

### 生成器抽象层（Python）
- [ ] `GeneratorService` 统一接口
- [ ] 图片生成路由（Flux / DALL-E，按成本优先）
- [ ] 视频生成路由（Runway / Kling / Pika，支持降级切换）
- [ ] TTS 路由（ElevenLabs / OpenAI TTS）
- [ ] 高级用户绑定自己 API key（可选，后续评估）

### 上线准备
- [ ] 错误监控（Sentry）
- [ ] Analytics
- [ ] 部署：前端 Vercel，后端 Docker + 云服务器
- [ ] CI/CD

---

## 暂挂 / 后续评估

- 用户自定义 Skill
- 移动端
- 多人协作

---

## 已完成

> 完成后移动到此区域，注明日期和关键决策。

（暂无）
