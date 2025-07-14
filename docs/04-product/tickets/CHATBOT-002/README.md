# Ticket CHATBOT-002: Implement Chat Conversation List (Admin Dashboard)

## 📋 Ticket Information

- **ID**: CHATBOT-002
- **Title**: Implement Chat Conversation List (Admin Dashboard)
- **Type**: Feature
- **Priority**: HIGH
- **Status**: ✅ **COMPLETED**
- **Assigned Agent**: Frontend Agent
- **Created**: 2024-07-14T15:00:00Z
- **Estimated Duration**: 3 days

## 🎯 Objective

To implement the conversation list view in the admin dashboard, allowing agents to see and filter active chat conversations.

## 🚨 Problem Description

There is currently no administrative interface to view and manage chat conversations initiated by website visitors.

### Required State:

A paginated and filterable list of chat conversations accessible from the admin dashboard.

## 📁 Files to Update

### Primary Files (to be created/modified):

- `packages/web/src/app/dashboard/chat/page.tsx`: Main page for the chat dashboard.
- `packages/web/src/components/chat/ConversationList.tsx`: Component to display the list of conversations.
- `packages/web/src/components/chat/ConversationFilters.tsx`: Component for filtering conversations.

### Reference Files (Read for context):

- `docs/04-product/prd/14-public-chatbot-system-v2.md`: The updated PRD for the chatbot system.
- `packages/api/src/trpc/routers/chat.router.ts`: Backend tRPC procedures for `getConversations`.

## ✅ Acceptance Criteria

### Functional Requirements:

- [ ] A new page `/dashboard/chat` is accessible to admin/employee users.
- [ ] The page displays a list of all chat conversations.
- [ ] The list is paginated.
- [ ] Users can filter conversations by status (Open, In Progress, Resolved, Closed).
- [ ] Users can search conversations by visitor email, name, or message content.

### Technical Requirements:

- [ ] Uses `trpc.chat.getConversations` to fetch data.
- [ ] Implements client-side pagination and filtering.
- [ ] Follows existing UI/UX patterns for tables and filters.

## 🔗 Dependencies

### Requires:

- `CHATBOT-001`: Core backend chat services and public widget implemented.
