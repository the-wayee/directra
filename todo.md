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

## 当前阶段：Phase 2.6 — 主页重构（Chat-first）

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

## Phase 1 — 数据库 & Prisma 接入 ✅（部分）

- [x] Prisma 7 初始化（prisma.config.ts + schema.prisma）
- [x] 本地 PostgreSQL（Docker）
- [x] Better Auth 所需表（User/Session/Account/Verification）
- [x] 第一次 prisma migrate dev
- [x] 生成 Prisma Client，封装 lib/db.ts（PrismaPg adapter）
- [ ] 完整业务 schema（Project/Skill/Brief/Outline/Script 等）—— 后续阶段补充

---

## Phase 3 — 后端 Python FastAPI 搭建

- [ ] 初始化 Python 项目（`uv` 管理依赖）
- [ ] FastAPI + Uvicorn 基础结构
- [ ] 连接 PostgreSQL
- [ ] 基础路由
- [ ] CORS 配置
- [ ] 前端替换 mock → 真实 API

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
