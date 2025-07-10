# 🧪 Testing

This document describes the testing strategy for the Alkitu monorepo, with a focus on the `api` package.

## 1. Testing Framework

We use **Vitest** as the primary testing framework for unit and integration tests. It provides a fast and modern testing experience with a Jest-compatible API.

## 2. Types of Tests

### 2.1. Unit Tests

Unit tests are used to test individual functions and classes in isolation. They are located in files with the `.spec.ts` extension.

To run all unit tests, use the following command:

```bash
npm run test:api
```

### 2.2. Integration Tests

Integration tests are used to test the interaction between different parts of the application, such as controllers, services, and database queries. These tests often use mocks to isolate the components being tested.

### 2.3. End-to-End (E2E) Tests

E2E tests are used to test the application as a whole, from the API endpoints to the database. They are located in the `test` directory of the `api` package.

To run the E2E tests, use the following command:

```bash
npm run test:e2e:api
```

## 3. Mocking

We use **mocks** to isolate our tests and avoid dependencies on external services like databases and email providers. This makes our tests faster and more reliable.

- **Prisma**: The Prisma client is mocked to simulate database queries.
- **Email**: The email service is mocked to prevent sending actual emails during tests.

## 4. Running All Tests

To run all tests for all packages, you can use the following command from the root of the monorepo:

```bash
npm run test
```
