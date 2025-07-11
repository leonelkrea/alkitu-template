# Impact Analysis System

## 🎯 Change Impact Assessment

### 📋 Impact Analysis Template
```markdown
## 📊 Impact Analysis: [TICKET-ID]
**Date**: [Date]
**Analyst**: [Agent Name]
**Change Type**: Feature | Bug Fix | Refactor | Infrastructure | Documentation

### 🔍 Change Summary
[Brief description of what's changing]

### 📈 Impact Assessment Matrix

#### 🎯 Direct Impact (Immediate)
| Component | Impact Level | Description | Mitigation |
|-----------|-------------|-------------|-------------|
| Database | HIGH/MED/LOW | [Description] | [Actions] |
| API | HIGH/MED/LOW | [Description] | [Actions] |
| Frontend | HIGH/MED/LOW | [Description] | [Actions] |
| Tests | HIGH/MED/LOW | [Description] | [Actions] |

#### 🔄 Indirect Impact (Ripple Effects)
| Component | Impact Level | Description | Timeline |
|-----------|-------------|-------------|----------|
| User Experience | HIGH/MED/LOW | [Description] | [When] |
| Performance | HIGH/MED/LOW | [Description] | [When] |
| Security | HIGH/MED/LOW | [Description] | [When] |
| Scalability | HIGH/MED/LOW | [Description] | [When] |

### 🎫 Affected Tickets
#### 🚫 Blocked Tickets
- **[TICKET-ID]**: [Reason blocked]
- **[TICKET-ID]**: [Reason blocked]

#### ⚠️ Impacted Tickets
- **[TICKET-ID]**: [How impacted]
- **[TICKET-ID]**: [How impacted]

#### 🔄 Dependent Tickets
- **[TICKET-ID]**: [Dependency relationship]
- **[TICKET-ID]**: [Dependency relationship]

### 👥 Stakeholder Impact
#### 🤖 Agent Impact
- **Architecture Agent**: [Impact description]
- **Backend Agent**: [Impact description]
- **Frontend Agent**: [Impact description]
- **Testing Agent**: [Impact description]
- **Documentation Agent**: [Impact description]

#### 👨‍💼 Business Impact
- **Users**: [Impact on user experience]
- **Operations**: [Impact on system operations]
- **Development**: [Impact on development process]

### 📊 Risk Assessment
#### 🔴 High Risk Areas
- [Risk description] - **Mitigation**: [Action]

#### 🟡 Medium Risk Areas
- [Risk description] - **Mitigation**: [Action]

#### 🟢 Low Risk Areas
- [Risk description] - **Mitigation**: [Action]

### 🛠️ Mitigation Strategy
#### 📋 Pre-Implementation
- [ ] [Action item]
- [ ] [Action item]

#### 🔄 During Implementation
- [ ] [Action item]
- [ ] [Action item]

#### ✅ Post-Implementation
- [ ] [Action item]
- [ ] [Action item]

### 📅 Implementation Timeline
| Phase | Duration | Dependencies | Risks |
|-------|----------|-------------|--------|
| Phase 1 | [Time] | [Dependencies] | [Risks] |
| Phase 2 | [Time] | [Dependencies] | [Risks] |
| Phase 3 | [Time] | [Dependencies] | [Risks] |

### 🔄 Rollback Plan
#### 🚨 Rollback Triggers
- [Condition that would trigger rollback]
- [Condition that would trigger rollback]

#### 📋 Rollback Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

#### ⏱️ Rollback Timeline
**Estimated Time**: [Duration]
**Data Loss Risk**: HIGH | MEDIUM | LOW
**Service Downtime**: [Duration]

### 📊 Success Metrics
#### 📈 Quantitative Metrics
- Performance: [Metric] should be [Target]
- Reliability: [Metric] should be [Target]
- Usage: [Metric] should be [Target]

#### 🎯 Qualitative Metrics
- User satisfaction: [Criteria]
- Developer experience: [Criteria]
- System stability: [Criteria]

### 🔍 Monitoring Plan
#### 📊 Metrics to Track
- [Metric 1]: [Normal range]
- [Metric 2]: [Normal range]
- [Metric 3]: [Normal range]

#### 🚨 Alert Thresholds
- **Critical**: [Threshold] - [Action]
- **Warning**: [Threshold] - [Action]
- **Info**: [Threshold] - [Action]
```

### 🎯 Impact Analysis Dashboard
Create: `docs/03-ai-agents/IMPACT-DASHBOARD.md`

```markdown
## 📊 System Impact Dashboard
### 🔥 Current High-Impact Changes
| Ticket | Agent | Impact Level | Status | Risk Level |
|--------|-------|-------------|--------|------------|
| CRITICAL-001 | Architecture | HIGH | In Progress | MEDIUM |
| MIGRATION-001 | Backend | HIGH | Planned | HIGH |

### 📈 Impact Trends
- High-impact changes this month: [Number]
- Average impact assessment time: [Duration]
- Most impacted system: [Component]

### 🎯 Impact Categories
- **Database Changes**: [Count] tickets
- **API Changes**: [Count] tickets
- **Frontend Changes**: [Count] tickets
- **Infrastructure**: [Count] tickets
```

## Implementation Strategy
1. **Mandatory** for HIGH priority tickets
2. **Recommended** for MEDIUM priority tickets
3. **Optional** for LOW priority tickets
4. Integration with existing ticket workflow
5. Regular impact review sessions between agents