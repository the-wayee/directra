import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/generate-title
 * 用 AI 根据用户第一条消息生成简短的项目标题。
 *
 * 当前阶段：使用简单规则生成（前端优先策略，后续接入 Claude）。
 * 后续：调用 Claude API 生成更智能的标题。
 */
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "缺少 message 参数" }, { status: 400 })
    }

    // TODO: 接入 Claude API 生成更智能的标题
    // const title = await generateWithClaude(message)

    // 当前阶段：智能规则提取
    const title = smartExtractTitle(message)

    return NextResponse.json({ title })
  } catch {
    return NextResponse.json({ error: "生成失败" }, { status: 500 })
  }
}

/**
 * 智能提取标题 — 不是简单截断，而是提取核心意图
 */
function smartExtractTitle(message: string): string {
  const clean = message.replace(/\n/g, " ").trim()

  // 尝试提取核心动作 + 对象
  // 模式："帮我做/剪辑/制作/生成 XXX"
  const actionMatch = clean.match(/(?:帮我|我想|请|做|剪辑|制作|生成|创建|拍|写)\s*(?:一[个段部条支]|一下)?\s*(.{2,20}?)(?:[，,。.！!？?]|$)/)
  if (actionMatch) {
    const core = actionMatch[1].trim()
    if (core.length >= 2 && core.length <= 20) return core
  }

  // 模式：直接描述 "XXX视频/短片/宣传片"
  const videoMatch = clean.match(/(.{2,15}?(?:视频|短片|宣传片|动画|课程|教程|故事|片子|Vlog|vlog))/)
  if (videoMatch) {
    return videoMatch[1]
  }

  // 兜底：取前 15 个字
  if (clean.length <= 15) return clean
  return clean.slice(0, 13) + "..."
}
