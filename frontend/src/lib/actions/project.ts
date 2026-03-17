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

export async function createProject(firstMessage: string) {
  const userId = await getCurrentUserId()

  const project = await prisma.project.create({
    data: {
      userId,
      title: "新对话",
      status: "DRAFT",
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

  return {
    id: project.id,
    title: project.title,
    messages: project.messages.map(serializeMessage),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
}

export async function listProjects() {
  const userId = await getCurrentUserId()

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      phase: true,
      skillId: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return projects.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))
}

export async function getProject(projectId: string) {
  const userId = await getCurrentUserId()

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  })

  if (!project) return null

  return {
    id: project.id,
    title: project.title,
    status: project.status,
    phase: project.phase,
    skillId: project.skillId,
    messages: project.messages.map(serializeMessage),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
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

// ─── Message CRUD ────────────────────────────────────────────────────────────

export async function addMessage(
  projectId: string,
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

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  })
  if (!project) throw new Error("项目不存在")

  const created = await prisma.message.create({
    data: {
      projectId,
      role: message.role,
      type: message.type || "text",
      content: message.content,
      confirmationId: message.confirmationId,
      confirmationDescription: message.confirmationDescription,
      confirmed: message.confirmed,
    },
  })

  // Touch project updatedAt
  await prisma.project.update({
    where: { id: projectId },
    data: { updatedAt: new Date() },
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
