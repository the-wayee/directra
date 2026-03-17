import { create } from "zustand"
import type { Message } from "@/lib/types"
import {
  createProject as createProjectAction,
  listProjects as listProjectsAction,
  getProject as getProjectAction,
  updateProjectTitle as updateProjectTitleAction,
  addMessage as addMessageAction,
  deleteProject as deleteProjectAction,
} from "@/lib/actions/project"

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
  loaded: boolean

  // Actions
  loadProjects: () => Promise<void>
  loadProjectMessages: (projectId: string) => Promise<void>
  createConversation: (firstMessage: string) => Promise<string>
  setActiveId: (id: string | null) => void
  addMessage: (projectId: string, message: Message) => void
  addMessageToDb: (projectId: string, message: Omit<Message, "id">) => Promise<Message>
  updateTitle: (projectId: string, title: string) => void
  removeProject: (projectId: string) => Promise<void>
}

// ─── AI title generation ────────────────────────────────────────────────────

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
  const clean = message.replace(/\n/g, " ").trim()
  if (clean.length <= 20) return clean
  return clean.slice(0, 18) + "..."
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  conversations: [],
  activeId: null,
  loaded: false,

  loadProjects: async () => {
    try {
      const projects = await listProjectsAction()
      set({
        conversations: projects.map((p) => ({
          id: p.id,
          title: p.title,
          titleGenerating: false,
          messages: [], // Messages loaded lazily per project
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
        loaded: true,
      })
    } catch {
      // Auth not ready or error — keep empty
      set({ loaded: true })
    }
  },

  loadProjectMessages: async (projectId: string) => {
    try {
      const project = await getProjectAction(projectId)
      if (!project) return

      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === projectId
            ? { ...c, messages: project.messages as Message[], title: project.title }
            : c
        ),
      }))
    } catch {
      // Ignore errors
    }
  },

  createConversation: async (firstMessage: string) => {
    // Optimistic: create local entry immediately
    const tempId = `temp-${Date.now()}`
    const now = new Date().toISOString()

    const userMsg: Message = {
      id: `msg-temp-${Date.now()}`,
      role: "user",
      type: "text",
      content: firstMessage,
    }

    const conv: Conversation = {
      id: tempId,
      title: "新对话",
      titleGenerating: true,
      messages: [userMsg],
      createdAt: now,
      updatedAt: now,
    }

    set((state) => ({
      conversations: [conv, ...state.conversations],
      activeId: tempId,
    }))

    // Create in DB
    try {
      const result = await createProjectAction(firstMessage)

      // Replace temp conversation with real one
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === tempId
            ? {
                ...c,
                id: result.id,
                messages: result.messages as Message[],
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
              }
            : c
        ),
        activeId: state.activeId === tempId ? result.id : state.activeId,
      }))

      // Generate title async
      generateTitleWithAI(firstMessage).then(async (title) => {
        try {
          await updateProjectTitleAction(result.id, title)
        } catch {
          // ignore
        }
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === result.id ? { ...c, title, titleGenerating: false } : c
          ),
        }))
      })

      return result.id
    } catch (err) {
      // Remove temp conversation on failure
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== tempId),
        activeId: null,
      }))
      throw err
    }
  },

  setActiveId: (id) => set({ activeId: id }),

  // Local-only add (for optimistic updates)
  addMessage: (projectId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === projectId
          ? { ...c, messages: [...c.messages, message], updatedAt: new Date().toISOString() }
          : c
      ),
    })),

  // Add message and persist to DB
  addMessageToDb: async (projectId, message) => {
    const saved = await addMessageAction(projectId, message)
    const msg = saved as Message

    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === projectId
          ? { ...c, messages: [...c.messages, msg], updatedAt: new Date().toISOString() }
          : c
      ),
    }))

    return msg
  },

  updateTitle: (projectId, title) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === projectId ? { ...c, title } : c
      ),
    })),

  removeProject: async (projectId: string) => {
    await deleteProjectAction(projectId)
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== projectId),
      activeId: state.activeId === projectId ? null : state.activeId,
    }))
  },
}))
