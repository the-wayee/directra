import { create } from "zustand"
import type { Message } from "@/lib/types"
import { mockProjects } from "@/lib/mock/projects"

// ─── Conversation (project) ─────────────────────────────────────────────────

export interface Conversation {
  id: string
  title: string
  titleGenerating: boolean
  messages: Message[]
  createdAt: string
  updatedAt: string
}

interface ProjectsState {
  conversations: Conversation[]
  activeId: string | null

  // Actions
  createConversation: (firstMessage: string) => string
  setActiveId: (id: string | null) => void
  addMessage: (projectId: string, message: Message) => void
  updateTitle: (projectId: string, title: string) => void
}

// ─── AI title generation ────────────────────────────────────────────────────
// Calls /api/generate-title to let AI produce a concise project name.
// Falls back to truncation if the API is unavailable (dev / mock mode).

async function generateTitleWithAI(message: string): Promise<string> {
  try {
    const res = await fetch("/api/generate-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.title) return data.title
    }
  } catch {
    // API not available — fall through to fallback
  }
  // Fallback: simple truncation
  const clean = message.replace(/\n/g, " ").trim()
  if (clean.length <= 20) return clean
  return clean.slice(0, 18) + "..."
}

// Seed from mock data
const seedConversations: Conversation[] = mockProjects.map((p) => ({
  id: p.id,
  title: p.title,
  titleGenerating: false,
  messages: [],
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
}))

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  conversations: seedConversations,
  activeId: null,

  createConversation: (firstMessage: string) => {
    const id = `proj-${Date.now()}`
    const now = new Date().toISOString()

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      type: "text",
      content: firstMessage,
    }

    const conv: Conversation = {
      id,
      title: "新对话",
      titleGenerating: true,
      messages: [userMsg],
      createdAt: now,
      updatedAt: now,
    }

    set((state) => ({
      conversations: [conv, ...state.conversations],
      activeId: id,
    }))

    // Fire-and-forget: AI generates the title asynchronously
    generateTitleWithAI(firstMessage).then((title) => {
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === id ? { ...c, title, titleGenerating: false } : c
        ),
      }))
    })

    return id
  },

  setActiveId: (id) => set({ activeId: id }),

  addMessage: (projectId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === projectId
          ? { ...c, messages: [...c.messages, message], updatedAt: new Date().toISOString() }
          : c
      ),
    })),

  updateTitle: (projectId, title) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === projectId ? { ...c, title } : c
      ),
    })),
}))
