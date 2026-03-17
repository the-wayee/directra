import { create } from "zustand"
import type { Message } from "@/lib/types"
import {
  createConversation as createConversationAction,
  listProjects as listProjectsAction,
  getConversation as getConversationAction,
  updateConversationTitle as updateConversationTitleAction,
  updateProjectTitle as updateProjectTitleAction,
  addMessage as addMessageAction,
  deleteConversation as deleteConversationAction,
} from "@/lib/actions/project"

// ─── Conversation ───────────────────────────────────────────────────────────

export interface Conversation {
  id: string
  projectId: string
  title: string
  titleGenerating: boolean
  messages: Message[]
  createdAt: string
  updatedAt: string
}

interface ProjectsState {
  conversations: Conversation[]
  activeId: string | null // active conversation ID
  loaded: boolean

  // Actions
  loadProjects: () => Promise<void>
  loadConversationMessages: (conversationId: string) => Promise<void>
  createConversation: (firstMessage: string) => Promise<string>
  setActiveId: (id: string | null) => void
  addMessage: (conversationId: string, message: Message) => void
  addMessageToDb: (conversationId: string, message: Omit<Message, "id">) => Promise<Message>
  updateTitle: (conversationId: string, title: string) => void
  removeConversation: (conversationId: string) => Promise<void>
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
      // Flatten: each project's latest conversation becomes a sidebar entry
      // For now, 1 project = 1 conversation (auto-created)
      const convs: Conversation[] = projects
        .filter((p) => p.latestConversationId)
        .map((p) => ({
          id: p.latestConversationId!,
          projectId: p.id,
          title: p.title,
          titleGenerating: false,
          messages: [], // Loaded lazily
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }))
      set({ conversations: convs, loaded: true })
    } catch {
      set({ loaded: true })
    }
  },

  loadConversationMessages: async (conversationId: string) => {
    try {
      const conv = await getConversationAction(conversationId)
      if (!conv) return

      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? { ...c, messages: conv.messages as Message[], title: conv.title }
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
      projectId: "",
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
      const result = await createConversationAction(firstMessage)

      // Replace temp conversation with real one
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === tempId
            ? {
                ...c,
                id: result.conversationId,
                projectId: result.projectId,
                messages: result.messages as Message[],
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
              }
            : c
        ),
        activeId: state.activeId === tempId ? result.conversationId : state.activeId,
      }))

      // Generate title async — update both conversation and project title
      generateTitleWithAI(firstMessage).then(async (title) => {
        try {
          await updateConversationTitleAction(result.conversationId, title)
          await updateProjectTitleAction(result.projectId, title)
        } catch {
          // ignore
        }
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === result.conversationId ? { ...c, title, titleGenerating: false } : c
          ),
        }))
      })

      return result.conversationId
    } catch (err) {
      console.error("createConversation failed:", err)
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== tempId),
        activeId: null,
      }))
      throw err
    }
  },

  setActiveId: (id) => set({ activeId: id }),

  // Local-only add (for optimistic updates)
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message], updatedAt: new Date().toISOString() }
          : c
      ),
    })),

  // Add message and persist to DB
  addMessageToDb: async (conversationId, message) => {
    const saved = await addMessageAction(conversationId, message)
    const msg = saved as Message

    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, msg], updatedAt: new Date().toISOString() }
          : c
      ),
    }))

    return msg
  },

  updateTitle: (conversationId, title) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, title } : c
      ),
    })),

  removeConversation: async (conversationId: string) => {
    await deleteConversationAction(conversationId)
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== conversationId),
      activeId: state.activeId === conversationId ? null : state.activeId,
    }))
  },
}))
