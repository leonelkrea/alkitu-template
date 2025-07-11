# Next Steps - CRITICAL-001

## 🚀 Recommendations for Next Agent

_This file will be completed by the Architecture Agent upon task completion_

### Immediate Next Actions:

- [ ] **Backend Agent** should begin CORE-001 implementation
- [ ] Focus on SOLID architecture with updated schemas
- [ ] Implement module flag system
- [ ] Create core API endpoints

### Updated Files Ready for Implementation:

```markdown
## Ready for Backend Agent:

- [ ] `docs/prd/01-template-core.md` - Updated with Prisma schemas
- [ ] `docs/prd/03-user-management.md` - MongoDB-optimized user models
- [ ] All other PRDs aligned with technology stack

## Implementation Priority:

1. Core authentication module (uses User models)
2. User management module (depends on auth)
3. Module flag system (enables/disables features)
4. Basic API structure (tRPC + REST)
```

### Architecture Decisions Made:

```markdown
## Key Decisions:

- [ ] Data modeling approach: [embedding vs referencing]
- [ ] Index strategy: [specific indexes recommended]
- [ ] Migration path: [how to handle existing data]
- [ ] Performance optimizations: [specific recommendations]
```

### Potential Blockers for Next Agent:

```markdown
## Possible Issues:

- [ ] **Issue**: [Description]
      **Impact**: [How it affects implementation]
      **Mitigation**: [How to handle it]
```

### Schema Validation Results:

```markdown
## Validation Status:

- [ ] ✅ All Prisma schemas compile successfully
- [ ] ✅ MongoDB compatibility verified
- [ ] ✅ Existing data migration path defined
- [ ] ✅ Performance implications analyzed
```

### Recommended Agent Queue Update:

```markdown
## Next Execution Order:

1. **Backend Agent** (HIGH priority) - CORE-001
2. **Testing Agent** (MEDIUM priority) - TEST-002
3. **Frontend Agent** (MEDIUM priority) - WEB-001
4. **DevOps Agent** (LOW priority) - Infrastructure improvements
```

---

**Template for Completion:**

```markdown
## Task Completion Summary

**Completed**: [Date/Time]
**Duration**: [Actual time spent]
**Files Modified**: [Count and list]
**Validation**: [All checks passed]

**Critical Findings**:

- [Important discovery 1]
- [Important discovery 2]

**Recommendations**:

- [Recommendation for Backend Agent]
- [Recommendation for project overall]

**Next Agent**: Backend Agent
**Next Ticket**: CORE-001
**Estimated Next Duration**: 4-6 hours
```
