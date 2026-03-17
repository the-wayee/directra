# Directra — 渐进式迭代任务列表

> 每次开发后必须更新本文档：勾选完成项、移入"已完成"区域、记录关键决策。
> 产品思想参见 [development.md](./development.md)，架构与技术栈参见 [CLAUDE.md](./CLAUDE.md)。

**产品定位**：ToC，面向短视频创作者（Agent Video Clip — 不只是生成视频，更是 AI 剪辑视频）
**开发策略**：前端优先——先把 UI/交互跑通（用 mock 数据），明确产品形态后再接后端
**技术栈速查**：
- 前端：Next.js 15 + shadcn/ui v4 + Tailwind v4 + TanStack Query + Zustand + Vercel AI SDK v5 + Better Auth
- 后端：Python FastAPI + Dramatiq + Redis + PostgreSQL + S3
- 数据库迁移：Prisma（前端侧 schema 管理）

---

## 当前阶段：Phase 3 — Python FastAPI 执行层搭建

### 2.9 — 数据模型重构：Project → Conversation → Message ✅

- [x] 修复 Prisma Client 缓存 bug（Turbopack 缓存旧 client 导致 `prisma.project` 为 undefined）
  - 根因：`prisma generate` 后 `.next` 缓存未清理，Turbopack 加载了仅含 Auth 模型的旧 client
  - 修复：清理 `.next` 缓存后重启 dev server
- [x] 新增 Conversation 表（三层数据模型）
  - Project（工作区/主题）→ Conversation[]（每个对话产出一个视频）→ Message[]（聊天消息）
  - `phase` 字段从 Project 移至 Conversation（每个对话独立推进阶段）
  - Project 简化为工作区角色（title/status/skillId）
- [x] Prisma migration: `add_conversation_layer`
- [x] Server Actions 全面重构（`lib/actions/project.ts`）
  - 新增：`createConversation` / `listConversations` / `getConversation` / `updateConversationTitle` / `deleteConversation`
  - `addMessage` 改为基于 `conversationId`（非 `projectId`）
  - 删除对话时，若项目无剩余对话则自动删除项目
  - `listProjects` 返回每个项目的最新对话 ID
- [x] Zustand Store 适配新数据模型
  - `Conversation` 接口新增 `projectId` 字段
  - `loadConversationMessages` 替代 `loadProjectMessages`
  - `removeConversation` 替代 `removeProject`
  - 标题同时更新到 Conversation 和 Project
- [x] 路由迁移：`/projects/[id]` → `/c/[id]`（对话页）
  - 新建 `(dashboard)/c/[id]/page.tsx`
  - 侧边栏链接更新为 `/c/{conversationId}`
  - middleware 新增 `/c` 路由保护
- [x] SSE `/api/chat` 适配：`projectId` → `conversationId`
- [x] TypeScript 零错误编译通过

---

### 2.7 — Landing Page 品牌重塑（Agent Video Clip）✅

- [x] 全站文案重写：突出「不只是生成视频，更是 AI 剪辑视频」核心定位
- [x] Hero 区：标题改为「不只是生成视频 / 更是 AI 剪辑视频」，副标题面向视频创作者
- [x] Hero Mockup：示例从科普视频改为产品测评剪辑方案
- [x] Features：6 大能力重写（AI 脚本+剪辑规划、领域化剪辑 Skill、逐段确认、一致性引擎、专业时间轴剪辑台、自然语言剪辑）
- [x] HowItWorks：四步流程围绕「描述需求→AI 生成剪辑方案→逐段确认→时间轴精修导出」
- [x] DualMode：Agent 创作模式（对话驱动创作与剪辑）+ Studio 剪辑模式（专业剪辑台）
- [x] Skills：产品测评、知识讲解、品牌营销、课程教程、口播 Vlog、新闻解读
- [x] FAQ：新增「适合什么样的视频创作者」「和 Premiere/剪映有什么区别」
- [x] SocialProof / CTA / Footer 文案统一更新
- [x] Node.js BFF 层职责梳理完成（为 Phase 3 Python 接入做准备）

---

### 2.6 — 主页 & 对话流程重构 ✅

- [x] `/dashboard` → `/home` 路由迁移（全局替换所有引用）
- [x] 主页重设计：左侧对话列表侧边栏 + 右侧居中 AI 输入框（v0/ChatGPT 风格）
- [x] 共享侧边栏组件 `AppSidebar`（首页 & 对话页复用）
  - 可折叠动画（Framer Motion spring）
  - 对话历史按日期分组（今天/昨天/更早）
  - 当前对话高亮
  - 用户菜单（资料/关联账号/退出登录）
  - 新建对话按钮 → 跳转 `/home`
- [x] Zustand store 管理对话状态（`useProjectsStore`）
  - `createConversation(msg)` → 自动创建项目并跳转
  - `addMessage` / `updateTitle` / `setActiveId`
- [x] 发送消息 → 自动创建项目 → 直接进入 AI 对话（无需手动建项目）
- [x] AI 生成项目标题（`/api/generate-title`，当前智能规则提取，后续接入 Claude）
  - 侧边栏显示"生成标题中..."占位
- [x] 对话页全新 chat-first 布局
  - 消息气泡样式（用户紫色右对齐、AI 带 logo 左对齐）
  - 打字中指示器（三点动画）
  - mock AI 多轮回复
- [x] middleware 路由保护更新（`/home` 替换 `/dashboard`）
- [x] `/new` 和 `/projects` 独立 layout（保留 Navbar）

---

## Phase 2 — Auth & 用户系统 ✅

### 2.1 — Better Auth 基础接入 ✅

- [x] 安装 Better Auth + Prisma adapter
- [x] 配置 auth.ts（GitHub OAuth + Google OAuth + 邮箱密码）
- [x] 创建 Prisma schema（User/Session/Account/Verification）
- [x] 运行 prisma migrate dev，生成 Prisma Client
- [x] API 路由 `/api/auth/[...all]/route.ts`
- [x] auth-client.ts + emailOTPClient 插件
- [x] middleware.ts 路由保护（/home、/new、/projects、/settings）

### 2.2 — 登录注册页 ✅

- [x] 登录页 `(auth)/login/page.tsx`：四种模式（login/register/verify/forgot）
- [x] GitHub OAuth + Google OAuth 一键登录
- [x] 邮箱 + 密码登录
- [x] 邮箱注册 → OTP 验证码验证邮箱（Better Auth emailOTP 插件）
- [x] Cloudflare Turnstile 人机验证（注册 & 忘记密码流程）
- [x] 密码可见/隐藏切换（eye icon，隐藏浏览器原生图标）
- [x] 重发验证码 60s 前端倒计时 + 后端限流（3次/分钟）
- [x] 错误信息中文翻译（translateAuthError）
- [x] Framer Motion spring 动画（stagger 入场、layout 高度过渡、blur 淡入）

### 2.3 — Resend 邮件服务 ✅

- [x] Resend 集成（API key 配置）
- [x] OTP 邮件模板（品牌 Logo + 6 位验证码 + 5 分钟有效期）
- [x] 错误捕获 & 日志输出（sendVerificationOTP 内 try/catch）
- [x] 开发阶段 RESEND_TEST_EMAIL 重定向（Resend 沙盒限制 workaround）

### 2.4 — Session & 导航 ✅

- [x] `emailVerification.autoSignInAfterVerification: true`（验证后自动登录）
- [x] `session.cookieCache`（5 分钟 cookie 缓存，减少 get-session API 调用）
- [x] Landing Navbar 识别登录状态（已登录 → 显示「进入工作台」+ 头像）
- [x] 共享侧边栏用户菜单（替代原 Dashboard Navbar 下拉菜单）

### 2.5 — 用户设置页 ✅

- [x] 设置中心 Layout（左侧导航 + framer motion 指示器）
- [x] `/settings/profile` 用户资料页：修改名称、修改密码（含 show/hide toggle）
- [x] `/settings/accounts` 第三方账号绑定/解绑（GitHub、Google）
- [x] `linkSocial` 手动跳转（Better Auth 不自动 redirect）
- [x] `allowDifferentEmails: true`（允许不同邮箱的第三方账号绑定）
- [x] 绑定状态展示（已绑定 → 显示绑定日期 + 解绑按钮）
- [x] OAuth 回调错误处理（URL `?error=` 参数翻译为中文提示）
- [x] 安全的解绑逻辑（至少保留一种登录方式）
- [x] `/settings` 加入 middleware 路由保护

---

## Phase 0 — 前端脚手架 ✅

### 0.1 — 项目初始化 ✅

- [x] `npx create-next-app@latest` (TypeScript, App Router, Tailwind, ESLint) — Next.js 16.1.6
- [x] 安装并初始化 shadcn/ui v4（`npx shadcn init`）
- [x] 安装核心依赖：
  - `@tanstack/react-query` v5
  - `zustand`
  - `ai`（Vercel AI SDK v5）
  - `react-hook-form` + `zod` + `@hookform/resolvers`
- [x] 路径别名已配置（`@/` → `src/`，create-next-app 默认）

### 0.2 — 项目目录结构 ✅

- [x] 创建完整目录结构
- [x] 创建 `lib/mock/` 目录

### 0.3 — 核心 Mock 数据定义 ✅

- [x] 定义核心 TypeScript 类型
- [x] 写 mock 数据文件
- [x] 工具函数

### 0.4 — 首页：项目列表 ✅

- [x] NavBar、项目列表网格、ProjectCard、空状态引导

### 0.5 — 新建项目：意图输入 ✅

- [x] 独立页面 `/new`，两步流程

### 0.6 & 0.7 — Agent 创作模式 + 分镜视图 ✅

- [x] Chat Panel + 确认节点 + 内容预览区

### 0.8 — Studio 编辑模式 ✅

- [x] 工具栏 + 片段列表 + 视频预览 + 属性面板 + 时间轴

### 0.9 — 整体 UI 打磨（部分完成）

- [x] 浅色主题（slate 色阶 + violet 主色调）
- [x] 状态 badge / Skill badge 颜色规范
- [x] 骨架屏组件
- [ ] 确认节点"修改"按钮：聚焦输入框并给出引导文字
- [ ] 响应式适配（1280px 以上）
- [ ] 整体走查交互逻辑

---

## Phase 1 — 数据库 & Prisma 接入 ✅

- [x] Prisma 7 初始化（prisma.config.ts + schema.prisma）
- [x] 本地 PostgreSQL（Docker）
- [x] Better Auth 所需表（User/Session/Account/Verification）
- [x] 第一次 prisma migrate dev
- [x] 生成 Prisma Client，封装 lib/db.ts（PrismaPg adapter）
- [x] 业务 schema：Project / Conversation / Message / CreditBalance / CreditLog

---

## Phase 2.8 — Node BFF 数据持久化（Phase 3 前置）✅

- [x] Prisma Schema 扩展：Project / Conversation / Message / CreditBalance / CreditLog
- [x] Server Actions CRUD（`lib/actions/project.ts`）
  - Project: `listProjects` / `updateProjectTitle` / `deleteProject`
  - Conversation: `createConversation` / `listConversations` / `getConversation` / `updateConversationTitle` / `deleteConversation`
  - Message: `addMessage`（含所有权校验）
  - 所有操作自动验证当前用户 session
- [x] Zustand Store 重构：纯内存 mock → 数据库持久化
  - `loadProjects` / `loadConversationMessages`（懒加载消息）
  - `createConversation` 乐观更新 + DB 持久化 + AI 标题生成
  - `addMessageToDb` 持久化消息
  - `removeConversation` 删除对话（含侧边栏删除按钮）
- [x] SSE 流式中转接口 `/api/chat`
  - 完整通信协议设计（event: token/tool_call/confirmation/done/error）
  - 当前 mock 流式回复（逐字输出），后续替换为 Python 转发
  - Auth 校验 + 对话所有权验证
  - 消息自动持久化到 DB
- [x] 积分系统 schema 占位（CreditBalance + CreditLog）
- [ ] 文件上传协调（S3 presigned URL 签发接口）—— 推迟到 Phase 5

---

## Phase 3 — Python FastAPI 执行层搭建

- [ ] 初始化 Python 项目（`uv` 管理依赖）
- [ ] FastAPI + Uvicorn 基础结构
- [ ] asyncpg 连接 PostgreSQL（只读写，不管 schema）
- [ ] `/api/chat` SSE 流式接口（接收消息，返回 Agent 回复流）
- [ ] CORS 配置（只允许 Node BFF 访问）
- [ ] 健康检查 + 日志

---

## Phase 4 — Agent 编排接入

- [ ] Anthropic Python SDK
- [ ] Intent Agent / Skill Router / Planner
- [ ] ApprovalGate 暂停机制
- [ ] 前端 Vercel AI SDK v5 对接流式输出

---

## Phase 5 — 中间件接入

- [ ] Redis
- [ ] Dramatiq + Redis 消息队列
- [ ] S3 / MinIO 文件上传

---

## Phase 6 — 生成层接入

- [ ] 图片/视频/TTS/音乐 生成 API

---

## Phase 7 — Studio 编辑器完整实现

- [ ] 时间轴真实交互
- [ ] 片段替换、增删镜头
- [ ] 字幕/音乐轨道编辑
- [ ] 版本快照 + 回退
- [ ] FFmpeg 合成导出

---

## Phase 8 — 一致性引擎

- [ ] ConsistencyManager
- [ ] Character/Scene/Style Memory

---

## Phase 9 — 计费系统 & 上线准备

- [ ] Stripe 接入 + 积分包定价
- [ ] 操作消耗配置 + 预扣结算
- [ ] Sentry / Analytics / CI/CD / 部署

---

## 已完成

**2026-03-16** Phase 0 全部完成。关键决策：Next.js 16.1.6、Tailwind v4 + shadcn v4、项目放 `frontend/` 子目录。

**2026-03-17** Phase 1 部分 + Phase 2（2.1–2.5）完成。关键决策：
- Better Auth + Prisma 7（PrismaPg adapter）
- emailOTP 插件（6 位验证码 + Resend 邮件）
- Cloudflare Turnstile 人机验证
- session.cookieCache 前端持久化
- 浅色主题全面切换

**2026-03-17** Phase 2.6 主页重构完成。关键决策：
- `/dashboard` → `/home`，Chat-first 设计（类似 v0/ChatGPT）
- 发消息直接创建项目并进入对话（不需手动建项目）
- AI 生成项目标题（`/api/generate-title`，当前规则提取，后续接 Claude）
- 共享侧边栏 `AppSidebar`（Zustand store 管理对话状态）
- 对话页全宽聊天布局 + 打字指示器 + mock 多轮回复

**2026-03-17** Phase 2.7 Landing Page 品牌重塑完成。关键决策：
- 核心定位确定为 **Agent Video Clip**：不只是生成视频，更是 AI 剪辑视频
- 全站文案重写，面向视频创作者（测评博主、UP 主、Vlog 博主、带货主播）
- Skill 体系调整：新增「产品测评」，「儿童故事」→「课程教程」，「口播+B-roll」→「口播 Vlog」
- Node.js BFF 职责梳理：Auth/DB/积分/文件/SSE 中转归 Node，AI Agent/生成归 Python
- 新增 Phase 2.8（Node BFF 数据持久化）作为 Phase 3 前置任务

**2026-03-18** Phase 2.8 Node BFF 数据持久化完成。关键决策：
- Prisma Schema 扩展：Project / Message / CreditBalance / CreditLog
- Server Actions 实现完整 CRUD（含 session 验证 + 所有权校验）
- Zustand Store 从纯内存 mock 重构为 DB 持久化（乐观更新 + 懒加载）
- `/api/chat` SSE 中转接口（mock 流式回复，通信协议设计完成）
- 侧边栏新增删除对话功能
- 下一步：Phase 3 — Python FastAPI 执行层

**2026-03-18** Phase 2.9 数据模型重构完成。关键决策：
- 三层数据模型：Project（工作区）→ Conversation（对话/视频）→ Message（消息）
- 一个项目可包含多个对话，为系列创作、跨视频上下文共享、未来团队协作做准备
- 路由从 `/projects/[id]` 迁移到 `/c/[id]`（对话为核心交互单元）
- `phase` 字段从 Project 移至 Conversation（每个对话独立推进制作阶段）
- 修复 Prisma Turbopack 缓存 bug：`prisma generate` 后必须清理 `.next` 缓存
- 下一步：Phase 3 — Python FastAPI 执行层
