import { NextRequest } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

/**
 * POST /api/chat
 *
 * SSE 流式中转接口 — Node BFF 作为前端与 Python 执行层之间的网关。
 *
 * 当前阶段：返回 mock 流式回复（前端优先策略）。
 * 后续阶段：转发到 Python FastAPI 的 /api/chat SSE 接口，中转流式数据。
 *
 * SSE 数据格式（前端 ↔ Node ↔ Python 统一）：
 *   event: token        data: {"content": "..."}         // 流式文字 token
 *   event: tool_call    data: {"name": "...", ...}       // Agent tool_use
 *   event: confirmation data: {"id": "...", "desc": ""}  // 确认节点
 *   event: done         data: {"messageId": "..."}       // 完成
 *   event: error        data: {"message": "..."}         // 错误
 *
 * Request body:
 *   { conversationId: string, message: string }
 */
export async function POST(req: NextRequest) {
  // Auth check
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return new Response("未登录", { status: 401 })
  }

  const { conversationId, message } = await req.json()

  if (!conversationId || !message) {
    return new Response("缺少参数", { status: 400 })
  }

  // Verify conversation ownership
  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, project: { userId: session.user.id } },
    select: { id: true, projectId: true },
  })
  if (!conv) {
    return new Response("对话不存在", { status: 404 })
  }

  // Save user message to DB
  await prisma.message.create({
    data: {
      conversationId,
      role: "user",
      type: "text",
      content: message,
    },
  })

  // ─── Mock SSE stream（后续替换为 Python 转发）─────────────────────────────
  const mockReply = generateMockReply(message)
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const words = mockReply.split("")
      for (let i = 0; i < words.length; i++) {
        const chunk = `event: token\ndata: ${JSON.stringify({ content: words[i] })}\n\n`
        controller.enqueue(encoder.encode(chunk))
        await new Promise((r) => setTimeout(r, 15 + Math.random() * 25))
      }

      // Save assistant message to DB
      const saved = await prisma.message.create({
        data: {
          conversationId,
          role: "assistant",
          type: "text",
          content: mockReply,
        },
      })

      // Touch conversation and project updatedAt
      const now = new Date()
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: now },
      })
      await prisma.project.update({
        where: { id: conv.projectId },
        data: { updatedAt: now },
      })

      const done = `event: done\ndata: ${JSON.stringify({ messageId: saved.id })}\n\n`
      controller.enqueue(encoder.encode(done))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

// ─── Mock reply generator ────────────────────────────────────────────────────

function generateMockReply(message: string): string {
  const lower = message.toLowerCase()

  if (lower.includes("确认") || lower.includes("好") || lower.includes("可以")) {
    return `好的，方向已确认。我来帮你规划下一步：

**脚本结构**
1. **开场 Hook（0-5秒）**：快剪 + 核心卖点一句话
2. **主体内容（5-25秒）**：功能演示 + B-roll 画面
3. **结尾 CTA（25-30秒）**：总结 + 行动引导

我会逐段生成脚本，每段你都可以确认或修改。要开始吗？`
  }

  if (lower.includes("修改") || lower.includes("调整") || lower.includes("改")) {
    return `没问题，我来调整。请告诉我具体想修改哪个部分？比如：

- "第X段节奏太慢"
- "开场不够抓人"
- "这段的画面描述换成..."

你可以直接说修改意见，我会立即更新。`
  }

  return `我理解你的需求了。在开始之前，我想确认几个关键点：

**视频时长**：你期望多长？30秒短片还是3-5分钟的完整视频？

**目标受众**：主要给谁看？社交媒体观众、客户演示、还是内部培训？

**风格偏好**：偏向轻松活泼、专业严肃、还是电影感？

确认后我会帮你生成脚本和剪辑方案。`
}
