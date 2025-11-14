# Router Utilities

This module provides type-safe route building utilities and route guard system for protecting routes.

## Structure

- `routes.gen.ts` - Type-safe route builder utilities generated from `@core/config/routes`
- `routes.guards.ts` - Route guard system for authentication and permission-based route protection

## Type-Safe Route Building

The `routes.gen.ts` file provides utilities for building type-safe routes from the central `ROUTES` configuration.

### Basic Usage

```ts
import { buildRoute } from '@core/router/routes.gen';
import { ROUTES } from '@core/config/routes';

// Simple route (no params)
const homeUrl = buildRoute('HOME'); // Returns: '/'

// Route with params
const userUrl = buildRoute('USER_DETAIL', { id: '123' }); // Returns: '/users/123'
```

### Available Functions

#### `buildRoute<Key>(key, params?)`

Builds a route path from a route key and optional parameters.

```ts
import { buildRoute } from '@core/router/routes.gen';

// Required params
const url = buildRoute('USER_DETAIL', { id: '123' });

// Optional params (can be omitted)
const url = buildRoute('USER_LIST', { page: 1 }); // page is optional
```

#### `getRouteTemplate<Key>(key)`

Returns the raw template path for a route key.

```ts
import { getRouteTemplate } from '@core/router/routes.gen';

const template = getRouteTemplate('USER_DETAIL'); // Returns: '/users/:id'
```

#### `isRouteKey(key)`

Type guard to check if a string is a valid route key.

```ts
import { isRouteKey } from '@core/router/routes.gen';

if (isRouteKey('USER_DETAIL')) {
	// TypeScript knows this is a valid RouteKey
}
```

#### `ROUTE_KEYS`

Array of all available route keys.

```ts
import { ROUTE_KEYS } from '@core/router/routes.gen';

ROUTE_KEYS.forEach(key => {
	console.log(key); // 'HOME', 'USER_DETAIL', etc.
});
```

### Type Safety

The route builder is fully type-safe:

```ts
import { buildRoute } from '@core/router/routes.gen';
import type { RouteParams } from '@core/router/routes.gen';

// ✅ TypeScript enforces required params
const url = buildRoute('USER_DETAIL', { id: '123' });

// ❌ TypeScript error - missing required param
const url = buildRoute('USER_DETAIL'); // Error: Argument of type '[]' is not assignable

// ✅ Optional params can be omitted
const url = buildRoute('USER_LIST'); // OK if page is optional

// ✅ Type-safe params object
const params: RouteParams<'USER_DETAIL'> = { id: '123' };
```

### Adding New Routes

1. Add route to `@core/config/routes.ts`:

```ts
export const ROUTES = {
	HOME: '/',
	USER_DETAIL: '/users/:id',
	USER_LIST: '/users',
	// Add your route here
	NEW_ROUTE: '/new-route/:param',
} as const;
```

2. The route builder utilities are automatically updated (no regeneration needed)

3. Use the new route:

```ts
const url = buildRoute('NEW_ROUTE', { param: 'value' });
```

### Route Parameters

Routes support required and optional parameters:

```ts
// Required param (no ?)
'/users/:id'; // Requires { id: string }

// Optional param (with ?)
'/users/:id?/posts'; // { id?: string } is optional

// Multiple params
'/users/:userId/posts/:postId'; // Requires { userId: string, postId: string }
```

## Route Guards

See [Route Protection Guide](../../../docs/routing-protection.md) for comprehensive documentation on route guards.

### Quick Reference

```ts
import { authenticatedGuard, guestGuard, createPermissionGuard } from '@core/router/routes.guards';

// Authentication guard (requires user to be authenticated)
const authGuard = authenticatedGuard;

// Guest-only guard (for login pages - redirects if already authenticated)
const guestOnlyGuard = guestGuard;

// Permission guard (requires specific permissions)
const permissionGuard = createPermissionGuard(['admin:access'], {
	requireAll: true,
	allowGuests: false,
});
```

## Best Practices

1. **Always use `buildRoute`** - Never hardcode route paths
2. **Use route keys** - Import `ROUTE_KEYS` for iteration or validation
3. **Type your params** - Use `RouteParams<Key>` for type safety
4. **Centralize routes** - All routes should be defined in `@core/config/routes.ts`

## See Also

- `@core/config/routes` - Central route definitions
- `@app/components/ProtectedRoute` - Route protection component
- [Route Protection Guide](../../../docs/routing-protection.md) - Comprehensive route guard documentation
