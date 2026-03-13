# Radar Namespace Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an isolated `/api/radar/*` namespace with machine-oriented JSON responses, source-level metadata, and a minimal regression test suite without changing existing public source routes.

**Architecture:** Keep the current `/<source>` public routes intact and add a separate radar sub-app that reuses the existing route handlers through a shared source loader. Radar responses will wrap source handler output into a stable JSON envelope, add source-level metadata, normalize item fields, and return structured JSON errors for namespace routes only.

**Tech Stack:** Hono, TypeScript, tsx test runner, Node test runner, existing axios/Redis/NodeCache stack

---

### Task 1: Add failing tests for the new radar namespace

**Files:**
- Modify: `package.json`
- Create: `test/radar-app.test.ts`

**Step 1: Write the failing test**
- Add a `test` script using `tsx --test`.
- Create tests that assert:
  - `/api/radar/sources` returns JSON and includes known source ids.
  - `/api/radar/scan/:sourceId` returns source metadata and normalized items.
  - unknown source ids return a JSON 404 envelope.
  - loader failures return a JSON error envelope.

**Step 2: Run test to verify it fails**
- Run: `pnpm test`
- Expected: failing assertions because `/api/radar/*` does not exist yet.

**Step 3: Write minimal implementation**
- No production code yet beyond enough scaffolding to make tests compile if needed.

**Step 4: Run test to verify it still fails for the right reason**
- Run: `pnpm test`
- Expected: failures point to missing radar handlers/JSON contract, not syntax errors.

### Task 2: Extract shared source discovery and loader helpers

**Files:**
- Create: `src/lib/source-registry.ts`
- Modify: `src/registry.ts`

**Step 1: Write the failing test**
- Extend tests or add unit coverage if needed for deterministic source discovery with injected data.

**Step 2: Run test to verify it fails**
- Run: `pnpm test test/radar-app.test.ts`

**Step 3: Write minimal implementation**
- Move route file discovery and dynamic handler loading into a shared helper.
- Keep old `/<source>` route behavior unchanged by making `src/registry.ts` consume the helper.

**Step 4: Run test to verify it passes**
- Run: `pnpm test test/radar-app.test.ts`

### Task 3: Implement the radar sub-app and JSON envelope

**Files:**
- Create: `src/radar.ts`
- Create: `src/lib/radar-types.ts`
- Create: `src/lib/radar-normalizer.ts`
- Create: `src/lib/json-response.ts`
- Modify: `src/app.tsx`

**Step 1: Write the failing test**
- Extend tests for:
  - source-level metadata fields
  - item normalization fields
  - JSON `notFound` and `onError` handling inside radar namespace

**Step 2: Run test to verify it fails**
- Run: `pnpm test test/radar-app.test.ts`

**Step 3: Write minimal implementation**
- Mount a dedicated Hono app under `/api/radar`.
- Add `/sources`, `/health`, and `/scan/:sourceId`.
- Return structured JSON success/error envelopes for radar only.
- Measure request latency and map existing route output into source metadata.

**Step 4: Run test to verify it passes**
- Run: `pnpm test test/radar-app.test.ts`

### Task 4: Fix lint issues and add regression coverage for unchanged public routes

**Files:**
- Modify: `src/routes/huxiu.ts`
- Modify: `src/routes/weibo.ts`
- Create or Modify: `test/app-regression.test.ts`

**Step 1: Write the failing test**
- Add a regression test that `/all` still returns JSON and known route count structure.

**Step 2: Run test to verify it fails**
- Run: `pnpm test`

**Step 3: Write minimal implementation**
- Remove unused imports/params that currently fail lint.
- Keep existing public route behavior intact.

**Step 4: Run test to verify it passes**
- Run: `pnpm test`

### Task 5: Verify build, lint, and tests end-to-end

**Files:**
- No new code required unless verification reveals issues

**Step 1: Run verification**
- Run: `pnpm test`
- Run: `pnpm lint`
- Run: `pnpm build`

**Step 2: Inspect outputs**
- Confirm zero test failures, zero lint errors, successful compile.

**Step 3: Final manual smoke test**
- Run: `PORT=6690 pnpm start`
- Check: `curl http://localhost:6690/api/radar/sources`
- Check: `curl http://localhost:6690/all`
