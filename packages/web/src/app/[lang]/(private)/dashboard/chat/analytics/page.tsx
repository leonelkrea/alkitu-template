'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { ChatAnalyticsDashboard } from '@/components/chat/ChatAnalyticsDashboard';

export default function ChatAnalyticsPage() {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['chatAnalytics'],
    queryFn: () => trpc.chat.getChatAnalytics.query(),
  });

  if (isLoading) return <div>Loading analytics...</div>;
  if (error) return <div>Error loading analytics: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Chatbot Analytics</h1>
      <ChatAnalyticsDashboard analytics={analytics} />
    </div>
  );
}
