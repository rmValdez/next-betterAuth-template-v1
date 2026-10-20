# Frontend Template Rules & Agent Guidelines (`next-betterAuth-template-v1`)

## 1. Project Overview & Verified Dependencies (`package.json`)
This project is a modern **Next.js 15 (App Router) + React 19** template powered exclusively by **Better Auth** for client authentication and session management.

### Key Dependencies & Stack
- **Framework**: Next.js `15.5.x` (App Router) with React `19.2.x`
- **Authentication**: `better-auth` (`^1.7.7`) via `better-auth/react` client
- **Server State & Data Fetching**: `@tanstack/react-query` (`^5.101.x`)
- **Client & UI State**: `zustand` (`^5.0.x`)
- **Realtime**: `socket.io-client` (`^4.8.x`)
- **Validation**: `zod` (`^4.4.x`)
- **Styling & UI**: Tailwind CSS `v3.4.x`, `clsx`, `tailwind-merge`, `next-themes` (light/dark mode)
- **Animation & Feedback**: `framer-motion` (`^12.42.x`), `sonner` (`^1.7.x` toasts), `lucide-react`
- **Charts & Data**: `recharts` (`^3.9.x`)
- **Testing & Quality**: Vitest (`^3.2.x`), Playwright (`^1.52.x`), Storybook 8 (`^8.6.x`), ESLint 9

---

## Branching: Continuous Staging and On-Demand Main Synchronization

> This section takes precedence over any other branch or pull-request-target instruction in this file.
> `main` is this repository's production branch.

The development workflow is continuous and is not restricted to a daily schedule, a single task, or a fixed number of tasks.

- Before beginning a new development cycle, inspect the relationship between `main` and `staging` and synchronize them when necessary.
- All task branches must originate from the latest `staging`.
- Completed tasks must be submitted through PRs targeting `staging`.
- Developers may continue starting and completing additional tasks for as long as needed.
- Do not synchronize `staging` into `main` automatically after each task, after a fixed time interval, or simply because the day has ended.
- Synchronize `staging` into `main` only when the team explicitly decides that the accumulated changes are ready for delivery.
- Before synchronization, validate the combined changes and complete all required reviews and checks.
- Never merge unfinished or known-broken changes into `main`.
- After synchronization, verify the resulting branch state before continuing.
- **When a task is done, ask the user (the repository owner) whether it is all good.** The owner decides whether it merges and when `staging` is synchronized; an agent's own judgment is not approval.

**Workflow:** Establish baseline → Develop tasks → Merge completed tasks into staging → Continue working or synchronize to main when ready → Repeat.

`staging` is the continuous integration branch. `main` is updated on demand when the team chooses to deliver the accumulated changes.

```bash
# Start a task
git fetch origin
git log --oneline origin/main..origin/staging   # what staging has that main doesn't
git checkout staging && git pull
git checkout -b <type>/<short-description>      # feat/, fix/, docs/, test/, chore/ ...

# Finish a task: open a PR into staging (never into main)
gh pr create --base staging

# Deliver (only when the owner decides): one PR from staging into main
gh pr create --base main --head staging
```

## 2. Git Branching and Work Safety

### Inspect Before Editing
- Before making any changes, inspect `git status`, the current branch, and `git diff`.
- Check for uncommitted changes and understand whether they belong to the current task.
- Never discard, reset, clean, stash, or commit existing work without explicit authorization.

### Dedicated Branches Are Mandatory
- Before implementing a new feature, bug fix, refactor, optimization, or other code change, create or switch to a dedicated task branch.
- Never develop directly on `main`, `master`, or a shared integration branch.
- Use descriptive branch names:
  - `feat/<short-description>` - new features
  - `fix/<short-description>` - bug fixes
  - `perf/<short-description>` - performance improvements
  - `refactor/<short-description>` - refactoring
  - `docs/<short-description>` - documentation
  - `test/<short-description>` - tests

### Preserve Existing Work
- If the current branch contains unrelated uncommitted changes, do not automatically commit, stash, or move them.
- If the task can be safely isolated, create the task branch while preserving the existing working tree.
- If existing changes overlap with the requested task or their ownership is unclear, stop and ask for clarification before editing.
- Before switching branches, check whether doing so could carry uncommitted changes into another task.

### Branch Creation and Checkpoints
- Check whether the intended branch already exists before creating it.
- If it exists, inspect its status and history before deciding whether to reuse it.
- Never reset or overwrite an existing branch to make it match a preferred starting point.
- For risky or multi-step changes, establish a recoverable baseline when the working tree is clean and it is safe to do so. Do not commit unrelated changes to create a checkpoint.

### Completion
- Report the branch used in the task completion summary.
- Do not merge into protected or shared branches, push changes, or open a pull request unless requested or authorized by the project's workflow.

---

## 3. Architecture & Layer Boundaries (FAOS 3-Tier Pattern)
This repository enforces FAOS architecture via `pnpm validate` (`tools/validate-architecture.mjs`):

- **Shared Kernel (`src/shared/`)**:
  - Reusable UI design primitives (`@/shared/components/ui`), API configurations, utilities, and client wrappers (`auth-client.ts`, `http.ts`, `token.ts`).
  - **Strict rule**: Shared code must be purely deterministic. **Never import from `@/features/` or `@/app/` into `src/shared/`.**
- **Features Layer (`src/features/<feature>/`)**:
  - Encapsulates domain logic (`api/`, `components/`, `hooks/`, `types/`).
  - **Feature Isolation Rule**: Features must **never import from other features**. Cross-feature composition is strictly done in the `src/app/` layer.
- **App Layer (`src/app/`)**:
  - Handles Next.js App Router pages, layouts, and route handlers.
  - **Data discipline**: The `app/` layer cannot import `@tanstack/react-query` directly. It must strictly consume data hooks exported from the features layer (e.g., `useAuth()`, `useUsers()`).
- **Import Strategy**:
  - Forbidden: Deep relative imports (`../../...`).
  - Required: Absolute path aliases using `@/*` (`@/shared/*`, `@/features/*`, `@/app/*`).
- **Manifest Hygiene**: `feature.manifest.ts` is for tooling/documentation only and must never be imported into runtime code.

---

## 4. Authentication & Security (Better Auth Client Contract)
- **Authority**: The Node.js Express backend (`node-betterAuth-postg-template`) is the Single Source of Truth for authentication, user records, credentials, and session tokens.
- **Client Setup (`src/shared/lib/auth-client.ts`)**:
  - Initialized with `createAuthClient` from `better-auth/react`.
  - Configured with `baseURL: AUTH_BASE_URL` and `fetchOptions: { credentials: "include" }`.
  - Exports standard Better Auth helpers: `signIn`, `signUp`, `signOut`, `useSession`, `getSession`.
- **Session & Cookie Transport (`src/shared/lib/http.ts`)**:
  - Global `fetcher` passes `credentials: "include"`, ensuring `better-auth.session_token` cookies are automatically sent and received across origins.
  - Supports bearer fallback `Authorization: Bearer <token>` via `getToken()` in `src/shared/lib/token.ts`.
- **State Separation**:
  - **Auth State**: Consumed via `authClient.useSession()` and `useAuth()` hook.
  - **Server State**: Managed via `@tanstack/react-query` inside feature hooks (`useUsers`, etc.).
  - **Client UI State**: Managed via `zustand` stores for purely ephemeral client state (e.g. sidebar toggle).
- **Role Alignment (RBAC)**:
  - Aligned with backend Prisma `UserRole`: `SUPER_ADMIN`, `ADMIN`, `DEVELOPER`, `USER`.
  - Gate UI permissions using `authClient.useSession()` or dedicated gates (e.g., `<AdminGate>`).

---

## 5. Next.js 15 & React 19 Standards
- **Server vs. Client Components**:
  - Default to Server Components for layouts and non-interactive data displays.
  - Add `"use client"` only at leaf interactive components (forms, dialogs, buttons).
- **URL & Environment Resolution (`src/shared/config/api.ts`)**:
  - Backend API origin is derived dynamically from `NEXT_PUBLIC_API_URL`.
  - `NEXT_PUBLIC_AUTH_URL` and `NEXT_PUBLIC_SOCKET_SERVER_URL` fall back to the API origin automatically.
- **Forms & Validation**: Use `zod` schemas paired with controlled form inputs or React Hook Form.
- **Styling**: Tailwind CSS v3.4 + HSL semantic CSS variables (`bg-background`, `text-foreground`, `border-border`). Never use hardcoded arbitrary colors.

---

## 6. Testing & Code Quality
- **Unit & Component Tests**: Run with Vitest via `pnpm test`. Mock API calls with Vitest (`vi.fn()`, `vi.mock()`).
- **Type Checking**: Strict TypeScript (`pnpm type-check`). No unchecked `any` or `@ts-ignore` without explicit authorization.
- **E2E Testing**: Playwright test suites in `tests/e2e/` (`pnpm test:e2e`).
- **Component Workshop**: Storybook 8 configurations (`pnpm storybook`).
- **Honest Verification Reporting**: If any test, linter, or validation step fails, report the exact failure explicitly. **Never claim completion if `pnpm test`, `pnpm lint`, or `pnpm validate` fails.**

---

## 7. Pre-Completion Verification Checklist
Every task must execute the following 5 commands:
1. `pnpm validate` - FAOS layer boundary and import validation
2. `pnpm lint` - ESLint static code analysis
3. `pnpm type-check` - TypeScript compilation check (`tsc --noEmit`)
4. `pnpm test` - Vitest unit & component test suite
5. `pnpm build` - Next.js production build compilation check

**Reporting Requirements**: For each command, clearly categorize the result as:
- **Passed**: Clean execution.
- **Failed (Changes)**: Failed due to recent changes (must be resolved before completion).
- **Pre-existing Failure**: Unrelated failure that already existed before this task.
- **Blocked**: Cannot run due to missing environment variables or external dependencies.
*Never silently skip a check or misrepresent a blocked check as a pass.*

---

## 8. Mandatory Completion Report
Before concluding any task, provide a structured completion report with the following details:
- **Branch**: Dedicated branch used.
- **Changes**: Summary of what was implemented or resolved.
- **Files**: Key files created, modified, or removed.
- **Auth & Session Impact**: Better Auth client, cookie handling, or role gate implications.
- **Component & UI Impact**: New or updated components, design tokens, or state hooks.
- **Verification**: Exact status of checks (`Passed`, `Failed`, `Pre-existing`, `Blocked`).
- **Remaining Work**: Known limitations, follow-up items, or backend integration steps.

*Never declare a task complete when required verification remains unsuccessful or unperformed.*


## Git & GitHub Pull Request Workflow

### 1. Inspect Before Editing
- Run git status --short --branch, git branch --show-current, and git diff before modifying files.
- Check for uncommitted changes and verify whether they belong to your task.
- Never discard, reset, clean, stash, or silently relocate existing uncommitted work without explicit authorization.

### 2. Dedicated Task Branches Are Mandatory
- Never implement changes or commit directly on main, master, or a protected/shared integration branch.
- Create or switch to a dedicated branch before making changes:
  - eat/<short-description> - new features
  - ix/<short-description> - bug fixes
  - perf/<short-description> - performance improvements
  - 
efactor/<short-description> - code refactoring
  - docs/<short-description> - documentation updates
  - 	est/<short-description> - test additions or fixes
  - chore/<short-description> - tooling and dependencies

### 3. Staging and Secret Safety
- Stage only intended files. Never use blind git add . or git add -A without inspecting git diff --cached.
- Never commit .env, credentials, tokens, secret keys, or local build/cache artifacts.
- Keep pull requests focused, cohesive, and limited to the requested scope.

### 4. Verification Before Declaring Readiness
- Always run the repository's verification checks (tests, linter, type-check) before claiming work is complete.
- Never claim tests passed or checks succeeded without running them and inspecting the output.

### 5. Conventional Commits
- Use standard conventional commit format: <type>(<scope>): <imperative summary>
- Examples:
  - eat(auth): add session revocation endpoint
  - ix(routing): prevent race condition on route change
  - 	est(unit): add coverage for freshness classifier

### 6. Mandatory Completion Report
At the end of every task or PR preparation, provide a structured completion report:
- **Branch**: Dedicated branch used.
- **Changes**: Bulleted summary of implemented changes.
- **Files**: Key files created, modified, or removed.
- **Verification**: Exact test, lint, and build commands executed and their results.
- **Git Status**: Clean working tree confirmation and commit hash if committed.
- **Risks & Follow-ups**: Any open caveats, skipped checks, or remaining tasks.

