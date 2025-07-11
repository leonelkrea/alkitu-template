# 🤖 AI Agent Protocols

Welcome to the command center for all AI agents contributing to the Alkitu Template. This section provides the essential protocols, roles, and workflows that govern agent-driven development.

**All agents must review this documentation before initiating any task.**

## 📜 Table of Contents

1.  **[Agent Roles & Responsibilities](#agent-roles--responsibilities)**
    - Detailed descriptions of each specialized AI agent, including their expertise and primary tasks.

2.  **[Enhanced Workflow System](#enhanced-workflow-system)**
    - The comprehensive workflow system with health checks, peer reviews, and impact analysis.

3.  **[Communication & Collaboration](#communication--collaboration)**
    - Inter-agent communication protocols, handoff procedures, and knowledge sharing.

4.  **[Quality Assurance & Testing](#quality-assurance--testing)**
    - Comprehensive testing strategy, quality gates, and continuous improvement processes.

5.  **[Documentation Standards](#documentation-standards)**
    - Guidelines for creating and maintaining clear, consistent, and useful documentation.

## 👥 Agent Roles & Responsibilities

This project is built by a team of specialized AI agents. Each agent has a specific role and set of responsibilities to ensure a clear separation of concerns and a high degree of quality.

- **[Architecture Agent](./01-architecture-agent.md)**: Designs the system architecture, defines data models, and ensures SOLID principles are upheld.
- **[Testing Agent](./02-testing-agent.md)**: Implements and enforces our rigorous testing strategy, including TDD, mutation testing, and quality gates.
- **[Backend Agent](./03-backend-agent.md)**: Develops the NestJS-based backend, including APIs, services, and database integration.
- **[Frontend Agent](./04-frontend-agent.md)**: Builds the Next.js frontend, creating a responsive and intuitive user interface.
- **[Documentation Agent](./05-documentation-agent.md)**: Manages and maintains all project documentation, ensuring it is clear, accurate, and up-to-date.

For a complete overview of best practices that apply to all agents, please see our **[Best Practices Guide](./BEST-PRACTICES.md)**.

## ⚙️ Enhanced Workflow System

All agents must follow our comprehensive workflow system that includes health checks, peer reviews, impact analysis, and knowledge sharing.

### **[Enhanced Workflow Guide](./ENHANCED-WORKFLOW.md)**
Complete workflow system with pre-work validation, execution protocols, and post-work quality gates.

### **[Health Check System](./HEALTH-CHECK-TEMPLATE.md)**
System health validation before and after work to ensure environment stability.

### **[Peer Review Process](./PEER-REVIEW-SYSTEM.md)**
Cross-agent validation system for code quality, architecture decisions, and best practices.

### **[Impact Analysis](./IMPACT-ANALYSIS.md)**
Comprehensive change impact assessment to prevent unintended consequences.

### **[Decision Tracking](./DECISION-TRACKING.md)**
Systematic recording of all technical and architectural decisions with rationale.

### **[Knowledge Base](./KNOWLEDGE-BASE.md)**
Centralized repository of lessons learned, best practices, and solutions.

## 🧪 Quality Assurance & Testing

Quality is paramount. All code must be developed following a strict Test-Driven Development (TDD) methodology. 

### **[Complete Testing Strategy](../05-testing/README.md)**
Comprehensive testing strategy including TDD, mutation testing, and quality gates.

### **[CI/CD Workflow Guide](./ci-cd-workflow.md)**
Detailed instructions on continuous integration, deployment, and automated quality validation.

### **Quality Standards**
- **Line Coverage**: ≥95%
- **Branch Coverage**: ≥90%
- **Function Coverage**: ≥100%
- **Mutation Score**: ≥85%

## 🤝 Communication & Collaboration

Effective communication between agents is essential for project success.

### **Ticket Structure**
All tickets must follow the enhanced structure:
```
docs/04-product/tickets/[TICKET-ID]/
├── README.md              # Main ticket specification
├── health-check.md        # System health validation
├── peer-review.md         # Cross-agent validation
├── impact-analysis.md     # Change impact assessment
├── decisions/             # Decision records
├── knowledge/             # Lessons learned
├── changes.md             # Change log
├── next-steps.md          # Handoff instructions
└── notes.md              # Working notes
```

### **Communication Protocol**
- **Daily Updates**: Share progress and blockers
- **Peer Reviews**: Mandatory for high-priority changes
- **Knowledge Sharing**: Document lessons learned
- **Decision Documentation**: Record all technical decisions

## 📚 Documentation Standards

Clear and consistent documentation is critical for the success of this project. All agents are responsible for documenting their work according to the standards outlined in the main **[README.md](../../README.md)**.

### **Documentation Requirements**
- **Ticket Documentation**: Complete ticket structure for all work
- **Decision Records**: All technical decisions must be documented
- **Code Documentation**: Comprehensive inline documentation
- **Knowledge Capture**: Lessons learned and best practices