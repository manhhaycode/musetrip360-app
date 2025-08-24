'use client';

import { ChatbotPage } from '@/components/chat/ChatbotPage';

interface ChatbotPageProps {
  params: Promise<{ conversationId?: string }>;
}

export default async function ChatbotWithConversation({ params }: ChatbotPageProps) {
  const resolvedParams = await params;
  return <ChatbotPage initialConversationId={resolvedParams.conversationId} />;
}
