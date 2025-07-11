# 🧪 Testing Strategy & Implementation

## 📋 Overview

Complete testing strategy for the Alkitu Template using TDD (Test-Driven Development) and Mutation Testing to ensure maximum code quality and reliability.

## 🎯 Testing Philosophy

### **Red-Green-Refactor Cycle**

```
🔴 RED    → Write failing test first
🟢 GREEN  → Write minimal code to pass
🔵 REFACTOR → Improve code while keeping tests green
✅ VALIDATE → Run mutation tests to verify test quality
```

### **Quality-First Approach**

- **Tests before code**: TDD methodology enforced
- **Mutation testing**: Verify test quality, not just coverage
- **Continuous validation**: Quality gates at every step
- **Multiple test layers**: Unit, Integration, Contract, E2E

---

## 🏗️ Testing Architecture

### **Testing Pyramid**

```
                    🔺 E2E Tests (5%)
                   /  Full user workflows
                  /
               🔺 Integration Tests (15%)
              /   Service interactions
             /
          🔺 Unit Tests (80%)
         /   Individual service logic
        /
    🔺 Contract Tests
   /   Interface compliance
  /
🔺 Mutation Tests
  Quality validation
```

### **Testing Layers**

1. **Contract Tests**: Interface compliance and behavior validation
2. **Unit Tests**: Individual service logic and edge cases
3. **Integration Tests**: Service interactions and data flow
4. **E2E Tests**: Complete user workflows and scenarios
5. **Mutation Tests**: Test quality and effectiveness validation

---

## 🛠️ Tools & Configuration

### **Testing Framework Stack**

- **Jest**: Primary testing framework
- **Stryker**: Mutation testing framework
- **SuperTest**: API testing
- **Testing Library**: React component testing
- **Prisma Mock**: Database mocking

### **Quality Tools**

- **Istanbul**: Code coverage analysis
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates
- **SonarQube**: Advanced code analysis (optional)

### **Configuration Files**

```
packages-solid/
├── stryker.conf.json         # Mutation testing config
├── jest.config.js            # Jest configuration
├── .eslintrc.js              # Code quality rules
└── test/
    ├── setup.ts              # Test environment setup
    ├── mocks/                # Mock implementations
    ├── fixtures/             # Test data
    └── utils/                # Test utilities
```

---

## 🔴 RED Phase: Write Failing Tests First

### **1. Interface Contract Tests**

```typescript
// src/users/interfaces/__tests__/user-service.contract.spec.ts
describe("IUserService Contract", () => {
  let service: IUserService;

  beforeEach(() => {
    service = testModule.get<IUserService>("IUserService");
  });

  describe("createUser", () => {
    it("should create user with valid data", async () => {
      // RED: This test fails initially
      const userData = { email: "test@test.com", password: "password123" };
      const result = await service.createUser(userData);

      expect(result).toMatchObject({
        id: expect.any(String),
        email: userData.email,
        createdAt: expect.any(Date),
      });
    });

    it("should throw ConflictException for duplicate email", async () => {
      // RED: This test fails initially
      const userData = { email: "duplicate@test.com", password: "password123" };

      await service.createUser(userData);

      await expect(service.createUser(userData)).rejects.toThrow(
        ConflictException
      );
    });

    it("should hash password before storing", async () => {
      // RED: This test fails initially
      const userData = { email: "test@test.com", password: "plaintext" };
      const result = await service.createUser(userData);

      // Password should not be returned or be plaintext
      expect(result.password).toBeUndefined();
    });
  });
});
```

### **2. Repository Contract Tests**

```typescript
// src/users/repositories/__tests__/user-repository.contract.spec.ts
describe("IUserRepository Contract", () => {
  let repository: IUserRepository;

  beforeEach(() => {
    repository = testModule.get<IUserRepository>("IUserRepository");
  });

  describe("create", () => {
    it("should create user and return with id", async () => {
      // RED: Fails initially
      const userData = createValidUserData();
      const result = await repository.create(userData);

      expect(result.id).toBeDefined();
      expect(result.email).toBe(userData.email);
    });
  });

  describe("findByEmail", () => {
    it("should return user when email exists", async () => {
      // RED: Fails initially
      const userData = createValidUserData();
      const created = await repository.create(userData);

      const found = await repository.findByEmail(userData.email);
      expect(found?.id).toBe(created.id);
    });

    it("should return null when email does not exist", async () => {
      // RED: Fails initially
      const result = await repository.findByEmail("nonexistent@test.com");
      expect(result).toBeNull();
    });
  });
});
```

---

## 🟢 GREEN Phase: Minimal Implementation

### **1. Service Implementation**

```typescript
// src/users/services/user-core.service.ts
@Injectable()
export class UserCoreService implements IUserService {
  constructor(
    @Inject("IUserRepository") private repository: IUserRepository,
    @Inject("IUserNotificationService")
    private notifications: IUserNotificationService
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    // GREEN: Minimal implementation to pass tests

    // Check if user exists
    const existing = await this.repository.findByEmail(userData.email);
    if (existing) {
      throw new ConflictException("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await this.repository.create({
      ...userData,
      password: hashedPassword,
    });

    // Send notification (don't fail if it fails)
    try {
      await this.notifications.sendWelcomeMessage(user.id);
    } catch (error) {
      console.warn("Failed to send welcome notification:", error);
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}
```

### **2. Repository Implementation**

```typescript
// src/users/repositories/user.repository.ts
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(userData: CreateUserDto): Promise<User> {
    // GREEN: Minimal implementation
    return this.prisma.user.create({
      data: userData,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    // GREEN: Minimal implementation
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
```

---

## 🔵 REFACTOR Phase: Improve While Keeping Tests Green

### **1. Enhanced Service Implementation**

```typescript
async createUser(userData: CreateUserDto): Promise<User> {
  // REFACTOR: Add input validation
  await this.validateUserData(userData);

  // REFACTOR: Add better error handling
  try {
    const existing = await this.repository.findByEmail(userData.email);
    if (existing) {
      throw new ConflictException(`User with email ${userData.email} already exists`);
    }

    // REFACTOR: Add password strength validation
    this.validatePasswordStrength(userData.password);

    const hashedPassword = await this.hashPassword(userData.password);

    const user = await this.repository.create({
      ...userData,
      password: hashedPassword,
    });

    // REFACTOR: Add proper notification handling
    await this.handleUserCreationNotification(user);

    return this.sanitizeUserData(user);
  } catch (error) {
    // REFACTOR: Add proper error logging
    this.logger.error('Failed to create user', { error, userData: { email: userData.email } });
    throw error;
  }
}

private async validateUserData(userData: CreateUserDto): Promise<void> {
  // Validation logic
}

private validatePasswordStrength(password: string): void {
  // Password strength validation
}

private async hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12); // REFACTOR: Better salt rounds
}

private sanitizeUserData(user: User): User {
  const { password, ...sanitized } = user;
  return sanitized as User;
}
```

### **2. Performance Optimizations**

```typescript
// REFACTOR: Add caching, batch operations, etc.
async findByEmail(email: string): Promise<User | null> {
  // Add caching layer
  const cached = await this.cache.get(`user:email:${email}`);
  if (cached) {
    return cached;
  }

  const user = await this.prisma.user.findUnique({
    where: { email },
    select: {
      // REFACTOR: Only select needed fields
      id: true,
      email: true,
      name: true,
      lastName: true,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
    },
  });

  if (user) {
    await this.cache.set(`user:email:${email}`, user, 300); // 5 min cache
  }

  return user;
}
```

---

## 🧬 Mutation Testing with Stryker

### **1. Stryker Configuration**

```json
{
  "packageManager": "npm",
  "reporters": ["html", "clear-text", "progress", "dashboard"],
  "testRunner": "jest",
  "testRunnerNodeArgs": ["--max_old_space_size=4096"],
  "coverageAnalysis": "perTest",
  "mutate": [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
    "!src/**/*.interface.ts",
    "!src/**/*.dto.ts",
    "!src/test/**/*"
  ],
  "thresholds": {
    "high": 85,
    "low": 70,
    "break": 60
  },
  "timeoutMS": 30000,
  "concurrency": 4,
  "plugins": ["@stryker-mutator/jest-runner"],
  "jest": {
    "projectType": "custom",
    "configFile": "jest.config.js"
  }
}
```

### **2. Mutation Testing Strategy**

1. **Initial Run**: Establish baseline mutation score
2. **Incremental Testing**: Test new code as it's written
3. **Quality Gates**: Block merges below threshold
4. **Reporting**: Daily mutation score reports

### **3. Mutation Score Targets**

- **Week 1**: 60% mutation score (baseline)
- **Week 2**: 75% mutation score (improvement)
- **Week 3**: 85% mutation score (target)
- **Production**: 90%+ mutation score (excellence)

---

## 📊 Quality Standards & Metrics

### **Coverage Targets**

- **Line Coverage**: ≥95%
- **Branch Coverage**: ≥90%
- **Function Coverage**: ≥100%
- **Statement Coverage**: ≥95%
- **Mutation Score**: ≥85%

### **Test Categories & Distribution**

1. **Unit Tests (80%)**: Individual functions/methods
2. **Integration Tests (15%)**: Service interactions
3. **Contract Tests**: Interface compliance
4. **E2E Tests (5%)**: Full user workflows
5. **Performance Tests**: Load and stress testing

### **Quality Gates Configuration**

```typescript
// jest.config.js
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
    "!src/**/*.interface.ts",
    "!src/**/*.dto.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      lines: 95,
      statements: 95,
    },
    "./src/users/services/": {
      branches: 95,
      functions: 100,
      lines: 95,
      statements: 95,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
};
```

---

## 🚀 CI/CD Integration

### **1. GitHub Actions Workflow**

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests with coverage
        run: npm run test:coverage

      - name: Run mutation tests
        run: npm run test:mutation

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

      - name: Quality Gate
        run: |
          if [ $(jq '.mutationScore' mutation-report.json) -lt 85 ]; then
            echo "Mutation score below threshold"
            exit 1
          fi
```

### **2. Pre-commit Hooks**

```bash
#!/bin/sh
# .husky/pre-commit
. "$(dirname "$0")/_/husky.sh"

npm run test:coverage
npm run lint
npm run type-check
```

### **3. Package.json Scripts**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:mutation": "stryker run",
    "test:mutation:watch": "stryker run --watch",
    "test:all": "npm run test:coverage && npm run test:mutation",
    "test:ci": "npm run test:coverage && npm run test:mutation"
  }
}
```

---

## 🎯 Testing Best Practices

### **TDD Best Practices**

1. **Write minimal tests first**: Focus on behavior, not implementation
2. **Make tests pass quickly**: Minimal code to pass tests
3. **Refactor confidently**: Tests provide safety net
4. **Keep tests independent**: Each test should run in isolation
5. **Use descriptive test names**: Clear intent and expectations

### **Mutation Testing Best Practices**

1. **Start early**: Establish baseline from day 1
2. **Incremental improvement**: Small, consistent improvements
3. **Focus on critical paths**: Prioritize high-risk code
4. **Review survivors**: Understand why mutants survived
5. **Balance speed vs. coverage**: Optimize for both

### **Quality Gates Best Practices**

1. **Pre-commit hooks**: Run tests before commits
2. **PR validation**: Require tests for new code
3. **Deployment gates**: Block deploys below threshold
4. **Monitoring**: Track quality metrics in production

---

## 📋 Testing Checklist

### **Before Implementation**

- [ ] Write interface contract tests (RED)
- [ ] Write unit tests for each method (RED)
- [ ] Setup mutation testing config
- [ ] Define quality thresholds

### **During Implementation**

- [ ] Implement minimal code to pass tests (GREEN)
- [ ] All tests pass
- [ ] Mutation score ≥85%
- [ ] Code coverage ≥95%

### **After Implementation**

- [ ] Refactor while keeping tests green (REFACTOR)
- [ ] Add integration tests
- [ ] Add performance tests
- [ ] Update documentation

---

## 🎯 Benefits of This Approach

1. **Quality Assurance**: Mutation testing ensures test quality
2. **Regression Prevention**: Comprehensive test suite prevents bugs
3. **Refactoring Safety**: Tests enable safe code improvements
4. **Documentation**: Tests serve as living documentation
5. **Team Confidence**: High test coverage builds team confidence
6. **Maintainability**: Well-tested code is easier to maintain
7. **Deployment Safety**: Quality gates prevent broken deployments

---

## 📚 Resources & References

- [TDD by Example - Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [Mutation Testing Guide](https://stryker-mutator.io/)
- [Jest Testing Framework](https://jestjs.io/)
- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)

---

*This testing strategy ensures that the Alkitu Template maintains the highest quality standards through comprehensive test coverage, mutation testing, and continuous quality validation.*