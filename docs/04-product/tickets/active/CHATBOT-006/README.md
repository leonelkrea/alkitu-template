# Ticket CHATBOT-006: Integrate Real-time Notifications for Chat

## 📋 Ticket Information

- **ID**: CHATBOT-006
- **Title**: Integrate Real-time Notifications for Chat
- **Type**: Feature
- **Priority**: MEDIUM
- **Status**: ✅ **COMPLETED**
- **Assigned Agent**: Frontend Agent
- **Created**: 2024-07-14T15:40:00Z
- **Estimated Duration**: 2 days

## 🎯 Objective

To integrate the chat system with the existing real-time notification system, ensuring agents are alerted to new messages and conversations.

## 🚨 Problem Description

Agents are not currently notified in real-time when new chat messages or conversations are initiated, leading to delayed responses.

### Required State:

Agents receive immediate in-app notifications and badge updates for new chat activity.

## 📁 Files to Update

### Primary Files (to be created/modified):

- `packages/api/src/notification/notification.service.ts`: Extend to handle chat-specific notifications.
- `packages/api/src/chat/chat.service.ts`: Trigger notifications for new chat events.
- `packages/web/src/components/layout/Header.tsx`: Ensure notification badge updates correctly.
- `packages/web/src/components/notifications/NotificationCenter.tsx`: Display chat notifications.

### Reference Files (Read for context):

- `docs/04-product/prd/14-public-chatbot-system-v2.md`: The updated PRD for the chatbot system.
- `packages/api/src/websocket/websocket.module.ts`: Existing WebSocket setup.

## ✅ Acceptance Criteria

### Functional Requirements:

- [ ] Agents receive in-app notifications for new chat conversations.
- [ ] Agents receive in-app notifications for new messages in existing conversations.
- [ ] The notification badge in the header updates in real-time.
- [ ] Chat notifications are distinguishable from other notification types.

### Technical Requirements:

- [ ] Utilizes the existing WebSocket infrastructure.
- [ ] Integrates with `NotificationService` for notification creation.

## 🔗 Dependencies

### Requires:

- `CHATBOT-001`: Core backend chat services and public widget implemented.
- `FRONTEND-003`: Notification system integrated (already completed).
