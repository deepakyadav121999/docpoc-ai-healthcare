import { dokuGet, dokuPost, dokuDelete } from "./doku";
import { Message, Session } from "@/types/doku-chat";

export const sendMessage = async (
  message: string,
  sessionId: string,
): Promise<Message> => {
  const response = await dokuPost(`ai-agent/chat`, {
    message: message,
    queryType: "general",
    sessionId: sessionId,
    context: {},
  });

  const dokuResponse: Message = {
    id: new Date().toISOString(),
    text: response.response || "Sorry, I could not find a response.",
    sender: "doku",
    timestamp: new Date().toISOString(),
  };
  return dokuResponse;
};

export const getChatSessions = async (
  limit = 20,
  offset = 0,
): Promise<Session[]> => {
  const toDate = new Date().toISOString().substring(0, 10);
  const fromDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1),
  )
    .toISOString()
    .substring(0, 10);

  const data = await dokuGet(
    `ai-agent/sessions?limit=${limit}&offset=${offset}&fromDate=${fromDate}&toDate=${toDate}`,
  );

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
};

export const getConversationMessages = async (
  sessionId: string,
  limit = 50,
  offset = 0,
): Promise<Message[]> => {
  const response = await dokuGet(
    `ai-agent/conversations/sessionId?sessionId=${sessionId}&limit=${limit}&offset=${offset}`,
  );

  const conversationTurns = Array.isArray(response) ? response : [];

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
};

export const deleteSessions = async ({
  sessionIds,
}: {
  sessionIds: string[];
}): Promise<void> => {
  return dokuDelete(`ai-agent/delete-session`, { sessionIds });
};
