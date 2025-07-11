# Agent Health Check Template

## 🏥 System Health Validation

### Pre-Work Health Check
```markdown
## 🔍 Pre-Work Health Check
- [ ] All dependencies available and accessible
- [ ] Required tools/frameworks installed
- [ ] Test environment functional
- [ ] Database connections working
- [ ] Previous agent work validated
- [ ] No conflicting changes detected

**Status**: ✅ HEALTHY | ⚠️ DEGRADED | ❌ FAILED
**Timestamp**: [Auto-generated]
**Agent**: [Agent Name]
```

### Post-Work Health Check
```markdown
## 🏁 Post-Work Health Check
- [ ] All tests passing
- [ ] Code builds successfully
- [ ] No breaking changes introduced
- [ ] Documentation updated
- [ ] Migration scripts functional
- [ ] Performance benchmarks met

**Status**: ✅ HEALTHY | ⚠️ DEGRADED | ❌ FAILED
**Handoff Ready**: YES | NO
**Next Agent**: [Agent Name]
```

### System-Wide Health Dashboard
Create: `docs/03-ai-agents/SYSTEM-HEALTH.md`
- Real-time status of all agents
- Last health check timestamps
- Known issues and blockers
- System performance metrics

## Usage Instructions
1. Copy template to ticket directory as `health-check.md`
2. Update before starting work
3. Update after completing work
4. Link to central health dashboard