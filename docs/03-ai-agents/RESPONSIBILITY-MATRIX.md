# 👥 Agent Responsibility Matrix

## 🎯 **Quick Responsibility Lookup**

| Task                       | Primary Agent | Secondary Agent  | Approval Required           |
| -------------------------- | ------------- | ---------------- | --------------------------- |
| **Architecture Design**    | Architecture  | -                | All agents for impact       |
| **SOLID Implementation**   | Architecture  | Backend          | Testing (validation)        |
| **Database Schema**        | Architecture  | Backend          | -                           |
| **API Development**        | Backend       | -                | Architecture (design)       |
| **Service Implementation** | Backend       | -                | Architecture (patterns)     |
| **Frontend Components**    | Frontend      | -                | Backend (API contracts)     |
| **UI/UX Design**           | Frontend      | -                | -                           |
| **Test Strategy**          | Testing       | -                | All agents (implementation) |
| **Test Implementation**    | Testing       | Backend/Frontend | -                           |
| **Code Quality**           | Testing       | All agents       | -                           |
| **Documentation**          | Documentation | All agents       | -                           |
| **PRD Creation**           | Documentation | Product          | Architecture (technical)    |
| **Ticket Management**      | Documentation | All agents       | -                           |

---

## 🤖 **Detailed Agent Responsibilities**

### **🏗️ Architecture Agent**

#### **Primary Responsibilities**

- ✅ **System Architecture Design**
  - Overall system structure and patterns
  - SOLID principles application
  - Interface design and contracts
  - Module boundaries and dependencies

- ✅ **Database Architecture**
  - Prisma schema design
  - MongoDB collection structure
  - Index strategy
  - Migration planning

- ✅ **API Architecture**
  - tRPC router structure
  - API versioning strategy
  - Error handling patterns
  - Security architecture

#### **Secondary/Collaborative**

- 🤝 **Code Reviews** (for architectural compliance)
- 🤝 **Performance Analysis** (architectural impact)
- 🤝 **Technical Decision Making** (final arbiter)

#### **NOT Responsible For**

- ❌ Detailed implementation code
- ❌ Frontend component implementation
- ❌ Test case writing (provides guidance only)
- ❌ Content writing for documentation

---

### **⚙️ Backend Agent**

#### **Primary Responsibilities**

- ✅ **Service Implementation**
  - NestJS service development
  - SOLID principle implementation
  - Dependency injection setup
  - Business logic implementation

- ✅ **API Development**
  - tRPC procedure implementation
  - REST endpoint development (if needed)
  - Request/response handling
  - Validation implementation

- ✅ **Database Integration**
  - Prisma client usage
  - Query optimization
  - Data access layer
  - Migration execution

#### **Secondary/Collaborative**

- 🤝 **Architecture Input** (implementation feasibility)
- 🤝 **Frontend API Contracts** (endpoint design)
- 🤝 **Performance Optimization** (backend performance)

#### **NOT Responsible For**

- ❌ Database schema design (follows Architecture)
- ❌ Frontend implementation
- ❌ Test strategy (implements according to Testing)
- ❌ Architecture decisions (follows Architecture)

---

### **🎨 Frontend Agent**

#### **Primary Responsibilities**

- ✅ **UI Component Development**
  - React component implementation
  - Next.js page development
  - shadcn/ui integration
  - Responsive design

- ✅ **State Management**
  - Client-side state management
  - Server state synchronization
  - Caching strategies
  - Form handling

- ✅ **User Experience**
  - Interactive behaviors
  - Loading states
  - Error handling UI
  - Accessibility implementation

#### **Secondary/Collaborative**

- 🤝 **API Integration** (consumes backend APIs)
- 🤝 **Performance Optimization** (frontend performance)
- 🤝 **User Testing** (UI/UX validation)

#### **NOT Responsible For**

- ❌ Backend API implementation
- ❌ Database operations
- ❌ Server-side business logic
- ❌ API design (follows contracts)

---

### **🧪 Testing Agent**

#### **Primary Responsibilities**

- ✅ **Test Strategy**
  - Overall testing approach
  - Coverage requirements
  - Quality gates definition
  - Testing methodology (TDD)

- ✅ **Test Implementation**
  - Unit test development
  - Integration test development
  - E2E test scenarios
  - Mutation testing setup

- ✅ **Quality Assurance**
  - Code quality validation
  - SOLID compliance testing
  - Performance testing
  - Security testing coordination

#### **Secondary/Collaborative**

- 🤝 **Code Reviews** (quality perspective)
- 🤝 **CI/CD Pipeline** (test automation)
- 🤝 **Bug Analysis** (root cause analysis)

#### **NOT Responsible For**

- ❌ Feature implementation
- ❌ Architecture design
- ❌ Business requirements
- ❌ Deployment (validates but doesn't deploy)

---

### **📝 Documentation Agent**

#### **Primary Responsibilities**

- ✅ **Documentation Management**
  - Documentation structure
  - Content quality and consistency
  - Template creation and maintenance
  - Cross-reference validation

- ✅ **Project Coordination**
  - Ticket management
  - Status tracking
  - Agent coordination
  - Workflow management

- ✅ **Knowledge Management**
  - Best practices documentation
  - Lessons learned capture
  - Decision record maintenance
  - Knowledge sharing facilitation

#### **Secondary/Collaborative**

- 🤝 **Technical Writing** (coordinates with technical agents)
- 🤝 **Process Improvement** (workflow optimization)
- 🤝 **Quality Systems** (documentation quality)

#### **NOT Responsible For**

- ❌ Technical implementation
- ❌ Architecture decisions
- ❌ Code development
- ❌ Business requirements (documents but doesn't define)

---

## 🔄 **Collaboration Patterns**

### **🤝 Common Collaborations**

#### **Architecture ↔ Backend**

- **When**: Implementation of architectural decisions
- **How**: Architecture provides interfaces, Backend implements
- **Output**: SOLID-compliant services

#### **Backend ↔ Frontend**

- **When**: API integration and data flow
- **How**: Backend provides APIs, Frontend consumes
- **Output**: Integrated full-stack features

#### **Testing ↔ All Agents**

- **When**: Quality validation and test implementation
- **How**: Testing defines strategy, agents implement tests
- **Output**: High-quality, well-tested code

#### **Documentation ↔ All Agents**

- **When**: Knowledge capture and process management
- **How**: Agents provide input, Documentation organizes
- **Output**: Complete, accurate documentation

### **🔀 Handoff Protocols**

#### **Architecture → Backend**

```
HANDOFF INCLUDES:
□ Interface definitions
□ SOLID compliance requirements
□ Database schema specifications
□ Integration patterns
□ Performance requirements
```

#### **Backend → Frontend**

```
HANDOFF INCLUDES:
□ API endpoint documentation
□ Data models and types
□ Authentication patterns
□ Error handling specifications
□ Performance characteristics
```

#### **Any Agent → Testing**

```
HANDOFF INCLUDES:
□ Feature specifications
□ Acceptance criteria
□ Performance requirements
□ Security considerations
□ Test data requirements
```

#### **All Agents → Documentation**

```
HANDOFF INCLUDES:
□ Implementation details
□ Decisions made
□ Lessons learned
□ Next steps
□ Known issues
```

---

## 🚨 **Conflict Resolution**

### **Decision Hierarchy**

1. **Architecture Agent** - Final say on architectural decisions
2. **Backend Agent** - Final say on backend implementation details
3. **Frontend Agent** - Final say on UI/UX decisions
4. **Testing Agent** - Final say on quality standards
5. **Documentation Agent** - Final say on documentation standards

### **Escalation Process**

```
LEVEL 1: Agent Discussion (30 minutes)
  ↓ (if unresolved)
LEVEL 2: Technical Lead Review (1 hour)
  ↓ (if unresolved)
LEVEL 3: Architecture Agent Decision (24 hours)
  ↓ (if architectural impact)
LEVEL 4: Team Consensus Building (48 hours)
```

### **Common Conflict Scenarios**

#### **Performance vs. Maintainability**

- **Arbiter**: Architecture Agent
- **Input Required**: Performance metrics, maintainability assessment
- **Decision Criteria**: Long-term system health

#### **Testing Coverage vs. Development Speed**

- **Arbiter**: Testing Agent
- **Input Required**: Risk assessment, business timeline
- **Decision Criteria**: Quality gates and risk tolerance

#### **UI Design vs. Technical Constraints**

- **Arbiter**: Frontend Agent (design), Architecture Agent (constraints)
- **Input Required**: User requirements, technical limitations
- **Decision Criteria**: User experience within technical boundaries

---

## 📊 **Accountability Matrix (RACI)**

| Task                     | Architecture | Backend | Frontend | Testing | Documentation |
| ------------------------ | ------------ | ------- | -------- | ------- | ------------- |
| **System Design**        | R            | I       | I        | C       | C             |
| **SOLID Implementation** | A            | R       | C        | C       | I             |
| **API Development**      | C            | R       | I        | C       | I             |
| **UI Development**       | I            | I       | R        | C       | I             |
| **Database Schema**      | R            | C       | I        | I       | I             |
| **Test Strategy**        | C            | C       | C        | R       | I             |
| **Code Quality**         | C            | C       | C        | R       | I             |
| **Documentation**        | C            | C       | C        | C       | R             |
| **Deployment**           | C            | R       | C        | A       | I             |
| **Monitoring**           | C            | R       | I        | A       | I             |

**Legend:**

- **R** = Responsible (does the work)
- **A** = Accountable (ensures it gets done)
- **C** = Consulted (provides input)
- **I** = Informed (kept in the loop)

---

## 🎯 **Success Metrics by Agent**

### **Architecture Agent**

- ✅ SOLID compliance: 100%
- ✅ Interface stability: No breaking changes
- ✅ Performance targets: Met or exceeded
- ✅ Scalability: System handles growth

### **Backend Agent**

- ✅ API response time: <200ms
- ✅ Test coverage: ≥95%
- ✅ Code quality: No critical issues
- ✅ Feature completion: On schedule

### **Frontend Agent**

- ✅ Load time: <3s initial load
- ✅ Accessibility: WCAG AA compliance
- ✅ Responsive: Works on all devices
- ✅ User satisfaction: Positive feedback

### **Testing Agent**

- ✅ Test coverage: ≥95%
- ✅ Mutation score: ≥85%
- ✅ Bug escape rate: <1%
- ✅ Pipeline stability: >98% success

### **Documentation Agent**

- ✅ Documentation coverage: 100%
- ✅ Link validity: 100% working links
- ✅ Template usage: Consistent formatting
- ✅ Knowledge capture: All decisions recorded

---

**Responsibility Matrix Version**: 1.0  
**Last Updated**: 2025-01-12  
**Next Review**: 2025-02-12
