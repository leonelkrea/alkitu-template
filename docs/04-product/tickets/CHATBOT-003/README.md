# Ticket CHATBOT-003: Implement Chat Conversation Detail & Reply (Admin Dashboard)

## 📋 Ticket Information

- **ID**: CHATBOT-003
- **Title**: Implement Chat Conversation Detail & Reply (Admin Dashboard)
- **Type**: Feature
- **Priority**: HIGH
- **Status**: ✅ **COMPLETED**
- **Assigned Agent**: Frontend Agent
- **Created**: 2024-07-14T15:10:00Z
- **Estimated Duration**: 4 days

## 🎯 Objective

To implement the detailed view of a chat conversation in the admin dashboard, allowing agents to see the full message history and reply to visitors.

## 🚨 Problem Description

Agents cannot view the full history of a chat conversation or send replies to visitors from the admin dashboard.

### Required State:

A dedicated page for each conversation showing all messages and a form to send replies.

## 📁 Files to Update

### Primary Files (to be created/modified):

- `packages/web/src/app/dashboard/chat/[conversationId]/page.tsx`: Detail page for a single conversation.
- `packages/web/src/components/chat/ConversationDetail.tsx`: Component to display conversation messages.
- `packages/web/src/components/chat/ReplyForm.tsx`: Component for sending messages.
- `packages/web/src/components/chat/MessageBubble.tsx`: Component to render individual messages.

### Reference Files (Read for context):

- `docs/04-product/prd/14-public-chatbot-system-v2.md`: The updated PRD for the chatbot system.
- `packages/api/src/trpc/routers/chat.router.ts`: Backend tRPC procedures for `getMessages` and `replyToMessage`.

## ✅ Acceptance Criteria

### Functional Requirements:

- [ ] Navigating to a conversation from the list opens its detail page.
- [ ] The detail page displays all messages in chronological order.
- [ ] Agents can type and send messages to the visitor.
- [ ] New messages appear in real-time without page refresh.

### Technical Requirements:

- [ ] Uses `trpc.chat.getMessages` to fetch message history.
- [ ] Uses `trpc.chat.replyToMessage` to send agent replies.
- [ ] Integrates with WebSocket for real-time message updates.

## 🔗 Dependencies

### Requires:

- `CHATBOT-001`: Core backend chat services and public widget implemented.
- `CHATBOT-002`: Chat conversation list implemented.
