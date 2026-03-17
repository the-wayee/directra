"use server"

import { headers } from "next/headers"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getCurrentUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error("未登录")
  return session.user.id
}

// ─── Project CRUD ────────────────────────────────────────────────────────────

export async function listProjects() {
  const userId = await getCurrentUserId()

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      skillId: true,
      createdAt: true,
      updatedAt: true,
      conversations: {
        select: { id: true },
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
  })

  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    skillId: p.skillId,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    latestConversationId: p.conversations[0]?.id ?? null,
  }))
}

export async function updateProjectTitle(projectId: string, title: string) {
  const userId = await getCurrentUserId()

  await prisma.project.updateMany({
    where: { id: projectId, userId },
    data: { title },
  })
}

export async function deleteProject(projectId: string) {
  const userId = await getCurrentUserId()

  await prisma.project.deleteMany({
    where: { id: projectId, userId },
  })
}

// ─── Conversation CRUD ──────────────────────────────────────────────────────

/**
 * Create a new conversation with the first user message.
 * Auto-creates a default project if none exists, or creates within an existing project.
 */
export async function createConversation(firstMessage: string, projectId?: string) {
  const userId = await getCurrentUserId()

  // If no projectId, create a new project with this conversation
  if (!projectId) {
    const project = await prisma.project.create({
      data: {
        userId,
        title: "新项目",
        status: "DRAFT",
        conversations: {
          create: {
            title: "新对话",
            phase: "CHAT",
            messages: {
              create: {
                role: "user",
                type: "text",
                content: firstMessage,
              },
            },
          },
        },
      },
      include: {
        conversations: {
          include: { messages: true },
        },
      },
    })

    const conv = project.conversations[0]
    return {
      projectId: project.id,
      conversationId: conv.id,
      title: conv.title,
      messages: conv.messages.map(serializeMessage),
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
    }
  }

  // Create conversation within existing project
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  })
  if (!project) throw new Error("项目不存在")

  const conv = await prisma.conversation.create({
    data: {
      projectId,
      title: "新对话",
      phase: "CHAT",
      messages: {
        create: {
          role: "user",
          type: "text",
          content: firstMessage,
        },
      },
    },
    include: { messages: true },
  })

  // Touch project updatedAt
  await prisma.project.update({
    where: { id: projectId },
    data: { updatedAt: new Date() },
  })

  return {
    projectId,
    conversationId: conv.id,
    title: conv.title,
    messages: conv.messages.map(serializeMessage),
    createdAt: conv.createdAt.toISOString(),
    updatedAt: conv.updatedAt.toISOString(),
  }
}

export async function listConversations(projectId: string) {
  const userId = await getCurrentUserId()

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  })
  if (!project) throw new Error("项目不存在")

  const conversations = await prisma.conversation.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      phase: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return conversations.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }))
}

export async function getConversation(conversationId: string) {
  const userId = await getCurrentUserId()

  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      project: { userId },
    },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  })

  if (!conv) return null

  return {
    id: conv.id,
    projectId: conv.projectId,
    title: conv.title,
    phase: conv.phase,
    messages: conv.messages.map(serializeMessage),
    createdAt: conv.createdAt.toISOString(),
    updatedAt: conv.updatedAt.toISOString(),
  }
}

export async function updateConversationTitle(conversationId: string, title: string) {
  const userId = await getCurrentUserId()

  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, project: { userId } },
    select: { id: true },
  })
  if (!conv) throw new Error("对话不存在")

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { title },
  })
}

export async function deleteConversation(conversationId: string) {
  const userId = await getCurrentUserId()

  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, project: { userId } },
    select: { id: true, projectId: true },
  })
  if (!conv) throw new Error("对话不存在")

  await prisma.conversation.delete({
    where: { id: conversationId },
  })

  // If no more conversations in project, delete the project too
  const remaining = await prisma.conversation.count({
    where: { projectId: conv.projectId },
  })
  if (remaining === 0) {
    await prisma.project.delete({
      where: { id: conv.projectId },
    })
  }
}

// ─── Message CRUD ────────────────────────────────────────────────────────────

export async function addMessage(
  conversationId: string,
  message: {
    role: string
    type?: string
    content: string
    confirmationId?: string
    confirmationDescription?: string
    confirmed?: boolean
  }
) {
  const userId = await getCurrentUserId()

  // Verify ownership
  const conv = await prisma.conversation.findFirst({
    where: { id: conversationId, project: { userId } },
    select: { id: true, projectId: true },
  })
  if (!conv) throw new Error("对话不存在")

  const created = await prisma.message.create({
    data: {
      conversationId,
      role: message.role,
      type: message.type || "text",
      content: message.content,
      confirmationId: message.confirmationId,
      confirmationDescription: message.confirmationDescription,
      confirmed: message.confirmed,
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

  return serializeMessage(created)
}

// ─── Serialization ───────────────────────────────────────────────────────────

function serializeMessage(m: {
  id: string
  role: string
  type: string
  content: string
  confirmationId: string | null
  confirmationDescription: string | null
  confirmed: boolean | null
  createdAt: Date
}) {
  return {
    id: m.id,
    role: m.role as "user" | "assistant",
    type: m.type as "text" | "confirmation",
    content: m.content,
    ...(m.confirmationId && { confirmationId: m.confirmationId }),
    ...(m.confirmationDescription && { confirmationDescription: m.confirmationDescription }),
    ...(m.confirmed !== null && { confirmed: m.confirmed }),
    createdAt: m.createdAt.toISOString(),
  }
}
