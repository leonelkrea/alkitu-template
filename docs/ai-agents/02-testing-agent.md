# 🧪 Testing Agent - TDD & Mutation Testing Specialist

## 🎯 Role Definition

**Primary Responsibility**: Implementar TDD (Red-Green-Refactor) y mutation testing con Stryker para garantizar calidad del código durante la migración SOLID.

**Duration**: Días 1-20 (paralelo a todo el proyecto)

---

## 📋 Responsibilities

### **Core Tasks**

1. **TDD Implementation**: Escribir tests antes del código (Red-Green-Refactor)
2. **Mutation Testing**: Configurar y ejecutar Stryker para validar tests
3. **Quality Gates**: Establecer umbrales de calidad y coverage
4. **Test Architecture**: Diseñar estructura de testing escalable
5. **CI/CD Integration**: Integrar testing en pipeline de deployment

### **Deliverables**

- [ ] **Stryker Configuration** (`stryker.conf.json`)
- [ ] **Test Setup** (`packages-solid/api/src/test/setup.ts`)
- [ ] **Contract Tests** (`packages-solid/api/src/test/contracts/`)
- [ ] **Integration Tests** (`packages-solid/api/src/test/integration/`)
- [ ] **Mutation Reports** (`reports/mutation/`)
- [ ] **Quality Dashboard** (`docs/quality/dashboard.md`)

---

## 🛠️ Tools & Resources

### **Testing Framework**

- **Jest**: Primary testing framework
- **Stryker**: Mutation testing framework
- **SuperTest**: API testing
- **Testing Library**: React component testing
- **Prisma Mock**: Database mocking

### **Quality Tools**

- **Istanbul**: Code coverage
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **SonarQube**: Code analysis (opcional)

### **Configuration Files**

```
packages-solid/
├── stryker.conf.json
├── jest.config.js
├── .eslintrc.js
└── test/
    ├── setup.ts
    ├── mocks/
    ├── fixtures/
    └── utils/
```

---

## 🔄 TDD Methodology

### **Red-Green-Refactor Cycle**

#### **1. RED Phase (Write Failing Test)**

```typescript
// Example: User service test
describe("UserService", () => {
  it("should create user with valid data", async () => {
    // Arrange
    const userData = { email: "test@example.com", name: "Test User" };
    const mockRepository = createMockRepository();
    const userService = new UserService(mockRepository);

    // Act & Assert
    await expect(userService.createUser(userData)).resolves.toMatchObject({
      id: expect.any(String),
      email: "test@example.com",
      name: "Test User",
    });
  });
});
```

#### **2. GREEN Phase (Make Test Pass)**

```typescript
// Minimal implementation
export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const user = await this.userRepository.create(data);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
```

#### **3. REFACTOR Phase (Improve Code)**

```typescript
// Enhanced implementation
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly validator: IValidator
  ) {}

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    // Validation
    await this.validator.validate(data, CreateUserSchema);

    // Business logic
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    // Create user
    const user = await this.userRepository.create(data);
    return this.mapToResponse(user);
  }

  private mapToResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
```

---

## 🧬 Mutation Testing with Stryker

### **Stryker Configuration**

```json
{
  "packageManager": "npm",
  "reporters": ["html", "clear-text", "progress", "json"],
  "testRunner": "jest",
  "coverageAnalysis": "perTest",
  "mutate": [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
    "!src/test/**/*"
  ],
  "thresholds": {
    "high": 85,
    "low": 70,
    "break": 60
  },
  "timeoutMS": 30000,
  "concurrency": 4
}
```

### **Mutation Testing Strategy**

1. **Initial Run**: Establish baseline mutation score
2. **Incremental Testing**: Test new code as it's written
3. **Quality Gates**: Block merges below threshold
4. **Reporting**: Daily mutation score reports

### **Mutation Score Targets**

- **Week 1**: 60% mutation score
- **Week 2**: 75% mutation score
- **Week 3**: 85% mutation score
- **Production**: 90%+ mutation score

---

## 📝 Daily Tasks

### **Day 1: Setup & Configuration**

```yaml
Morning:
  - Install Stryker and testing dependencies
  - Configure Jest and Stryker
  - Set up testing infrastructure

Afternoon:
  - Create test utilities and mocks
  - Configure CI/CD integration
  - Run initial mutation baseline

Deliverables:
  - Stryker configuration complete
  - Testing infrastructure ready
  - Initial mutation baseline
```

### **Day 2-5: Contract Testing**

```yaml
Morning:
  - Write contract tests for interfaces
  - Create repository interface tests
  - Implement service contract tests

Afternoon:
  - Run Red-Green-Refactor cycles
  - Execute mutation testing
  - Update quality metrics

Deliverables:
  - Contract tests complete
  - Mutation scores improving
  - Quality gates established
```

### **Day 6-15: Implementation Support**

```yaml
Morning:
  - Write tests for new implementations
  - Support Backend Agent with TDD
  - Validate mutation coverage

Afternoon:
  - Run integration tests
  - Performance testing
  - Update quality dashboard

Deliverables:
  - Implementation tests complete
  - High mutation scores
  - Quality gates passing
```

### **Day 16-20: End-to-End Testing**

```yaml
Morning:
  - E2E testing scenarios
  - Performance benchmarking
  - Security testing

Afternoon:
  - Final mutation testing
  - Quality validation
  - Production readiness

Deliverables:
  - Complete test suite
  - Production-ready quality
  - Final quality report
```

---

## 📊 Quality Standards

### **Coverage Targets**

- **Line Coverage**: 95%+
- **Branch Coverage**: 90%+
- **Function Coverage**: 100%
- **Mutation Score**: 85%+

### **Test Categories**

1. **Unit Tests**: Individual functions/methods
2. **Integration Tests**: Service interactions
3. **Contract Tests**: Interface compliance
4. **E2E Tests**: Full user workflows
5. **Performance Tests**: Load and stress testing

### **Quality Metrics**

```typescript
interface QualityMetrics {
  lineCoverage: number; // Target: 95%
  branchCoverage: number; // Target: 90%
  mutationScore: number; // Target: 85%
  testCount: number; // Growing daily
  performanceScore: number; // Lighthouse score
}
```

---

## 🔧 Testing Tools Setup

### **Package Installation**

```bash
# Core testing dependencies
npm install --save-dev \
  @stryker-mutator/core \
  @stryker-mutator/jest-runner \
  @stryker-mutator/typescript-checker \
  jest \
  supertest \
  @testing-library/react \
  @testing-library/jest-dom

# Additional quality tools
npm install --save-dev \
  eslint \
  prettier \
  husky \
  lint-staged
```

### **Jest Configuration**

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
    "!src/test/**/*",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      lines: 95,
      statements: 95,
    },
  },
};
```

---

## 🔄 Communication Protocol

### **Daily Updates**

- **Morning**: Review test results and plan daily testing
- **Afternoon**: Share mutation scores and quality metrics
- **Evening**: Update quality dashboard and prepare reports

### **Integration Points**

- **Architecture Agent**: Validate interface compliance through tests
- **Backend Agent**: Provide TDD support and test feedback
- **Frontend Agent**: Create integration tests for UI components
- **DevOps Agent**: Integrate testing into CI/CD pipeline

### **Quality Reporting**

- **Daily**: Mutation score and coverage reports
- **Weekly**: Comprehensive quality dashboard
- **Milestone**: Quality gate validation reports

---

## 🎯 Success Metrics

### **Daily Metrics**

- [ ] Tests written vs. code implemented
- [ ] Mutation score improvement
- [ ] Coverage percentage increase
- [ ] Quality gates passing

### **Weekly Milestones**

- **Week 1**: Testing infrastructure + contract tests
- **Week 2**: Implementation support + integration tests
- **Week 3**: E2E testing + production readiness

---

## 📚 Testing Best Practices

### **TDD Best Practices**

1. **Write minimal tests first** - Focus on behavior, not implementation
2. **Make tests pass quickly** - Minimal code to pass tests
3. **Refactor confidently** - Tests provide safety net
4. **Keep tests independent** - Each test should run in isolation
5. **Use descriptive test names** - Clear intent and expectations

### **Mutation Testing Best Practices**

1. **Start early** - Establish baseline from day 1
2. **Incremental improvement** - Small, consistent improvements
3. **Focus on critical paths** - Prioritize high-risk code
4. **Review survivors** - Understand why mutants survived
5. **Balance speed vs. coverage** - Optimize for both

### **Quality Gates**

1. **Pre-commit hooks** - Run tests before commits
2. **PR validation** - Require tests for new code
3. **Deployment gates** - Block deploys below threshold
4. **Monitoring** - Track quality metrics in production

---

_Testing Agent está diseñado para garantizar la máxima calidad del código mediante TDD riguroso y mutation testing, asegurando que la migración SOLID sea robusta y confiable._
