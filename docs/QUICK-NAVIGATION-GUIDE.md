# 🧭 Quick Navigation Guide - Alkitu Template

## 🚀 **NEED SOMETHING FAST? START HERE**

### **🔥 Most Important Documents**

| Need               | Document                                                | Why                                        |
| ------------------ | ------------------------------------------------------- | ------------------------------------------ |
| **Project Status** | [PROJECT-DASHBOARD.md](04-product/PROJECT-DASHBOARD.md) | Current state, next actions, critical path |
| **My Role**        | [AI Agents README](03-ai-agents/README.md)              | Agent roles, responsibilities, workflows   |
| **Current Phase**  | [WORKFLOW-STATUS.md](04-product/WORKFLOW-STATUS.md)     | What phase we're in, what's next           |
| **System Health**  | [SYSTEM-HEALTH.md](03-ai-agents/SYSTEM-HEALTH.md)       | Technical health status                    |

---

## 🎯 **By Task Type**

### **🤖 I'm an AI Agent - What do I need?**

```
ALWAYS START HERE:
1. Check PROJECT-DASHBOARD.md for current priorities
2. Read your specific agent file (01-architecture-agent.md, etc.)
3. Review WORKFLOW-STATUS.md for current phase
4. Check SYSTEM-HEALTH.md for any blockers
```

**Quick Links by Agent:**

- **Architecture Agent** → [01-architecture-agent.md](03-ai-agents/01-architecture-agent.md)
- **Backend Agent** → [03-backend-agent.md](03-ai-agents/03-backend-agent.md)
- **Frontend Agent** → [04-frontend-agent.md](03-ai-agents/04-frontend-agent.md)
- **Testing Agent** → [02-testing-agent.md](03-ai-agents/02-testing-agent.md)
- **Documentation Agent** → [05-documentation-agent.md](03-ai-agents/05-documentation-agent.md)

### **📋 I need to create something - What template?**

| Creating            | Template                                                                          | Location                       |
| ------------------- | --------------------------------------------------------------------------------- | ------------------------------ |
| **New PRD**         | [PRD-TEMPLATE.md](03-ai-agents/templates/PRD-TEMPLATE.md)                         | `docs/04-product/prd/`         |
| **New Ticket**      | [TICKET-README-TEMPLATE.md](03-ai-agents/templates/TICKET-README-TEMPLATE.md)     | `docs/04-product/tickets/`     |
| **Health Check**    | [HEALTH-CHECK-TEMPLATE.md](03-ai-agents/templates/HEALTH-CHECK-TEMPLATE.md)       | In ticket folder               |
| **Peer Review**     | [PEER-REVIEW-TEMPLATE.md](03-ai-agents/templates/PEER-REVIEW-TEMPLATE.md)         | In ticket folder               |
| **Impact Analysis** | [IMPACT-ANALYSIS-TEMPLATE.md](03-ai-agents/templates/IMPACT-ANALYSIS-TEMPLATE.md) | In ticket folder               |
| **Decision Record** | [DECISION-RECORD-TEMPLATE.md](03-ai-agents/templates/DECISION-RECORD-TEMPLATE.md) | `docs/03-ai-agents/decisions/` |

### **🔍 I need to understand something - Where to look?**

| Understanding           | Primary Source                                            | Secondary Sources                                 |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| **System Architecture** | [01-architecture.md](01-architecture.md)                  | [solid-design.md](architecture/solid-design.md)   |
| **Tech Stack**          | [README.md](../README.md) + PRDs                          | [PRD examples](04-product/prd/)                   |
| **SOLID Principles**    | [SOLID tickets](04-product/tickets/)                      | [Best Practices](03-ai-agents/BEST-PRACTICES.md)  |
| **Testing Strategy**    | [Testing README](05-testing/README.md)                    | [Testing Agent](03-ai-agents/02-testing-agent.md) |
| **Development Process** | [ENHANCED-WORKFLOW.md](03-ai-agents/ENHANCED-WORKFLOW.md) | [Agent protocols](03-ai-agents/)                  |

### **🎫 I need to work on a ticket - What's the process?**

```
WORKFLOW CHECKLIST:
□ 1. Read ticket README.md
□ 2. Run HEALTH-CHECK-TEMPLATE.md (pre-work)
□ 3. Create IMPACT-ANALYSIS-TEMPLATE.md if complex
□ 4. Do the work following ENHANCED-WORKFLOW.md
□ 5. Update changes.md and notes.md
□ 6. Run HEALTH-CHECK-TEMPLATE.md (post-work)
□ 7. Get PEER-REVIEW-TEMPLATE.md if needed
□ 8. Complete next-steps.md for handoff
```

---

## 📊 **By Information Type**

### **📈 Status & Progress**

- **Current Sprint** → [PROJECT-DASHBOARD.md](04-product/PROJECT-DASHBOARD.md)
- **Phase Status** → [WORKFLOW-STATUS.md](04-product/WORKFLOW-STATUS.md)
- **System Health** → [SYSTEM-HEALTH.md](03-ai-agents/SYSTEM-HEALTH.md)
- **Decision History** → [DECISION-REGISTRY.md](03-ai-agents/DECISION-REGISTRY.md)

### **🏗️ Technical Information**

- **Architecture Overview** → [01-architecture.md](01-architecture.md)
- **SOLID Implementation** → [architecture/solid-design.md](architecture/solid-design.md)
- **Database Design** → PRDs with Prisma schemas
- **API Design** → PRDs with tRPC endpoints

### **📋 Product Information**

- **Feature List** → [00-master-prd-list.md](04-product/prd/00-master-prd-list.md)
- **Specific Features** → [prd/](04-product/prd/) folder
- **Business Requirements** → Individual PRDs
- **Implementation Status** → [PROJECT-DASHBOARD.md](04-product/PROJECT-DASHBOARD.md)

### **🔧 Development Information**

- **Development Setup** → [Main README](../README.md)
- **Scripts** → [scripts/README.md](../scripts/README.md)
- **Docker Setup** → [docker-compose.dev.yml](../docker-compose.dev.yml)
- **Environment** → PRDs and setup guides

---

## 🔍 **Search Strategies**

### **By File Type**

```bash
# Find all PRDs
find docs/04-product/prd -name "*.md"

# Find all tickets
find docs/04-product/tickets -name "README.md"

# Find templates
find docs/03-ai-agents/templates -name "*.md"

# Find agent documentation
find docs/03-ai-agents -name "*-agent.md"
```

### **By Keyword**

- **SOLID** → Look in tickets/, architecture/, 03-ai-agents/
- **Prisma** → Look in prd/, 01-architecture.md
- **tRPC** → Look in prd/, backend-related docs
- **Testing** → Look in 05-testing/, 02-testing-agent.md
- **Templates** → Look in 03-ai-agents/templates/

### **By Status**

- **Completed** → Check PROJECT-DASHBOARD.md for ✅
- **In Progress** → Check WORKFLOW-STATUS.md for current work
- **Blocked** → Check SYSTEM-HEALTH.md for issues
- **Next** → Check PROJECT-DASHBOARD.md for priorities

---

## 🚨 **Emergency Situations**

### **🔴 System is Broken**

1. **Check** → [SYSTEM-HEALTH.md](03-ai-agents/SYSTEM-HEALTH.md)
2. **Run** → Health check with [HEALTH-CHECK-TEMPLATE.md](03-ai-agents/templates/HEALTH-CHECK-TEMPLATE.md)
3. **Document** → Issues found
4. **Escalate** → Follow escalation procedures in [ENHANCED-WORKFLOW.md](03-ai-agents/ENHANCED-WORKFLOW.md)

### **🟡 I'm Blocked**

1. **Check Dependencies** → In ticket README.md
2. **Check System Status** → [SYSTEM-HEALTH.md](03-ai-agents/SYSTEM-HEALTH.md)
3. **Review Previous Work** → Check related tickets
4. **Escalate if Needed** → Contact other agents via next-steps.md

### **⚫ I Don't Know What to Do**

1. **Read** → [PROJECT-DASHBOARD.md](04-product/PROJECT-DASHBOARD.md)
2. **Check Your Role** → Your specific agent documentation
3. **Review Current Phase** → [WORKFLOW-STATUS.md](04-product/WORKFLOW-STATUS.md)
4. **Follow Workflow** → [ENHANCED-WORKFLOW.md](03-ai-agents/ENHANCED-WORKFLOW.md)

---

## 📚 **Learning Paths**

### **New to the Project**

1. [Main README](../README.md) - Project overview
2. [docs/README.md](README.md) - Documentation hub
3. [01-architecture.md](01-architecture.md) - Technical foundation
4. [PROJECT-DASHBOARD.md](04-product/PROJECT-DASHBOARD.md) - Current status
5. Your agent-specific documentation

### **Understanding SOLID Implementation**

1. [architecture/solid-design.md](architecture/solid-design.md) - Theory
2. [SOLID tickets](04-product/tickets/) - Implementation examples
3. [BEST-PRACTICES.md](03-ai-agents/BEST-PRACTICES.md) - Practical guidelines
4. PRDs with SOLID-compliant designs

### **Mastering the Workflow**

1. [ENHANCED-WORKFLOW.md](03-ai-agents/ENHANCED-WORKFLOW.md) - Complete workflow
2. [Templates README](03-ai-agents/templates/README.md) - All templates
3. Example tickets - See how others work
4. [BEST-PRACTICES.md](03-ai-agents/BEST-PRACTICES.md) - Do's and don'ts

---

## 🎯 **Frequently Needed Info**

### **Tech Stack Quick Reference**

- **Database**: MongoDB + Prisma ORM
- **Backend**: NestJS + tRPC + REST
- **Frontend**: Next.js 15 + React Server Components
- **Authentication**: JWT + role-based
- **Testing**: Jest + Mutation Testing
- **Architecture**: SOLID principles throughout

### **Common File Patterns**

```
docs/04-product/tickets/[TICKET-ID]/
├── README.md          # Main ticket spec
├── next-steps.md      # Handoff instructions
├── notes.md           # Working notes
├── changes.md         # Change log
├── health-check.md    # System validation
├── peer-review.md     # Code review
└── impact-analysis.md # Change impact

docs/04-product/prd/[XX-feature].md
docs/03-ai-agents/templates/[TEMPLATE].md
docs/03-ai-agents/decisions/[category]/DR-XXX.md
```

### **Key Metrics & Targets**

- **Test Coverage**: ≥95%
- **Mutation Score**: ≥85%
- **API Response**: <200ms
- **Build Time**: <3min
- **SOLID Compliance**: 100%

---

**Quick Navigation Guide Version**: 1.0  
**Last Updated**: 2025-01-12  
**Covers**: Complete documentation structure and workflows
