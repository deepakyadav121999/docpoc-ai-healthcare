import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://dev.api.docpoc.app/DocPOC/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Message {
  id: string;
  text: string;
  sender: "user" | "doku";
  timestamp?: string;
}

export const sendMessage = async (
  message: string,
  sessionId: string,
): Promise<Message> => {
  try {
    const token = localStorage.getItem("docPocAuth_token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await apiClient.post(
      `/ai-agent/chat`,
      {
        message: message,
        queryType: "general",
        sessionId: sessionId,
        context: {},
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const dokuResponse: Message = {
      id: new Date().toISOString(),
      text: response.data.response || "Sorry, I could not find a response.",
      sender: "doku",
      timestamp: new Date().toISOString(),
    };
    return dokuResponse;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export interface Session {
  sessionId: string;
  lastMessage: string;
  messageCount: number;
}

export const getChatSessions = async (
  limit = 20,
  offset = 0,
): Promise<Session[]> => {
  try {
    const token = localStorage.getItem("docPocAuth_token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const toDate = new Date().toISOString().substring(0, 10);
    const fromDate = new Date(
      new Date().setFullYear(new Date().getFullYear() - 1),
    )
      .toISOString()
      .substring(0, 10);

    const response = await apiClient.get(`/ai-agent/sessions`, {
      params: { limit, offset, fromDate, toDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    if (data && Array.isArray(data.sessions)) {
      return data.sessions;
    }
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.rows)) {
      return data.rows;
    }
    return [];
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    throw error;
  }
};

export const getConversationMessages = async (
  sessionId: string,
  limit = 50,
  offset = 0,
): Promise<Message[]> => {
  try {
    const token = localStorage.getItem("docPocAuth_token");
    if (!token) {
      throw new Error("User not authenticated");
    }
    const response = await apiClient.get(`/ai-agent/conversations/sessionId`, {
      params: { sessionId, limit, offset },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const conversationTurns = Array.isArray(response.data) ? response.data : [];

    const messages: Message[] = conversationTurns
      .reverse()
      .flatMap((turn: any) => {
        const turnMessages: Message[] = [];
        if (turn.userMessage) {
          turnMessages.push({
            id: `${turn.id}-user`,
            text: turn.userMessage,
            sender: "user",
            timestamp: turn.created_at,
          });
        }
        if (turn.aiResponse) {
          turnMessages.push({
            id: `${turn.id}-doku`,
            text: turn.aiResponse,
            sender: "doku",
            timestamp: turn.created_at,
          });
        }
        return turnMessages;
      });

    return messages;
  } catch (error) {
    console.error(`Error fetching messages for session ${sessionId}:`, error);
    throw error;
  }
};

export const deleteSessions = async ({
  sessionIds,
}: {
  sessionIds: string[];
}): Promise<void> => {
  try {
    const token = localStorage.getItem("docPocAuth_token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    await apiClient.delete(`/ai-agent/delete-session`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { sessionIds },
    });
  } catch (error) {
    console.error("Error deleting sessions:", error);
    throw error;
  }
};
