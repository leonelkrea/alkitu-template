# 🤖 AI Agent Protocols

Welcome to the command center for all AI agents contributing to the Alkitu Template. This section provides the essential protocols, roles, and workflows that govern agent-driven development.

**All agents must review this documentation before initiating any task.**

## 📜 Table of Contents

1.  **[Agent Roles & Responsibilities](#agent-roles--responsibilities)**
    - Detailed descriptions of each specialized AI agent, including their expertise and primary tasks.

2.  **[Enhanced Workflow System](#enhanced-workflow-system)**
    - The comprehensive workflow system with health checks, peer reviews, and impact analysis.

3.  **[Quality Systems](#quality-systems)**
    - Advanced quality systems for decision tracking, knowledge management, and system health.

4.  **[Directory Structure](#directory-structure)**
    - Complete overview of the documentation organization and folder structure.

5.  **[Communication & Collaboration](#communication--collaboration)**
    - Inter-agent communication protocols, handoff procedures, and knowledge sharing.

6.  **[Quality Assurance & Testing](#quality-assurance--testing)**
    - Comprehensive testing strategy, quality gates, and continuous improvement processes.

7.  **[Documentation Standards](#documentation-standards)**
    - Guidelines for creating and maintaining clear, consistent, and useful documentation.

## 👥 Agent Roles & Responsibilities

This project is built by a team of specialized AI agents. Each agent has a specific role and set of responsibilities to ensure a clear separation of concerns and a high degree of quality.

- **[Architecture Agent](./01-architecture-agent.md)**: Designs the system architecture, defines data models, and ensures SOLID principles are upheld.
- **[Testing Agent](./02-testing-agent.md)**: Implements and enforces our rigorous testing strategy, including TDD, mutation testing, and quality gates.
- **[Backend Agent](./03-backend-agent.md)**: Develops the NestJS-based backend, including APIs, services, and database integration.
- **[Frontend Agent](./04-frontend-agent.md)**: Builds the Next.js frontend, creating a responsive and intuitive user interface.
- **[Documentation Agent](./05-documentation-agent.md)**: Manages and maintains all project documentation, quality systems coordination, and knowledge management.

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

## 🏗️ Quality Systems

### 📊 **Dashboards & Registries**

- **[DECISION-REGISTRY.md](./DECISION-REGISTRY.md)** - Centralized decision tracking
- **[SYSTEM-HEALTH.md](./SYSTEM-HEALTH.md)** - Real-time system health dashboard

### 🔍 **Health Check System**

- **[health-checks/](./health-checks/)** - System health monitoring
  - Pre-work and post-work validation
  - System-wide health monitoring
  - Automated alerting and dashboard updates

### 👥 **Peer Review System**

- **[peer-reviews/](./peer-reviews/)** - Cross-agent validation
  - Automatic reviewer assignment
  - Review quality tracking
  - Conflict resolution protocols

### 📊 **Decision Tracking**

- **[decisions/](./decisions/)** - Decision management
  - **architecture/** - Architecture Decision Records (ADR)
  - **technical/** - Technical Decision Records (TDR)
  - **security/** - Security Decision Records (SDR)
  - **business-logic/** - Business Logic Decision Records (BDR)

### 🧠 **Knowledge Management**

- **[knowledge/](./knowledge/)** - Lessons learned repository
  - **architecture/** - Architecture patterns and lessons
  - **testing/** - Testing strategies and best practices
  - **performance/** - Performance optimizations
  - **security/** - Security patterns and solutions
  - **integration/** - Integration challenges and solutions
  - **problem-solutions/** - Common problems and fixes

### 📈 **Impact Analysis**

- **[impact-analysis/](./impact-analysis/)** - Change impact assessment
  - Direct and indirect impact analysis
  - Risk evaluation and mitigation
  - Stakeholder impact analysis

## 🗂️ Directory Structure

### 📁 **Templates**

- **[templates/](./templates/)** - PRD and ticket templates
  - **PRD-TEMPLATE.md** - Product Requirements Document template
  - **TICKET-README-TEMPLATE.md** - Main ticket specification
  - **TICKET-NEXT-STEPS-TEMPLATE.md** - Agent handoff instructions
  - **TICKET-NOTES-TEMPLATE.md** - Working notes with SOLID tracking
  - **TICKET-CHANGES-TEMPLATE.md** - Detailed change logging

### 📁 **Agent Documentation**

- **01-architecture-agent.md** - Architecture and design agent
- **02-testing-agent.md** - Testing strategy and implementation
- **03-backend-agent.md** - Backend development and APIs
- **04-frontend-agent.md** - Frontend development and UI
- **05-documentation-agent.md** - Documentation and quality systems

### 📁 **Workflow Documentation**

- **ci-cd-workflow.md** - CI/CD pipeline and TDD workflow
- **BEST-PRACTICES.md** - Development best practices and standards
- **ENHANCED-WORKFLOW.md** - Enhanced agent coordination workflows

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
- **SOLID Compliance**: ≥95%

## 🤝 Communication & Collaboration

Effective communication between agents is essential for project success.

### **Enhanced Ticket Structure**

All tickets must follow the enhanced structure:

```
docs/04-product/tickets/[TICKET-ID]/
├── README.md              # Main ticket specification
├── health-check.md        # System health validation
├── peer-review.md         # Cross-agent validation
├── impact-analysis.md     # Change impact assessment
├── decisions/             # Decision records
│   ├── DR-001.md         # Architecture decisions
│   ├── DR-002.md         # Technical decisions
│   └── registry.md       # Decision index
├── knowledge/             # Lessons learned
│   ├── lessons-learned.md
│   └── best-practices.md
├── changes.md             # Change log
├── next-steps.md          # Handoff instructions
└── notes.md              # Working notes
```

### **Communication Protocol**

- **Health Checks**: Pre-work and post-work validation
- **Peer Reviews**: Mandatory for high-priority changes
- **Knowledge Sharing**: Document lessons learned consistently
- **Decision Documentation**: Record all technical decisions with rationale
- **Impact Analysis**: Assess change impact for critical modifications

### **🎫 Ticket Assignment Rules**

- **SOLID-\***, **ARCH-\*** → Architecture Agent
- **REFACTOR-\***, **API-\*** → Backend Agent
- **UI-\***, **COMPONENT-\*** → Frontend Agent
- **TEST-\***, **QA-\*** → Testing Agent
- **DOC-\***, **PRD-\*** → Documentation Agent

## 📚 Documentation Standards

Clear and consistent documentation is critical for the success of this project. All agents are responsible for documenting their work according to the standards outlined in the main **[README.md](../../README.md)**.

### **Documentation Requirements**

- **Ticket Documentation**: Complete enhanced ticket structure for all work
- **Decision Records**: All technical decisions must be documented and tracked
- **Code Documentation**: Comprehensive inline documentation following SOLID principles
- **Knowledge Capture**: Lessons learned and best practices systematically captured
- **Health Checks**: Pre-work and post-work validation documented
- **Peer Reviews**: Critical changes must undergo peer review
- **Impact Analysis**: Major changes require impact analysis

### **📊 Success Metrics**

#### **Technical Excellence**

- **SOLID Compliance**: 95%+ across all modules
- **Test Coverage**: 95%+ for critical paths
- **Mutation Score**: 85%+ test quality
- **Quality Gates**: 100% pass rate

#### **Coordination Excellence**

- **Health Check Compliance**: 100% pre/post work validation
- **Peer Review Completion**: 95% within 24h for critical changes
- **Decision Documentation**: 100% of technical decisions tracked
- **Knowledge Capture**: 3-5 lessons learned per week

#### **System Health**

- **Agent Coordination**: Zero blocking conflicts
- **System Stability**: 99%+ uptime
- **Knowledge Utilization**: Regular knowledge base usage
- **Process Improvement**: Continuous optimization

---

**Commercial Quality Focus**: This is a commercial-grade SaaS template project. Every decision should prioritize the end developer who will use this template to build their SaaS product. Quality, maintainability, and developer experience are non-negotiable.
