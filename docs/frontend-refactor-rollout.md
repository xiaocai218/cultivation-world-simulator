# Frontend Refactor Rollout

This document captures the rollout strategy for the 4-PR incremental delivery.

## PR1 - Boot Flow Refactor

### Scope
- Introduce `useAppBootFlow` and move startup state transitions out of `App.vue`.
- Keep root component focused on layout assembly and event wiring.

### Main files
- `web/src/composables/useAppBootFlow.ts`
- `web/src/App.vue`
- `web/src/__tests__/composables/useAppBootFlow.test.ts`

### Regression checks
- `npx vitest run src/__tests__/composables/useAppBootFlow.test.ts src/__tests__/composables/useGameInit.test.ts src/__tests__/composables/useGameControl.test.ts`

## PR2 - Store Boundary Cleanup

### Scope
- Move component dependencies from world-level proxy fields to domain stores (`avatar`, `event`, `map`).
- Keep compatibility proxies in `worldStore` for gradual migration and low-risk rollout.

### Main files
- `web/src/components/game/EntityLayer.vue`
- `web/src/components/game/MapLayer.vue`
- `web/src/components/game/CloudLayer.vue`
- `web/src/components/game/panels/EventPanel.vue`
- `web/src/components/layout/StatusBar.vue`
- `web/src/stores/world.ts`

### Regression checks
- `npx vitest run src/__tests__/stores/world.test.ts src/__tests__/components/game/MapLayer.test.ts src/__tests__/components/game/panels/EventPanel.test.ts`

## PR3 - Socket Router + API Mapper + Error Policy

### Scope
- Extract socket business routing into `socketMessageRouter`.
- Keep `api/socket.ts` as pure transport.
- Add API mappers and typed ranking/config normalization.
- Introduce centralized lightweight error helpers.

### Main files
- `web/src/stores/socket.ts`
- `web/src/stores/socketMessageRouter.ts`
- `web/src/api/mappers/event.ts`
- `web/src/api/mappers/world.ts`
- `web/src/api/modules/world.ts`
- `web/src/stores/map.ts`
- `web/src/stores/event.ts`
- `web/src/utils/appError.ts`

### Regression checks
- `npx vitest run src/__tests__/stores/socket.test.ts src/__tests__/stores/socketMessageRouter.test.ts src/__tests__/stores/world.test.ts src/__tests__/stores/system.test.ts`

## PR4 - Test Matrix + Performance Baseline

### Scope
- Expand behavior tests for startup flow and socket routing.
- Add lightweight performance baseline metrics for initialization and event timeline operations.

### Main files
- `web/src/composables/useGameInit.ts`
- `web/src/stores/event.ts`
- `web/src/__tests__/stores/event.test.ts`
- `web/src/__tests__/composables/useGameInit.test.ts`

### Regression checks
- `npx vitest run src/__tests__/stores/event.test.ts src/__tests__/composables/useGameInit.test.ts src/__tests__/components/game/panels/EventPanel.test.ts`

## Final full-suite checkpoint

- `npm run test -- --run`

Run this after PR4 is merged to confirm there is no integration regression across unrelated modules.

