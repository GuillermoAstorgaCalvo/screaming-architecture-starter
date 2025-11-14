# Route Protection and Guards

This guide explains how to protect routes using the `ProtectedRoute` component and route guard system.

## Overview

The route protection system provides:

- **Authentication Guards**: Require users to be authenticated
- **Permission Guards**: Require specific permissions
- **Custom Guards**: Create your own guard logic
- **Flexible Configuration**: Combine multiple guards with different requirements

## ProtectedRoute Component

The `ProtectedRoute` component wraps routes that require protection. It evaluates guards and either renders the protected content or redirects/renders a fallback.

### Basic Usage

```tsx
import { ProtectedRoute } from '@app/components/ProtectedRoute';
import { Route } from 'react-router-dom';

<Route
	path="/dashboard"
	element={
		<ProtectedRoute requireAuth>
			<DashboardPage />
		</ProtectedRoute>
	}
/>;
```

### Require Authentication

```tsx
<ProtectedRoute requireAuth>
	<DashboardPage />
</ProtectedRoute>
```

### Require Permissions

```tsx
<ProtectedRoute requireAuth permissions={['dashboard:read']} requireAllPermissions={true}>
	<DashboardPage />
</ProtectedRoute>
```

### Multiple Permissions (All Required)

```tsx
<ProtectedRoute
	requireAuth
	permissions={['dashboard:read', 'dashboard:write']}
	requireAllPermissions={true}
>
	<AdminDashboardPage />
</ProtectedRoute>
```

### Multiple Permissions (Any Required)

```tsx
<ProtectedRoute
	requireAuth
	permissions={['dashboard:read', 'reports:read']}
	requireAllPermissions={false}
>
	<ReportsPage />
</ProtectedRoute>
```

### Custom Redirect

```tsx
<ProtectedRoute requireAuth redirectTo="/login">
	<DashboardPage />
</ProtectedRoute>
```

### Custom Fallback UI

```tsx
<ProtectedRoute requireAuth fallback={<div>Access Denied</div>}>
	<DashboardPage />
</ProtectedRoute>
```

### Guest-Only Routes

```tsx
<ProtectedRoute requireAuth={false} allowGuests={true} redirectTo="/dashboard">
	<LoginPage />
</ProtectedRoute>
```

### Custom Guards

```tsx
import { authenticatedGuard, createPermissionGuard } from '@core/router/routes.guards';

const customGuard: RouteGuard = context => {
	if (context.roles.includes('admin')) {
		return { allowed: true };
	}
	return {
		allowed: false,
		reason: 'ADMIN_REQUIRED',
	};
};

<ProtectedRoute guards={[authenticatedGuard, customGuard, createPermissionGuard(['admin:access'])]}>
	<AdminPanelPage />
</ProtectedRoute>;
```

### Handling Denial

```tsx
<ProtectedRoute
	requireAuth
	permissions={['dashboard:read']}
	onDenied={({ result, failedGuard }) => {
		console.log('Access denied:', result.reason);
		if (result.missingPermissions) {
			console.log('Missing permissions:', result.missingPermissions);
		}
		// Log to analytics, show notification, etc.
	}}
>
	<DashboardPage />
</ProtectedRoute>
```

## Route Guards

Route guards are functions that evaluate whether access should be allowed based on the current authentication context.

### Built-in Guards

#### `authenticatedGuard`

Requires the user to be authenticated:

```tsx
import { authenticatedGuard } from '@core/router/routes.guards';

<ProtectedRoute guards={[authenticatedGuard]}>
	<DashboardPage />
</ProtectedRoute>;
```

#### `guestGuard`

Requires the user to NOT be authenticated (for login/register pages):

```tsx
import { guestGuard } from '@core/router/routes.guards';

<ProtectedRoute guards={[guestGuard]}>
	<LoginPage />
</ProtectedRoute>;
```

#### `createPermissionGuard`

Creates a guard that requires specific permissions:

```tsx
import { createPermissionGuard } from '@core/router/routes.guards';

// Require all permissions
const guard = createPermissionGuard(['dashboard:read', 'dashboard:write'], {
	requireAll: true,
});

// Require any permission
const guard = createPermissionGuard(['dashboard:read', 'reports:read'], {
	requireAll: false,
});

// Allow guests (don't require authentication)
const guard = createPermissionGuard(['public:read'], {
	allowGuests: true,
});

<ProtectedRoute guards={[guard]}>
	<DashboardPage />
</ProtectedRoute>;
```

### Custom Guards

Create custom guards for domain-specific logic:

```tsx
import type { RouteGuard, RouteGuardResult } from '@core/router/routes.guards';

const subscriptionGuard: RouteGuard = context => {
	// Check if user has active subscription
	// This would typically come from auth context or a store
	const hasActiveSubscription = checkSubscription(context);

	if (!hasActiveSubscription) {
		return {
			allowed: false,
			reason: 'SUBSCRIPTION_REQUIRED',
		};
	}

	return { allowed: true };
};

const roleGuard = (requiredRole: string): RouteGuard => {
	return context => {
		if (context.roles.includes(requiredRole)) {
			return { allowed: true };
		}

		return {
			allowed: false,
			reason: 'ROLE_REQUIRED',
			missingPermissions: [requiredRole],
		};
	};
};

<ProtectedRoute guards={[authenticatedGuard, subscriptionGuard, roleGuard('premium')]}>
	<PremiumFeaturesPage />
</ProtectedRoute>;
```

## Guard Evaluation

Guards are evaluated in order. If any guard denies access, evaluation stops and the route is protected.

### Guard Result

```ts
interface RouteGuardResult {
	readonly allowed: boolean;
	readonly reason?: string;
	readonly missingPermissions?: readonly string[];
}
```

### Guard Context

Guards receive the current authentication context:

```ts
interface RouteGuardContext {
	readonly isAuthenticated: boolean;
	readonly permissions: Permissions;
	readonly roles: readonly string[];
}
```

## Complete Example

```tsx
// app/router.tsx
import { ProtectedRoute } from '@app/components/ProtectedRoute';
import { authenticatedGuard, createPermissionGuard } from '@core/router/routes.guards';
import { Route, Routes } from 'react-router-dom';

export default function Router() {
	return (
		<Routes>
			{/* Public route */}
			<Route path="/" element={<HomePage />} />

			{/* Authenticated route */}
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute requireAuth redirectTo="/login">
						<DashboardPage />
					</ProtectedRoute>
				}
			/>

			{/* Permission-protected route */}
			<Route
				path="/admin"
				element={
					<ProtectedRoute
						requireAuth
						permissions={['admin:access']}
						redirectTo="/dashboard"
						onDenied={({ result }) => {
							console.log('Admin access denied:', result.reason);
						}}
					>
						<AdminPage />
					</ProtectedRoute>
				}
			/>

			{/* Custom guard route */}
			<Route
				path="/premium"
				element={
					<ProtectedRoute
						guards={[
							authenticatedGuard,
							createPermissionGuard(['premium:access']),
							subscriptionGuard,
						]}
						redirectTo="/upgrade"
					>
						<PremiumPage />
					</ProtectedRoute>
				}
			/>

			{/* Guest-only route */}
			<Route
				path="/login"
				element={
					<ProtectedRoute requireAuth={false} allowGuests={true} redirectTo="/dashboard">
						<LoginPage />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}
```

## Accessing Denial Information

When a route is denied, the redirect includes state with denial information:

```tsx
// In the redirect target component
import { useLocation } from 'react-router-dom';

function LoginPage() {
	const location = useLocation();
	const state = location.state as { from?: string; reason?: string; missingPermissions?: string[] };

	if (state?.reason) {
		console.log('Redirect reason:', state.reason);
		console.log('Original path:', state.from);
		console.log('Missing permissions:', state.missingPermissions);
	}

	return <div>Please log in to continue</div>;
}
```

## Best Practices

1. **Use `requireAuth` prop for simple authentication checks** - It's more readable than using `authenticatedGuard` directly

2. **Use `permissions` prop for simple permission checks** - It automatically creates a permission guard

3. **Use custom `guards` for complex logic** - When you need multiple guards or custom evaluation

4. **Provide meaningful fallbacks** - Use `fallback` prop for better UX instead of always redirecting

5. **Handle denial callbacks** - Use `onDenied` to log analytics, show notifications, etc.

6. **Co-locate guards with domains** - Create domain-specific guards in `domains/<domain>/guards/`

7. **Type your guards** - Use the `RouteGuard` type for type safety

## See Also

- `@app/components/ProtectedRoute` - ProtectedRoute component
- `@core/router/routes.guards` - Route guard utilities
- `@core/security/permissions` - Permission checking utilities
- `@core/providers/auth/useAuth` - Authentication context hook
