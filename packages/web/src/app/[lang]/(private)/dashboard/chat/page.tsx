'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { ConversationList } from '@/components/chat/ConversationList';
import { ConversationFilters } from '@/components/chat/ConversationFilters';
import { Typography } from '@/components/adapters/Typography';
import { useState } from 'react';

export default function ChatDashboardPage() {
  const [filters, setFilters] = useState({});

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['conversations', filters],
    queryFn: () => trpc.chat.getConversations.query(filters),
  });

  if (isLoading) return <div>Loading conversations...</div>;
  if (error) return <div>Error loading conversations: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <Typography variant="h1" className="text-3xl font-bold mb-6" migrated={true}>
        Chat Conversations
      </Typography>
      <ConversationFilters onApplyFilters={setFilters} />
      <ConversationList conversations={conversations || []} />
    </div>
  );
}
