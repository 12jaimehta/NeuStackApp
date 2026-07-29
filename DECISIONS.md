# Architecture and Design Decisions

This document explains the project structure , implementation choices, and the conventions followed while building the application .

---

# 1. Project Architecture

The project is organized using **Feature-Sliced Design (FSD)** for both the frontend and backend . Instead of grouping files by type (controllers, services, components, etc.) , everything related to a feature is kept together.

A typical feature contains its own routes , services , types , and other related files , making it easier to find and maintain code.

## Folder Structure

| Layer | Backend | Frontend | Purpose |
| --- | --- | --- | --- |
| Features | `src/features/<feature>/` | `src/features/<feature>/` | Business logic and feature-specific code |
| Shared | `src/shared/` | `src/shared/` | Common utilities used across features |
| Config | `src/config/` | — | Application configuration |

### Import Rules

Features are allowed to import code from:

- `shared`
- `config`

Features should not depend directly on other features. If multiple features require the same functionality, that code should be moved into `shared`.

---

# 2. Design Decisions

## In-Memory Store

Since the assignment doesn't require a database, all application data is stored in memory.

Instead of exposing a plain object, I used a Singleton class so all reads and updates happen through a single interface . This keeps state changes in one place and avoids accidental mutations from different parts of the application.

An additional `resetForTesting()` method is included so tests can start with a fresh state.

---

## Discount Code Generation

The specification states that every **nth order** is eligible for a discount code.

I considered generating the code automatically during checkout, but chose to generate it only through the admin endpoint.

This keeps the responsibilities separate:

- Checkout only validates discount codes.
- The admin endpoint checks eligibility and creates a new code.

It also matches the API requirements more closely and gives the admin explicit control over issuing new coupons.

---

## Feature-Sliced Design

The project follows Feature-Sliced Design throughout the codebase.

Each feature contains its own implementation, which keeps related files together and reduces the need to search across different folders.

Shared functionality is extracted into the `shared` directory instead of creating dependencies between features.

---

## Request Validation

Incoming request bodies are validated using **Zod**.

TypeScript types only exist during compilation , so runtime validation is still required for API requests.

Each feature defines its schemas in its own `*.types.ts` file , and routes use a shared `validateBody()` middleware before the request reaches the controller .

This avoids repeating validation logic inside controllers.

---

## Environment Configuration

Business values such as:

- discount percentage
- nth-order threshold

are loaded from environment variables through the configuration module.

This keeps business configuration separate from the application logic and makes changing these values straightforward .

---

## Order Identifiers

Every order has two identifiers.

- A UUID (`id`) used internally.
- A sequential `orderNumber` that's easier to reference when viewing or discussing orders.

The sequential order number is also used for checking discount eligibility.

---

## Discount Code Format

Generated discount codes follow this format:

```
DISC-XXXX-XXXX
```

The random characters are generated using Node.js `crypto.randomBytes()`, which provides sufficiently random values for this assignment while avoiding additional dependencies.

---