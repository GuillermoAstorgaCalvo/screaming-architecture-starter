# Security Module

This module provides framework-agnostic security utilities for HTML sanitization, CSP (Content Security Policy), and permission management.

## Structure

- **`csp.ts`**: Content Security Policy helpers for generating nonces, hashes, and building CSP policies
- **`sanitizeHtml.ts`**: HTML sanitization utilities to prevent XSS attacks
- **`permissions.ts`**: Permission model helpers for managing and evaluating user permissions

## Usage

### Import Pattern

Import directly from the specific modules:

```ts
// ✅ Preferred - direct imports from specific modules
import { generateNonce } from '@core/security/csp';
import { escapeHtml } from '@core/security/sanitizeHtml';
import { hasPermission } from '@core/security/permissions';
```

### CSP (Content Security Policy)

Generate nonces and build CSP policies:

```ts
import { generateNonce, buildCSPPolicy, getRecommendedCSP } from '@core/security/csp';

// Generate a unique nonce per request
const nonce = generateNonce();

// Build a custom CSP policy
const policy = buildCSPPolicy(
	{
		'default-src': ["'self'"],
		'script-src': ["'self'", "'strict-dynamic'"],
		'style-src': ["'self'", "'unsafe-inline'"],
	},
	nonce
);

// Get recommended CSP (with Report-Only mode by default)
const recommendedPolicy = getRecommendedCSP({
	apiOrigin: 'https://api.example.com',
	enableReportOnly: true,
	reportUri: '/api/csp-report',
	nonce: generateNonce(),
});
```

### HTML Sanitization

Sanitize user-provided HTML to prevent XSS attacks:

```ts
import { escapeHtml, sanitizeHtml, sanitizeHtmlWithDOMPurify } from '@core/security/sanitizeHtml';

// Escaping HTML (safest option for plain text)
// SSR-safe: falls back to basic entity escaping in non-browser environments
const safe = escapeHtml(userInput);
// Use in JSX: <div>{safe}</div>

// Sanitizing HTML (when HTML is required)
// SSR-safe: falls back to escapeHtml in non-browser environments
const sanitized = sanitizeHtml(userHtmlInput, {
	allowedTags: ['p', 'strong', 'em', 'a'],
	allowedAttributes: {
		a: ['href', 'title'],
	},
});
// Use with dangerouslySetInnerHTML: <div dangerouslySetInnerHTML={{ __html: sanitized }} />

// Use DOMPurify if available (requires DOMPurify to be loaded separately)
// Falls back to basic sanitization if DOMPurify is not available
const sanitizedWithDOMPurify = sanitizeHtmlWithDOMPurify(userHtmlInput, {
	allowedTags: ['p', 'strong', 'em', 'a'],
});
```

**Note**: The HTML sanitization utilities are SSR-safe and will fall back to basic escaping in non-browser environments. For Node.js/server-side contexts with complex HTML, consider using dedicated server-side sanitization libraries.

### Permission Management

Manage and evaluate user permissions:

```ts
import {
	hasPermission,
	hasAllPermissions,
	hasAnyPermission,
	checkPermissions,
	getPermissionsFromRoles,
} from '@core/security/permissions';

// Define permissions
const permissions = {
	'article:read': true,
	'article:write': false,
	'user:admin': true,
};

// Check single permission
if (hasPermission(permissions, 'article:read')) {
	// User can read articles
}

// Check multiple permissions (AND)
if (hasAllPermissions(permissions, ['article:read', 'article:write'])) {
	// User has both permissions
}

// Check multiple permissions (OR)
if (hasAnyPermission(permissions, ['article:read', 'article:write'])) {
	// User has at least one permission
}

// Detailed permission check
const result = checkPermissions(permissions, ['article:write', 'article:delete'], true);
if (!result.allowed) {
	console.log('Missing permissions:', result.missing);
	console.log('Reason:', result.reason);
}

// Get permissions from roles
const rolePermissions = {
	editor: ['article:read', 'article:write'],
	admin: ['article:read', 'article:write', 'article:delete', 'user:admin'],
};

const userPermissions = getPermissionsFromRoles(['editor', 'admin'], rolePermissions);
```

## Security Principles

- **Least privilege**: Grant minimum necessary permissions
- **Fail securely**: Deny access when permission cannot be verified
- **Sanitize untrusted content**: Never render user-provided HTML without sanitization
- **CSP first**: Start with Report-Only mode before enforcing strict CSP policies

## See Also

- `.cursor/rules/security/security-privacy.mdc` - Security & privacy guidelines
- `.cursor/rules/security/threat-model.mdc` - Threat modeling checklist
