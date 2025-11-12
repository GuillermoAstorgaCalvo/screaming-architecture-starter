# src/types - Centralized TypeScript Types

This directory contains centralized TypeScript type definitions used across the application. Types are organized by concern to maintain clarity and reusability.

## Directory Structure

```
types/
├── api/              # API-related types
│   ├── index.ts     # Common API types
│   └── auth.ts      # Authentication API types
├── domains/         # Domain-specific types (shared across domains)
│   └── index.ts
├── callbacks.ts     # Callback function types
├── common.ts        # Common utility types
├── config.ts        # Configuration types
├── datetime.ts      # Date and time types
├── enums.ts         # Common enums
├── errors.ts        # Error handling types
├── forms.ts         # Form-related types
├── hooks.ts         # Hook return types
├── http.ts          # HTTP client types
├── layout.ts        # Layout and navigation types
├── pagination.ts    # Pagination types
├── ports.ts         # Port adapter types
├── react.ts         # React-related types (events, components)
├── result.ts        # Result/Either type utilities
├── router.ts        # Router and navigation types
├── ui/              # UI component types (organized by category)
│   ├── base.ts      # Base UI types
│   ├── buttons.ts   # Button and IconButton types
│   ├── data.ts      # Table and Pagination types
│   ├── feedback.ts  # Error, Helper, and feedback types
│   ├── forms.ts     # Input, Textarea, and Select types
│   ├── icons.ts     # Icon types
│   ├── layout.ts    # Layout and navigation types
│   ├── navigation.ts # Navigation component types
│   ├── overlays.ts  # Modal, Popover, Tooltip types
│   ├── theme.ts     # Theme types
│   └── typography.ts # Heading, Text types
└── README.md        # This file
```

## Type Organization Principles

### 1. **Separation by Concern**

Types are organized by their primary use case:

- `api/` - API requests, responses, error handling
- `forms.ts` - Form validation, field types, submission states
- `http.ts` - HTTP client configuration, interceptors, response types
- `hooks.ts` - Custom hook return types and options
- `ui/` - UI component prop types (organized by category: base, buttons, data, feedback, forms, icons, layout, navigation, overlays, theme, typography)

### 2. **Direct Imports**

All types must be imported directly from their source locations. Never use re-exports or barrel exports. Import types directly from their specific files (e.g., `@core/ports/HttpPort`).

### 3. **Domain-Specific Types**

Types that are only used within a single domain should remain co-located with that domain's code (e.g., `src/domains/landing/models/`). Only shared domain types belong in `types/domains/`.

### 4. **Utility Types**

Common utility types (branded types, partials, optionals) are centralized in `common.ts` for reuse across the codebase.

## Usage

Import types directly from their specific files:

```typescript
import type { PaginatedResponse } from '@src-types/pagination';
import type { UseAsyncReturn } from '@src-types/hooks';
import { AppEnvironment } from '@src-types/enums';
import type { HttpClientConfig } from '@core/ports/HttpPort';
```

**Note:** Always import types directly from their specific files. Never use barrel exports or re-exports. This prevents circular dependencies and maintains clear module boundaries.

## Type Categories

### API Types (`types/api/`)

- Standard API response/request structures
- Error response formats
- Authentication types
- Request/response metadata
- Zod schemas for shared API payloads (see `apiResponse.schemas.ts` and `auth.ts`)
- Domain-specific schemas should live alongside domain models and can reuse the shared factories from `@src-types/api`

### Callback Types (`types/callbacks.ts`)

- Callback function types
- Debounced and throttled function types
- Async/sync callback types
- Success/error/complete callback types
- Transform, predicate, filter, map callback types

### Common Types (`types/common.ts`)

- Utility type helpers (Optional, RequireFields, DeepPartial, DeepRequired, etc.)
- Function extraction types (ReturnType, Parameters, FirstParameter, etc.)
- Array and tuple utilities (ArrayElement, TupleToUnion, etc.)
- Readonly/mutable utilities (DeepReadonly, DeepMutable, Mutable)
- Record and key extraction types
- Branded types (UUID, Timestamp)
- Nullable and optional type utilities
- Type comparison utilities (IsEqual, AssertType)

### Config Types (`types/config.ts`)

- Application configuration types
- Environment variable types
- Runtime configuration types
- Feature flag types
- Configuration validation types

### Date/Time Types (`types/datetime.ts`)

- Date formatting and parsing types
- Timezone types
- Date range and time range types
- Duration types
- Relative time types
- Calendar date and time components

### Error Types (`types/errors.ts`)

- Base application error interface
- Validation error types
- API error types
- Network error types
- Authorization and authentication error types
- Error reporter interface
- Error type guards

### Form Types (`types/forms.ts`)

- Form field types
- Validation error structures
- Form submission states
- Import form-related types directly from `@core/forms/formAdapter`

### Hook Types (`types/hooks.ts`)

- Custom hook return types
- Hook option interfaces
- Import hook types directly from their hook implementations

### HTTP Types (`types/http.ts`)

- HTTP client configuration
- HTTP method and status code types
- Request/response interceptors
- Import HTTP types directly from `@core/ports/HttpPort`

### Layout Types (`types/layout.ts`)

- Navigation structures
- Layout configurations
- Responsive layout settings
- Page wrapper props

### Pagination Types (`types/pagination.ts`)

- Paginated response structures
- Pagination metadata
- Cursor-based pagination
- Pagination calculation utilities

### Port Types (`types/ports.ts`)

- Storage, Logger, HTTP port types
- Port adapter configurations
- Import port types directly from `@core/ports/`

### React Types (`types/react.ts`)

- React event handler types (mouse, keyboard, change, focus, etc.)
- React component utility types
- Common component prop interfaces
- Children and className prop helpers

### Result Types (`types/result.ts`)

- Result/Either type implementation
- Functional error handling utilities
- Type-safe error handling patterns

### Router Types (`types/router.ts`)

- Route and navigation types
- Route parameters and query parameters
- Route metadata types
- Navigation options and results
- Router context types

### UI Types (`types/ui/`)

- Component prop types organized by category:
  - `base.ts` - Base UI types
  - `buttons.ts` - Button and IconButton types
  - `data.ts` - Table and Pagination types
  - `feedback.ts` - Error, Helper, feedback types, Avatar, Badge, Skeleton, Spinner, and Progress types
  - `forms.ts` - Input, Textarea, and Select types
  - `icons.ts` - Icon types
  - `layout.ts` - Layout and navigation types
  - `navigation.ts` - Navigation component types
  - `overlays.ts` - Modal, Popover, Tooltip types
  - `theme.ts` - Theme types
  - `typography.ts` - Heading, Text types

## Best Practices

1. **Co-location**: Keep types close to where they're used when they're domain-specific
2. **Centralization**: Move types to `types/` when they're used across multiple domains or core features
3. **Direct Imports**: Always import types directly from their specific source files. Never use re-exports or barrel exports
4. **No Duplication**: If a type exists in another location, import it directly from there rather than duplicating it
5. **Documentation**: Add JSDoc comments to complex types and utility types
6. **Naming**: Use clear, descriptive names that indicate the type's purpose

## Adding New Types

1. **Determine scope**: Is this type used across domains or only within one?
2. **Choose location**:
   - Domain-specific → Keep in domain folder
   - Shared/Core → Add to appropriate `types/` file
3. **Import directly**: If a type exists elsewhere, import it directly from its source location rather than duplicating it
4. **Document**: Add JSDoc comments for public types
5. **No re-exports**: Always import from specific files, never use re-exports or barrel exports

## Examples

### Using Result Types

```typescript
import { ok, err, unwrapOr } from '@src-types/result';

const result = await toResult(fetchUser(userId));
const user = unwrapOr(result, defaultUser);
```

### Using Pagination Types

```typescript
import type { PaginatedResponse, PaginationParams } from '@src-types/pagination';

async function fetchUsers(params: PaginationParams): Promise<PaginatedResponse<User>> {
	// ...
}
```

### Using Hook Types

```typescript
import type { UseAsyncReturn } from '@src-types/hooks';

function MyComponent() {
	const { data, loading, execute }: UseAsyncReturn<User> = useAsync(fetchUser);
	// ...
}
```
