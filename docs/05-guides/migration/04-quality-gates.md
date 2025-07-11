# 📊 Quality Gates & Metrics

## 📋 Overview

Los Quality Gates aseguran que la migración SOLID mantenga los más altos estándares de calidad. Este documento define todas las métricas, thresholds y procesos de validación automática.

---

## 🎯 Quality Standards

### **Cobertura de Tests**

```yaml
Line Coverage: >=95%
Branch Coverage: >=90%
Function Coverage: >=95%
Statement Coverage: >=95%
```

### **Mutation Testing**

```yaml
Mutation Score: >=85%
Killed Mutants: >=85%
Survived Mutants: <=15%
Timeout Factor: 2.0
```

### **Performance**

```yaml
Response Time P95: <200ms
Response Time P99: <500ms
Throughput: No regression (±5%)
Memory Usage: <512MB
CPU Usage: <70%
```

### **Code Quality**

```yaml
Cyclomatic Complexity: <10 per method
Code Duplication: <3%
Technical Debt Ratio: <30 minutes
SOLID Violations: 0
```

---

## 🔧 Automated Quality Gates

### **1. Test Coverage Gate**

```typescript
// scripts/coverage-gate.ts
interface CoverageThresholds {
  lines: number;
  branches: number;
  functions: number;
  statements: number;
}

export class CoverageGate {
  private thresholds: CoverageThresholds = {
    lines: 95,
    branches: 90,
    functions: 95,
    statements: 95,
  };

  async check(): Promise<QualityGateResult> {
    const coverage = await this.getCoverageReport();

    const results = {
      lines: this.validateThreshold(
        "lines",
        coverage.lines,
        this.thresholds.lines
      ),
      branches: this.validateThreshold(
        "branches",
        coverage.branches,
        this.thresholds.branches
      ),
      functions: this.validateThreshold(
        "functions",
        coverage.functions,
        this.thresholds.functions
      ),
      statements: this.validateThreshold(
        "statements",
        coverage.statements,
        this.thresholds.statements
      ),
    };

    const passed = Object.values(results).every((result) => result.passed);

    return {
      name: "Test Coverage",
      passed,
      details: results,
      summary: `Coverage: ${coverage.lines}% lines, ${coverage.branches}% branches`,
    };
  }

  private async getCoverageReport(): Promise<CoverageReport> {
    // Parse jest coverage report
    const coverageFile = "./coverage/coverage-summary.json";
    const coverage = JSON.parse(await fs.readFile(coverageFile, "utf8"));

    return {
      lines: coverage.total.lines.pct,
      branches: coverage.total.branches.pct,
      functions: coverage.total.functions.pct,
      statements: coverage.total.statements.pct,
    };
  }

  private validateThreshold(
    metric: string,
    actual: number,
    threshold: number
  ): ValidationResult {
    return {
      metric,
      actual,
      threshold,
      passed: actual >= threshold,
      message:
        actual >= threshold
          ? `✅ ${metric}: ${actual}% (>= ${threshold}%)`
          : `❌ ${metric}: ${actual}% (< ${threshold}%)`,
    };
  }
}
```

### **2. Mutation Testing Gate**

```typescript
// scripts/mutation-gate.ts
export class MutationGate {
  private readonly threshold = 85; // 85% minimum mutation score

  async check(): Promise<QualityGateResult> {
    const report = await this.getMutationReport();
    const passed = report.mutationScore >= this.threshold;

    return {
      name: "Mutation Testing",
      passed,
      details: {
        mutationScore: report.mutationScore,
        killedMutants: report.killed,
        survivedMutants: report.survived,
        totalMutants: report.total,
      },
      summary: `Mutation Score: ${report.mutationScore}% (${report.killed}/${report.total} killed)`,
    };
  }

  private async getMutationReport(): Promise<MutationReport> {
    const reportFile = "./reports/mutation/mutation.json";
    const report = JSON.parse(await fs.readFile(reportFile, "utf8"));

    return {
      mutationScore: report.thresholds.high,
      killed: report.killed,
      survived: report.survived,
      total:
        report.killed + report.survived + report.timeout + report.noCoverage,
    };
  }
}
```

### **3. Performance Gate**

```typescript
// scripts/performance-gate.ts
export class PerformanceGate {
  private thresholds = {
    responseTimeP95: 200, // ms
    responseTimeP99: 500, // ms
    throughputRegression: 5, // %
    memoryUsage: 512, // MB
  };

  async check(): Promise<QualityGateResult> {
    const baseline = await this.getBaselineMetrics();
    const current = await this.getCurrentMetrics();

    const results = {
      responseTime: this.checkResponseTime(current.responseTimeP95),
      throughput: this.checkThroughputRegression(
        baseline.throughput,
        current.throughput
      ),
      memory: this.checkMemoryUsage(current.memoryUsage),
    };

    const passed = Object.values(results).every((result) => result.passed);

    return {
      name: "Performance",
      passed,
      details: results,
      summary: `P95: ${current.responseTimeP95}ms, Memory: ${current.memoryUsage}MB`,
    };
  }

  private checkResponseTime(responseTime: number): ValidationResult {
    return {
      metric: "Response Time P95",
      actual: responseTime,
      threshold: this.thresholds.responseTimeP95,
      passed: responseTime <= this.thresholds.responseTimeP95,
      message:
        responseTime <= this.thresholds.responseTimeP95
          ? `✅ Response Time: ${responseTime}ms (<= ${this.thresholds.responseTimeP95}ms)`
          : `❌ Response Time: ${responseTime}ms (> ${this.thresholds.responseTimeP95}ms)`,
    };
  }

  private checkThroughputRegression(
    baseline: number,
    current: number
  ): ValidationResult {
    const regression = ((baseline - current) / baseline) * 100;
    const passed = regression <= this.thresholds.throughputRegression;

    return {
      metric: "Throughput Regression",
      actual: regression,
      threshold: this.thresholds.throughputRegression,
      passed,
      message: passed
        ? `✅ Throughput: ${regression.toFixed(1)}% regression (<= ${this.thresholds.throughputRegression}%)`
        : `❌ Throughput: ${regression.toFixed(1)}% regression (> ${this.thresholds.throughputRegression}%)`,
    };
  }

  private async getCurrentMetrics(): Promise<PerformanceMetrics> {
    // Run performance tests and collect metrics
    const metrics = await this.runPerformanceTests();
    return metrics;
  }

  private async runPerformanceTests(): Promise<PerformanceMetrics> {
    // Implementation would run actual performance tests
    // This is a simplified example
    return {
      responseTimeP95: 150,
      responseTimeP99: 300,
      throughput: 1000,
      memoryUsage: 256,
    };
  }
}
```

### **4. Code Quality Gate**

```typescript
// scripts/code-quality-gate.ts
export class CodeQualityGate {
  private thresholds = {
    cyclomaticComplexity: 10,
    codeDuplication: 3, // %
    technicalDebt: 30, // minutes
  };

  async check(): Promise<QualityGateResult> {
    const [eslintResults, sonarResults] = await Promise.all([
      this.runESLint(),
      this.runSonarAnalysis(),
    ]);

    const results = {
      linting: this.checkLinting(eslintResults),
      complexity: this.checkComplexity(sonarResults.complexity),
      duplication: this.checkDuplication(sonarResults.duplication),
      technicalDebt: this.checkTechnicalDebt(sonarResults.technicalDebt),
    };

    const passed = Object.values(results).every((result) => result.passed);

    return {
      name: "Code Quality",
      passed,
      details: results,
      summary: `Complexity: ${sonarResults.complexity}, Duplication: ${sonarResults.duplication}%`,
    };
  }

  private async runESLint(): Promise<ESLintResult> {
    try {
      execSync("npm run lint", { stdio: "pipe" });
      return { errors: 0, warnings: 0, passed: true };
    } catch (error) {
      // Parse eslint output to get error/warning counts
      return { errors: 5, warnings: 10, passed: false };
    }
  }

  private async runSonarAnalysis(): Promise<SonarResult> {
    // Mock sonar analysis - in real implementation, integrate with SonarQube
    return {
      complexity: 8,
      duplication: 2.1,
      technicalDebt: 25,
    };
  }
}
```

---

## 📊 Quality Dashboard

### **Real-time Monitoring**

```typescript
// scripts/quality-dashboard.ts
export class QualityDashboard {
  private gates: QualityGate[] = [
    new CoverageGate(),
    new MutationGate(),
    new PerformanceGate(),
    new CodeQualityGate(),
  ];

  async generateReport(): Promise<QualityReport> {
    console.log("🔍 Running all quality gates...\n");

    const results = await Promise.all(this.gates.map((gate) => gate.check()));

    const passed = results.every((result) => result.passed);
    const score = this.calculateQualityScore(results);

    const report: QualityReport = {
      timestamp: new Date().toISOString(),
      overallPassed: passed,
      qualityScore: score,
      gates: results,
      summary: this.generateSummary(results),
    };

    this.displayReport(report);
    await this.saveReport(report);

    return report;
  }

  private calculateQualityScore(results: QualityGateResult[]): number {
    const weights = {
      "Test Coverage": 0.3,
      "Mutation Testing": 0.3,
      Performance: 0.2,
      "Code Quality": 0.2,
    };

    let weightedScore = 0;
    let totalWeight = 0;

    results.forEach((result) => {
      const weight = weights[result.name] || 0.1;
      weightedScore += (result.passed ? 100 : 0) * weight;
      totalWeight += weight;
    });

    return Math.round(weightedScore / totalWeight);
  }

  private displayReport(report: QualityReport): void {
    console.log("📊 Quality Gates Report");
    console.log("========================\n");

    report.gates.forEach((gate) => {
      const status = gate.passed ? "✅" : "❌";
      console.log(`${status} ${gate.name}: ${gate.summary}`);
    });

    console.log(`\n🎯 Overall Quality Score: ${report.qualityScore}%`);
    console.log(`📈 Status: ${report.overallPassed ? "PASSED" : "FAILED"}\n`);

    if (!report.overallPassed) {
      console.log(
        "❌ Quality gates failed. Please fix issues before proceeding."
      );
      process.exit(1);
    } else {
      console.log("🎉 All quality gates passed!");
    }
  }

  private async saveReport(report: QualityReport): Promise<void> {
    const reportPath = `./reports/quality/quality-${Date.now()}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`📝 Report saved: ${reportPath}`);
  }
}
```

---

## 🚨 Continuous Integration Integration

### **GitHub Actions Workflow**

```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality-gates:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:5.0
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript check
        run: npm run type-check

      - name: Run linting
        run: npm run lint

      - name: Run unit tests with coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Run mutation tests
        run: npm run test:mutation

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: mongodb://localhost:27017/test

      - name: Run performance tests
        run: npm run test:performance

      - name: Run quality gates
        run: npm run quality:check

      - name: Generate quality report
        run: npm run quality:report

      - name: Upload quality artifacts
        uses: actions/upload-artifact@v3
        with:
          name: quality-reports
          path: |
            coverage/
            reports/

      - name: Comment PR with quality report
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('./reports/quality/latest.json', 'utf8'));

            const comment = `## 📊 Quality Gates Report

            **Overall Status:** ${report.overallPassed ? '✅ PASSED' : '❌ FAILED'}
            **Quality Score:** ${report.qualityScore}%

            ### Results:
            ${report.gates.map(gate => 
              `- ${gate.passed ? '✅' : '❌'} **${gate.name}:** ${gate.summary}`
            ).join('\n')}

            ${!report.overallPassed ? '\n⚠️ **Action Required:** Please fix the failing quality gates before merging.' : ''}
            `;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### **Pre-commit Hooks**

```bash
#!/bin/sh
# .husky/pre-commit

echo "🔍 Running pre-commit quality checks..."

# Type checking
echo "📝 Type checking..."
npm run type-check || exit 1

# Linting
echo "🔧 Linting..."
npm run lint || exit 1

# Quick tests (affected only)
echo "🧪 Running affected tests..."
npm run test:affected || exit 1

# Code formatting
echo "💅 Formatting code..."
npm run format

echo "✅ Pre-commit checks passed!"
```

---

## 📈 Performance Monitoring

### **Benchmark Tests**

```typescript
// src/__tests__/performance/user-operations.benchmark.ts
import { performance } from "perf_hooks";

describe("User Operations Performance", () => {
  let legacyOps: LegacyUserOperations;
  let solidOps: SOLIDUserOperations;

  beforeEach(async () => {
    // Setup both implementations
  });

  it("should compare create user performance", async () => {
    const iterations = 1000;
    const userData = createValidUserData();

    // Benchmark legacy implementation
    const legacyStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      await legacyOps.create({ ...userData, email: `legacy${i}@test.com` });
    }
    const legacyTime = performance.now() - legacyStart;

    // Benchmark SOLID implementation
    const solidStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      await solidOps.createUser({ ...userData, email: `solid${i}@test.com` });
    }
    const solidTime = performance.now() - solidStart;

    // Compare performance
    const difference = ((solidTime - legacyTime) / legacyTime) * 100;

    console.log(`Legacy: ${legacyTime.toFixed(2)}ms`);
    console.log(`SOLID: ${solidTime.toFixed(2)}ms`);
    console.log(`Difference: ${difference.toFixed(2)}%`);

    // Assert no significant regression (within 5%)
    expect(Math.abs(difference)).toBeLessThan(5);
  });

  it("should measure memory usage", async () => {
    const initialMemory = process.memoryUsage().heapUsed;

    // Create many users
    for (let i = 0; i < 10000; i++) {
      await solidOps.createUser({
        email: `memory${i}@test.com`,
        password: "Password123!",
        name: `User ${i}`,
      });
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB

    console.log(`Memory increase: ${memoryIncrease.toFixed(2)}MB`);

    // Assert reasonable memory usage
    expect(memoryIncrease).toBeLessThan(100); // Less than 100MB increase
  });
});
```

### **Load Testing**

```typescript
// scripts/load-test.ts
import autocannon from "autocannon";

export class LoadTester {
  async runUserApiLoad(): Promise<LoadTestResult> {
    const result = await autocannon({
      url: "http://localhost:3001",
      connections: 100,
      duration: 30, // 30 seconds
      requests: [
        {
          method: "POST",
          path: "/users",
          headers: {
            "content-type": "application/json",
            authorization: "Bearer test-token",
          },
          body: JSON.stringify({
            email: "loadtest@example.com",
            password: "Password123!",
            name: "Load Test User",
          }),
        },
        {
          method: "GET",
          path: "/users/507f1f77bcf86cd799439011",
          headers: {
            authorization: "Bearer test-token",
          },
        },
      ],
    });

    return this.parseResults(result);
  }

  private parseResults(result: any): LoadTestResult {
    return {
      requestsPerSecond: result.requests.average,
      latencyP95: result.latency.p95,
      latencyP99: result.latency.p99,
      throughput: result.throughput.average,
      errors: result.errors,
      timeouts: result.timeouts,
    };
  }
}
```

---

## 🎯 Quality Metrics Tracking

### **Historical Trends**

```typescript
// scripts/metrics-tracker.ts
export class MetricsTracker {
  async trackQualityTrends(): Promise<void> {
    const currentMetrics = await this.collectCurrentMetrics();
    const historicalData = await this.loadHistoricalData();

    historicalData.push({
      timestamp: new Date().toISOString(),
      ...currentMetrics,
    });

    await this.saveHistoricalData(historicalData);
    await this.generateTrendReport(historicalData);
  }

  private async collectCurrentMetrics(): Promise<QualityMetrics> {
    const [coverage, mutation, performance] = await Promise.all([
      this.getCoverageMetrics(),
      this.getMutationMetrics(),
      this.getPerformanceMetrics(),
    ]);

    return {
      coverage,
      mutation,
      performance,
      codeQuality: await this.getCodeQualityMetrics(),
    };
  }

  private async generateTrendReport(data: QualityMetrics[]): Promise<void> {
    const trends = this.calculateTrends(data);

    console.log("📈 Quality Trends (Last 30 days)");
    console.log("=================================");
    console.log(
      `Coverage: ${trends.coverage > 0 ? "📈" : "📉"} ${trends.coverage.toFixed(2)}%`
    );
    console.log(
      `Mutation Score: ${trends.mutation > 0 ? "📈" : "📉"} ${trends.mutation.toFixed(2)}%`
    );
    console.log(
      `Performance: ${trends.performance < 0 ? "📈" : "📉"} ${Math.abs(trends.performance).toFixed(2)}%`
    );
  }
}
```

---

## 🎉 Success Criteria

### **Migration Readiness Checklist**

- [ ] **Test Coverage** >= 95%
- [ ] **Mutation Score** >= 85%
- [ ] **Performance Regression** <= 5%
- [ ] **Zero ESLint Errors**
- [ ] **Zero TypeScript Errors**
- [ ] **All Integration Tests Pass**
- [ ] **Load Tests Pass**
- [ ] **Security Scan Clean**
- [ ] **Documentation Updated**

### **Production Deployment Gates**

- [ ] **All Quality Gates Pass**
- [ ] **Rollback Plan Tested**
- [ ] **Monitoring Setup**
- [ ] **Team Training Complete**
- [ ] **Stakeholder Approval**

---

_Estos quality gates garantizan que la migración SOLID mantenga los más altos estándares de calidad y performance._
