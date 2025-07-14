# 📊 Impact Analysis Template - [TICKET-ID]

## 📋 **Analysis Information**

- **Ticket ID**: [TICKET-ID]
- **Title**: [Descriptive title of the change]
- **Analyst**: [Agent Name]
- **Analysis Date**: [YYYY-MM-DDTHH:mm:ssZ]
- **Risk Level**: 🟢 **LOW** | 🟡 **MEDIUM** | 🔴 **HIGH** | ⚫ **CRITICAL**
- **Complexity**: [Simple | Moderate | Complex | Very Complex]
- **Impact Scope**: [Component | Module | System | Multi-System]

---

## 🎯 **Change Summary**

### **What's Changing**

- [Clear description of the proposed change]
- [Key components being modified]
- [New functionality being added]

### **Why It's Needed**

- [Business justification]
- [Technical necessity]
- [Problem being solved]

### **Expected Outcome**

- [What should be different after the change]
- [Success criteria]
- [Performance improvements expected]

---

## 🏗️ **Technical Impact Assessment**

### **📦 Backend Impact (NestJS + tRPC + Prisma)**

#### **Database Changes**

- **Impact Level**: [🟢 NONE | 🟡 SCHEMA | 🔴 DATA | ⚫ BREAKING]
- **Changes Required**:
  ```prisma
  // New/Modified Prisma schemas
  model Example {
    // Changes here
  }
  ```
- **Migration Complexity**: [Simple | Complex | Multi-step | Risky]
- **Data Migration**: [None | Additive | Transformative | Destructive]
- **Rollback Strategy**: [Automatic | Manual | Complex | Impossible]

#### **API Changes**

- **Impact Level**: [🟢 ADDITIVE | 🟡 MODIFICATION | 🔴 BREAKING | ⚫ REMOVAL]
- **tRPC Procedures**:
  ```typescript
  // New/Modified procedures
  export const exampleRouter = t.router({
    // Changes here
  });
  ```
- **Backward Compatibility**: [✅ Maintained | ⚠️ Deprecated | ❌ Breaking]
- **Version Strategy**: [None needed | Version bump | Major version | Migration path]

#### **Service Layer Changes**

- **Impact Level**: [🟢 ISOLATED | 🟡 CONNECTED | 🔴 WIDESPREAD | ⚫ FOUNDATIONAL]
- **SOLID Compliance**: [✅ Maintained | ⚠️ Refactoring needed | ❌ Violations introduced]
- **Dependencies**: [List of affected services/modules]
- **Performance Impact**: [Positive | Neutral | Negative | Unknown]

### **🎨 Frontend Impact (Next.js + React)**

#### **Component Changes**

- **Impact Level**: [🟢 ISOLATED | 🟡 CONNECTED | 🔴 WIDESPREAD | ⚫ ARCHITECTURAL]
- **New Components**: [List of components to create]
- **Modified Components**: [List of components to modify]
- **Removed Components**: [List of components to remove]
- **UI/UX Changes**: [Description of visual/interaction changes]

#### **State Management**

- **Impact Level**: [🟢 LOCAL | 🟡 COMPONENT | 🔴 GLOBAL | ⚫ ARCHITECTURAL]
- **Store Changes**: [What needs to change in global state]
- **Data Flow**: [How data flow will be affected]
- **Caching Impact**: [Effect on data caching strategies]

#### **Routing & Navigation**

- **Impact Level**: [🟢 NONE | 🟡 NEW ROUTES | 🔴 ROUTE CHANGES | ⚫ NAVIGATION OVERHAUL]
- **New Routes**: [List of routes to add]
- **Modified Routes**: [List of routes to change]
- **Navigation Changes**: [How navigation will be affected]

### **🔧 Infrastructure Impact**

#### **Docker & Services**

- **Impact Level**: [🟢 NONE | 🟡 CONFIG | 🔴 SERVICES | ⚫ ARCHITECTURE]
- **Container Changes**: [What containers need changes]
- **Environment Variables**: [New/modified environment variables]
- **Service Dependencies**: [Changes to service dependencies]

#### **Build & Deployment**

- **Impact Level**: [🟢 NONE | 🟡 MINOR | 🔴 MAJOR | ⚫ BREAKING]
- **Build Process**: [Changes to build pipeline]
- **Deployment Strategy**: [How deployment will be affected]
- **Testing Changes**: [Impact on CI/CD pipeline]

---

## 👥 **Stakeholder Impact**

### **🤖 Agent Dependencies**

- **Architecture Agent**: [How this affects architecture decisions]
- **Backend Agent**: [Backend development impact]
- **Frontend Agent**: [Frontend development impact]
- **Testing Agent**: [Testing strategy impact]
- **Documentation Agent**: [Documentation update requirements]

### **📋 Related Tickets**

- **Blocked By**: [List of tickets that must complete first]
- **Blocks**: [List of tickets that depend on this]
- **Related**: [List of tickets that are related but not dependent]
- **Conflicts**: [List of tickets that might conflict]

### **📦 External Dependencies**

- **Third-party Services**: [Impact on external services]
- **API Integrations**: [Effect on external API integrations]
- **Database Dependencies**: [Impact on external data sources]
- **User Impact**: [How users will be affected]

---

## 🔍 **Risk Assessment**

### **🔴 High-Risk Areas**

```markdown
❌ [Risk Category]: [Description]

- **Probability**: [High/Medium/Low]
- **Impact**: [Critical/High/Medium/Low]
- **Mitigation**: [How to reduce risk]
- **Contingency**: [What to do if it occurs]
```

### **🟡 Medium-Risk Areas**

```markdown
⚠️ [Risk Category]: [Description]

- **Probability**: [High/Medium/Low]
- **Impact**: [High/Medium/Low]
- **Monitoring**: [What to watch for]
- **Mitigation**: [How to reduce risk]
```

### **🟢 Low-Risk Areas**

```markdown
✅ [Area]: [Why this is low risk]

- **Confidence**: [High/Medium/Low]
- **Evidence**: [Why we're confident]
```

---

## 📊 **Performance Impact**

### **Expected Performance Changes**

- **API Response Time**: [Improvement/Degradation/No Change] - [Quantified impact]
- **Database Performance**: [Improvement/Degradation/No Change] - [Query impact]
- **Frontend Loading**: [Improvement/Degradation/No Change] - [Bundle/render impact]
- **Memory Usage**: [Improvement/Degradation/No Change] - [Memory impact]

### **Benchmarking Strategy**

- [ ] **Baseline Measurements**: [What to measure before changes]
- [ ] **Performance Tests**: [Specific tests to run]
- [ ] **Monitoring**: [What metrics to monitor post-deployment]
- [ ] **Rollback Criteria**: [Performance thresholds for rollback]

---

## 🧪 **Testing Impact**

### **Test Strategy Changes**

- **Unit Tests**: [New tests needed, existing tests affected]
- **Integration Tests**: [Integration scenarios to test]
- **E2E Tests**: [End-to-end scenarios affected]
- **Performance Tests**: [Load/stress testing needed]

### **Test Coverage Impact**

- **Coverage Target**: [Expected coverage after changes]
- **New Test Areas**: [What new areas need testing]
- **Test Complexity**: [How complex will testing be]
- **Test Duration**: [Impact on test suite runtime]

---

## 📅 **Timeline Analysis**

### **Implementation Phases**

1. **Phase 1**: [Description] - [Duration] - [Dependencies]
2. **Phase 2**: [Description] - [Duration] - [Dependencies]
3. **Phase 3**: [Description] - [Duration] - [Dependencies]

### **Critical Path**

- **Longest Path**: [Identify the critical path through the work]
- **Bottlenecks**: [Potential bottlenecks in implementation]
- **Parallel Work**: [What can be done in parallel]
- **Dependencies**: [External dependencies that could delay work]

### **Rollback Planning**

- **Rollback Complexity**: [How difficult would rollback be]
- **Rollback Time**: [How long rollback would take]
- **Rollback Strategy**: [Step-by-step rollback plan]
- **Point of No Return**: [When rollback becomes impossible/difficult]

---

## 🎯 **Success Criteria**

### **Technical Success Metrics**

- [ ] **Functionality**: [Core functionality works as expected]
- [ ] **Performance**: [Performance meets or exceeds expectations]
- [ ] **Quality**: [Code quality standards maintained]
- [ ] **Stability**: [System stability maintained or improved]

### **Business Success Metrics**

- [ ] **User Experience**: [User experience improved or maintained]
- [ ] **Business Goals**: [Business objectives met]
- [ ] **Compliance**: [Regulatory/security requirements met]
- [ ] **Scalability**: [Solution scales as needed]

### **Quality Gates**

- [ ] **Code Review**: [Code review approval]
- [ ] **Testing**: [All tests passing with required coverage]
- [ ] **Performance**: [Performance benchmarks met]
- [ ] **Security**: [Security review completed]
- [ ] **Documentation**: [Documentation updated]

---

## 📝 **Recommendations**

### **Implementation Approach**

- **Recommended Strategy**: [Best approach for implementation]
- **Alternative Approaches**: [Other viable approaches]
- **Rejected Approaches**: [Approaches considered but rejected, and why]

### **Risk Mitigation**

- **Primary Mitigations**: [Key steps to reduce risk]
- **Monitoring Strategy**: [What to monitor during/after implementation]
- **Escalation Plan**: [When and how to escalate issues]

### **Resource Requirements**

- **Agent Time**: [Estimated time per agent]
- **External Resources**: [Any external resources needed]
- **Coordination Needs**: [Coordination requirements between agents]

---

## ✅ **Analysis Summary**

### **Overall Assessment**

- **Recommendation**: [🟢 PROCEED | 🟡 PROCEED WITH CAUTION | 🔴 DO NOT PROCEED | ⚫ NEEDS MORE ANALYSIS]
- **Confidence Level**: [High/Medium/Low]
- **Key Success Factors**: [What will make this successful]
- **Major Risks**: [Top 3 risks to watch]

### **Decision Points**

- **Go/No-Go Criteria**: [Clear criteria for proceeding]
- **Review Points**: [When to reassess during implementation]
- **Success Metrics**: [How to measure success]
- **Failure Criteria**: [When to consider this failed]

---

## 📞 **Stakeholder Sign-off**

### **Required Approvals**

- [ ] **Architecture Agent**: [For architectural changes]
- [ ] **Backend Agent**: [For backend implementation]
- [ ] **Frontend Agent**: [For frontend implementation]
- [ ] **Testing Agent**: [For testing strategy]
- [ ] **Product Owner**: [For business impact]

### **Analysis Completion**

- **Analyst**: [Agent Name]
- **Analysis Completed**: [YYYY-MM-DDTHH:mm:ssZ]
- **Next Review**: [When to review this analysis again]
- **Approval Status**: [PENDING | APPROVED | REJECTED]

---

**Impact Analysis Version**: 1.0  
**Analysis Framework**: Based on SOLID principles and system architecture  
**Cross-Reference**: [Links to related analyses or decisions]
