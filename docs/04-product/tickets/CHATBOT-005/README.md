# Ticket CHATBOT-005: Implement Internal Notes for Conversations (Admin Dashboard)

## 📋 Ticket Information

- **ID**: CHATBOT-005
- **Title**: Implement Internal Notes for Conversations (Admin Dashboard)
- **Type**: Feature
- **Priority**: MEDIUM
- **Status**: ✅ **COMPLETED**
- **Assigned Agent**: Frontend Agent
- **Created**: 2024-07-14T15:30:00Z
- **Estimated Duration**: 1 day

## 🎯 Objective

To allow agents to add private internal notes to chat conversations, visible only to other team members and not to the visitor.

## 🚨 Problem Description

There is no mechanism for agents to add private context or follow-up information to chat conversations.

### Required State:

A section within the conversation detail view where agents can add and view internal notes.

## 📁 Files to Update

### Primary Files (to be created/modified):

- `packages/web/src/components/chat/InternalNotes.tsx`: Component for displaying and adding internal notes.
- `packages/web/src/app/dashboard/chat/[conversationId]/page.tsx`: Integrate the internal notes component.

### Reference Files (Read for context):

- `docs/04-product/prd/14-public-chatbot-system-v2.md`: The updated PRD for the chatbot system.
- `packages/api/src/trpc/routers/chat.router.ts`: Backend tRPC procedure for `addInternalNote`.

## ✅ Acceptance Criteria

### Functional Requirements:

- [ ] Agents can add new internal notes to a conversation.
- [ ] All internal notes are displayed in chronological order within the conversation detail view.
- [ ] Internal notes are clearly distinguishable from visitor/agent messages.
- [ ] Internal notes are not visible to the public-facing chat widget.

### Technical Requirements:

- [ ] Uses `trpc.chat.addInternalNote` to save notes.
- [ ] Notes are stored in the `internalNotes` field of the `Conversation` model.

## 🔗 Dependencies

### Requires:

- `CHATBOT-001`: Core backend chat services and public widget implemented.
- `CHATBOT-003`: Chat conversation detail view implemented.
