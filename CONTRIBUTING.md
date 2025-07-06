# 🤝 Contributing to Alkitu Template

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

### Prerequisites
- Node.js >=18.0.0
- npm >=8.0.0 
- Docker Desktop (recommended for development)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/alkitu-template.git
   cd alkitu-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development environment**
   ```bash
   # With Docker (recommended)
   npm run dev:docker
   
   # Or locally
   npm run dev
   ```

## 📝 Development Guidelines

### Code Standards
- **TypeScript**: Use strict typing throughout
- **ESLint**: Follow the configured linting rules
- **Prettier**: Code formatting is enforced
- **Testing**: Write tests for new features

### Commit Messages
Use conventional commits format:
```
type(scope): description

feat(api): add notification system
fix(web): resolve routing issue
docs(readme): update installation guide
```

### Branch Naming
```
feature/notification-system
bugfix/routing-issue
docs/readme-update
```

## 🧪 Testing

### Run Tests
```bash
# All tests
npm run test

# Specific packages
npm run test:api
npm run test:web
npm run test:shared

# With coverage
npm run test:cov
```

### Test Requirements
- Unit tests for all new features
- Integration tests for API endpoints
- E2E tests for critical user flows
- Minimum 80% code coverage

## 📦 Project Structure

```
alkitu-template/
├── packages/
│   ├── api/          # NestJS backend
│   ├── web/          # Next.js frontend  
│   └── shared/       # Shared utilities
├── docs/             # Documentation
├── scripts/          # Development scripts
└── tools/            # Build tools
```

## 🔄 Pull Request Process

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests
   - Update documentation

3. **Ensure quality**
   ```bash
   npm run lint          # Check linting
   npm run test          # Run tests  
   npm run build         # Verify builds
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   git push origin feature/your-feature
   ```

5. **Create Pull Request**
   - Use the PR template
   - Reference related issues
   - Add screenshots if UI changes

## 🐛 Bug Reports

When reporting bugs, please include:
- Environment details (OS, Node version, Docker version)
- Steps to reproduce
- Expected vs actual behavior
- Error logs
- Screenshots if applicable

## 💡 Feature Requests

For new features:
- Describe the use case
- Explain the benefit
- Provide implementation ideas
- Consider backward compatibility

## 🏗️ Architecture Guidelines

### Backend (NestJS)
- Use dependency injection
- Follow SOLID principles
- Implement proper error handling
- Use DTOs for validation
- Write comprehensive tests

### Frontend (Next.js)
- Use App Router
- Implement proper error boundaries
- Follow component composition patterns
- Use TypeScript strictly
- Optimize for performance

### Database
- Use Prisma for schema management
- Write migrations for schema changes
- Follow MongoDB best practices
- Implement proper indexing

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)

## ❓ Getting Help

If you need help:
1. Check existing issues
2. Read the documentation
3. Ask in discussions
4. Create an issue with details

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.