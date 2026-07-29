# Design Decisions

This document records the significant design decisions made during implementation. Each decision documents the context, options considered, choice made, and trade-offs.

---

## Decision 1: In-Memory Singleton Store

**Context:** The assignment required no database. We needed a persistent state mechanism that all parts of the application could reliably access.

**Options Considered:**
- **Option A:** Module-level exported objects (plain `const store = {}`)
- **Option B:** Singleton class with controlled access methods
- **Option C:** External in-memory DB (e.g., `lowdb`, Redis)

**Choice:** Option B — Singleton class with methods

**Why:**
A plain exported object would allow any file to mutate state directly, making bugs hard to trace. The Singleton class pattern:
- **Encapsulates** all mutations inside controlled methods
- Provides a **clear interface** (just like a DB repository pattern)
- Makes future migration to a real DB trivial — only the store methods change, not any service
- Prevents accidental state mutation from outside the store

The class approach also let us add `resetForTesting()` cleanly without polluting the public API for production use.

---

## Decision 2: Admin-Triggered Discount Code Generation

**Context:** The spec says "Every nth order gets a coupon code." This could mean: (a) auto-generate the code when the nth order is placed, or (b) the admin manually generates it when eligible.

**Options Considered:**
- **Option A:** Auto-generate on checkout — when the nth order is placed, a code is automatically created
- **Option B:** Admin-pull model — admin calls `POST /admin/discount/generate`; the API validates eligibility

**Choice:** Option B — Admin explicitly generates the code

**Why:**
The spec explicitly says: *"Generate a discount code if the condition above is satisfied"* (emphasis on admin API). This implies:
1. The admin has **control** over when codes are issued
2. It prevents scenarios where a code is auto-created but never distributed to the customer
3. It's more realistic — in production, discount code creation often involves marketing workflows
4. It separates the **eligibility check** from the **code issuance**, giving the admin team flexibility

The checkout API validates codes but doesn't create them. The admin API creates them but only if eligible.

---

## Decision 3: Feature-Sliced Design (FSD) Architecture

**Context:** We needed a folder structure that would scale with team growth and remain maintainable for a codebase of this nature.

**Options Considered:**
- **Option A:** MVC flat structure (`controllers/`, `models/`, `services/`)
- **Option B:** Feature-Sliced Design (`features/cart/`, `features/checkout/`, etc.)
- **Option C:** Domain-Driven Design (DDD with aggregates and bounded contexts)

**Choice:** Option B — Feature-Sliced Design

**Why:**
- **Cohesion**: All cart-related files live in `features/cart/`. A developer fixing a cart bug opens one folder.
- **Low coupling**: Features don't import from each other; shared utilities live in `shared/`.
- **Onboarding speed**: New developers can understand the system by browsing `features/`.
- DDD (Option C) would be over-engineered for a 4-API system.
- MVC (Option A) groups by technical role, not business domain — leads to "where does this logic go?" debates as the codebase grows.

---

## Decision 4: Zod for Runtime Validation

**Context:** Express doesn't validate `req.body` types at runtime. TypeScript types are erased at runtime. We needed a way to validate incoming payloads.

**Options Considered:**
- **Option A:** Manual validation in controllers (`if (!req.body.userId) ...`)
- **Option B:** Zod schema validation via middleware
- **Option C:** Joi or class-validator with decorators

**Choice:** Option B — Zod schema validation with a generic `validateBody()` middleware

**Why:**
- **Single source of truth**: The Zod schema in `*.types.ts` doubles as the TypeScript type definition (`z.infer<typeof Schema>`)
- **Zero boilerplate in controllers**: Validation errors are automatically caught and formatted by the global error handler
- **Composable**: `validateBody(Schema)` is a one-liner in any route
- Joi (Option C) doesn't integrate with TypeScript types as cleanly
- Manual validation (Option A) is error-prone and inconsistent across endpoints

---

## Decision 5: Configurable Discount Parameters via Environment Variables

**Context:** The discount threshold (nth order) and discount percentage are business rules that may change frequently. Hardcoding them would require a code deployment for every business change.

**Options Considered:**
- **Option A:** Hardcode `n=3` and `percent=10` in the discount service
- **Option B:** Accept `n` and `percent` as request body parameters in the admin API
- **Option C:** Read from environment variables via a central config module

**Choice:** Option C — Environment variables via `src/config/index.ts`

**Why:**
- **Zero-code changes** for business rule updates (just restart with new `.env`)
- **Separation of concerns**: Code doesn't know about business-specific values
- **Testable**: Tests can set `process.env` values before running
- Option B (API params) would create a security risk — anyone could change discount rates by calling the API
- `src/config/index.ts` is the only place `process.env` is accessed, keeping configuration centralised

---

## Decision 6: Sequential Order Numbers + UUID for Order IDs

**Context:** Orders need both a human-readable identifier (for customer-facing use) and a unique system ID.

**Options Considered:**
- **Option A:** UUID only
- **Option B:** Sequential integer only
- **Option C:** Both — UUID as system ID, sequential `orderNumber` for human display

**Choice:** Option C — UUID + sequential `orderNumber`

**Why:**
- **UUID** (`id`): globally unique, unguessable, safe for external APIs
- **orderNumber**: human-readable (e.g., "Order #3"), easily communicable (for support)
- The `orderNumber` also drives the nth-order discount logic cleanly (`Math.floor(orderNumber / n)`)
- Sequential numbers are predictable — not suitable as external identifiers (hence keeping UUID)

---

## Decision 7: Discount Code Format `DISC-XXXX-XXXX`

**Context:** Generated coupon codes need to be unique, human-typable, and unlikely to collide.

**Options Considered:**
- **Option A:** Random UUID (e.g., `550e8400-e29b-41d4-a716-446655440000`)
- **Option B:** Short alphanumeric code (e.g., `DISC-A3BF-9K2M`)
- **Option C:** Sequential codes (e.g., `CODE-001`, `CODE-002`)

**Choice:** Option B — `DISC-XXXX-XXXX` format using `crypto.randomBytes()`

**Why:**
- Human-typable (dashes as separators, no ambiguous characters)
- Cryptographically random — collision probability is negligible for this scale
- `crypto` is built into Node.js — no external dependency needed
- UUID (Option A) is too long for a coupon code UX
- Sequential codes (Option C) are guessable — users could try `CODE-004` when they have `CODE-003`
