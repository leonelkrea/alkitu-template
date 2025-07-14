# Ticket CHATBOT-004: Implement Conversation Assignment & Status Management (Admin Dashboard)

## 📋 Ticket Information

- **ID**: CHATBOT-004
- **Title**: Implement Conversation Assignment & Status Management (Admin Dashboard)
- **Type**: Feature
- **Priority**: HIGH
- **Status**: ✅ **COMPLETED**
- **Assigned Agent**: Frontend Agent
- **Created**: 2024-07-14T15:20:00Z
- **Estimated Duration**: 2 days

## 🎯 Objective

To enable agents to assign conversations to themselves or other team members and to update the status of conversations within the admin dashboard.

## 🚨 Problem Description

Agents currently cannot manage the workflow of chat conversations by assigning them or changing their status.

### Required State:

Functionality to assign conversations to agents and update their status (e.g., Open, In Progress, Resolved, Closed).

## 📁 Files to Update

### Primary Files (to be created/modified):

- `packages/web/src/components/chat/AssignmentSelect.tsx`: Component for assigning conversations.
- `packages/web/src/components/chat/StatusSelect.tsx`: Component for changing conversation status.
- `packages/web/src/app/dashboard/chat/[conversationId]/page.tsx`: Integrate assignment and status controls.

### Reference Files (Read for context):

- `docs/04-product/prd/14-public-chatbot-system-v2.md`: The updated PRD for the chatbot system.
- `packages/api/src/trpc/routers/chat.router.ts`: Backend tRPC procedures for `assignConversation` and `updateStatus`.

## ✅ Acceptance Criteria

### Functional Requirements:

- [ ] Agents can select an agent from a dropdown to assign a conversation.
- [ ] Agents can change the status of a conversation using a dropdown.
- [ ] Changes to assignment and status are reflected immediately in the conversation list and detail view.

### Technical Requirements:

- [ ] Uses `trpc.chat.assignConversation` and `trpc.chat.updateStatus`.
- [ ] Integrates with existing user data for agent assignment.

## 🔗 Dependencies

### Requires:

- `CHATBOT-001`: Core backend chat services and public widget implemented.
- `CHATBOT-002`: Chat conversation list implemented.
- `CHATBOT-003`: Chat conversation detail view implemented.
