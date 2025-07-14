# 🔍 Health Check Template - [TICKET-ID]

## 📋 **System Health Validation**

- **Ticket ID**: [TICKET-ID]
- **Agent**: [Agent Name]
- **Check Type**: 🔄 **PRE-WORK** | ✅ **POST-WORK**
- **Timestamp**: [YYYY-MM-DDTHH:mm:ssZ]
- **Status**: 🟢 **HEALTHY** | 🟡 **DEGRADED** | 🔴 **FAILED**

---

## 🖥️ **System Environment Health**

### **Development Environment**

- [ ] **Docker Services**: All containers running properly
- [ ] **Database Connection**: MongoDB accessible and responsive
- [ ] **API Services**: Backend API responding (NestJS)
- [ ] **Frontend Build**: Next.js building without errors
- [ ] **Dependencies**: All npm packages installed correctly

### **Testing Environment**

- [ ] **Test Suite**: All existing tests passing
- [ ] **Coverage**: Test coverage ≥95%
- [ ] **Linting**: ESLint passing without errors
- [ ] **TypeScript**: No compilation errors
- [ ] **Prisma**: Database schema in sync

### **Performance Baseline**

- [ ] **API Response Time**: <200ms for standard endpoints
- [ ] **Frontend Load Time**: <3s initial load
- [ ] **Memory Usage**: Within normal parameters
- [ ] **Database Queries**: No slow queries detected

---

## 🧪 **SOLID Architecture Health**

### **Single Responsibility Principle (SRP)**

- [ ] **Service Separation**: Each service has single responsibility
- [ ] **Class Focus**: Each class has clear, single purpose
- [ ] **Method Cohesion**: Methods within classes are cohesive

### **Open/Closed Principle (OCP)**

- [ ] **Extension Points**: System allows extension without modification
- [ ] **Interface Stability**: Core interfaces remain stable
- [ ] **Plugin Architecture**: New features can be added as plugins

### **Liskov Substitution Principle (LSP)**

- [ ] **Interface Contracts**: All implementations honor interface contracts
- [ ] **Behavioral Consistency**: Substitutable implementations behave correctly
- [ ] **No Strengthened Preconditions**: Implementations don't strengthen preconditions

### **Interface Segregation Principle (ISP)**

- [ ] **Focused Interfaces**: Interfaces are small and focused
- [ ] **No Fat Interfaces**: No unused methods in implementations
- [ ] **Client-Specific**: Interfaces tailored to client needs

### **Dependency Inversion Principle (DIP)**

- [ ] **Dependency Injection**: High-level modules don't depend on low-level
- [ ] **Abstract Dependencies**: Dependencies on abstractions, not concretions
- [ ] **IoC Container**: Dependency injection container working properly

---

## 📊 **Quality Metrics**

### **Code Quality**

- [ ] **Cyclomatic Complexity**: ≤10 per method
- [ ] **Code Duplication**: ≤5% duplication ratio
- [ ] **Technical Debt**: No critical debt issues
- [ ] **Security Vulnerabilities**: No high/critical vulnerabilities

### **Testing Metrics**

- [ ] **Unit Test Coverage**: ≥95%
- [ ] **Integration Test Coverage**: ≥85%
- [ ] **Mutation Score**: ≥85%
- [ ] **Test Performance**: Tests complete in <30s

### **Documentation Health**

- [ ] **API Documentation**: tRPC procedures documented
- [ ] **Code Comments**: Complex logic properly commented
- [ ] **README Updates**: All READMEs current and accurate
- [ ] **Change Documentation**: Changes properly documented

---

## 🔧 **Infrastructure Health**

### **Database (MongoDB + Prisma)**

- [ ] **Connection Pool**: Healthy connection pool
- [ ] **Query Performance**: No slow queries
- [ ] **Index Usage**: Indexes being used effectively
- [ ] **Schema Integrity**: Prisma schema matches database

### **API Layer (NestJS + tRPC)**

- [ ] **Endpoint Health**: All endpoints responding
- [ ] **Error Handling**: Proper error responses
- [ ] **Validation**: Input validation working
- [ ] **Authentication**: JWT authentication functional

### **Frontend (Next.js)**

- [ ] **Build Process**: Successful builds
- [ ] **Routing**: All routes accessible
- [ ] **State Management**: Store working correctly
- [ ] **Component Health**: No broken components

---

## 🚨 **Issue Detection**

### **Critical Issues Found**

```markdown
❌ [Issue Category]: [Description]

- **Impact**: [High/Medium/Low]
- **Component**: [Affected component]
- **Action Required**: [Immediate action needed]
- **Timeline**: [Resolution deadline]
```

### **Warnings Detected**

```markdown
⚠️ [Warning Category]: [Description]

- **Risk Level**: [High/Medium/Low]
- **Monitoring**: [What to watch]
- **Mitigation**: [Preventive measures]
```

### **Improvements Suggested**

```markdown
💡 [Improvement Area]: [Description]

- **Benefit**: [Expected improvement]
- **Effort**: [Implementation effort]
- **Priority**: [Implementation priority]
```

---

## ✅ **Health Check Summary**

### **Overall System Status**

- **Status**: [🟢 HEALTHY | 🟡 DEGRADED | 🔴 FAILED]
- **Confidence Level**: [High/Medium/Low]
- **Last Known Good State**: [Timestamp]
- **Recovery Time**: [If degraded/failed]

### **Go/No-Go Decision**

- **Proceed with Work**: [YES/NO]
- **Rationale**: [Reasoning for decision]
- **Preconditions**: [What must be resolved first]
- **Monitoring**: [What to watch during work]

### **Action Items**

- [ ] **Immediate**: [Actions needed before proceeding]
- [ ] **During Work**: [Monitoring during execution]
- [ ] **Post-Work**: [Validation after completion]

---

## 📝 **Notes**

### **Environment Specifics**

- [Any environment-specific considerations]
- [Known issues being tracked]
- [Temporary workarounds in place]

### **Historical Context**

- [Previous health check results]
- [Trends observed]
- [Recurring issues]

---

**Health Check Completed by**: [Agent Name]  
**Review Required**: [YES/NO - if complex issues found]  
**Next Health Check**: [When next check should occur]
