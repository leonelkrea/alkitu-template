# Agent Notes - CRITICAL-001

## 🧠 Architecture Agent Notes

_This file is for documenting decisions, observations, and important findings during the PRD alignment task_

### Key Decisions to Document:

- [ ] Data modeling choices (embedding vs referencing)
- [ ] Index strategy decisions
- [ ] Breaking changes and migration needs
- [ ] Performance considerations
- [ ] MongoDB-specific optimizations

### Current Stack Analysis:

```prisma
// Current schema pattern from packages/api/prisma/schema.prisma
// (Agent should analyze and document existing patterns here)
```

### Challenges Encountered:

```markdown
## Challenge: [Description]

**Impact:** [How it affects the project]
**Solution:** [How it was resolved]
**Rationale:** [Why this solution was chosen]
```

### MongoDB Best Practices Applied:

- [ ] Document embedding for 1:few relationships
- [ ] References for many:many relationships
- [ ] Appropriate indexing strategy
- [ ] Query optimization considerations

### Performance Considerations:

- [ ] Read patterns analyzed
- [ ] Write patterns considered
- [ ] Index strategy optimized
- [ ] Document size limitations considered

---

**Agent Instructions:**

- Use this file as your working notebook
- Document all important decisions
- Explain rationale for data modeling choices
- Note any potential issues for future agents
