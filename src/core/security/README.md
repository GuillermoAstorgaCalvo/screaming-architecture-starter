# Security Module

This module provides framework-agnostic security utilities for HTML sanitization, CSP (Content Security Policy), and permission management.

## Structure

- **`sanitize/`**: HTML sanitization utilities (XSS prevention):
  - **`sanitizeHtml.ts`**: Main sanitization functions (escapeHtml, sanitizeHtml)
  - **`sanitizeHtmlEscape.ts`**: HTML escaping utilities (escapeHtml function)
  - **`sanitizeHtmlDOMPurify.ts`**: DOMPurify integration (sanitizeHtmlWithDOMPurify function, isDOMPurifyAvailable, validateHtmlInput)
  - **`sanitizeHtmlConstants.ts`**: Constants and default configuration (MAX_HTML_LENGTH, MAX_ESCAPE_LENGTH, DEFAULT_CONFIG)
  - **`sanitizeHtmlTypes.ts`**: Type definitions (SanitizeConfig, DOMPurifyConfig, DOMPurifyAPI, WindowWithDOMPurify)
  - **`sanitizeHtmlHelpers.ts`**: Internal helper functions (mergeSanitizeConfig, removeDangerousElements, processElement)
- **`csp/`**: Content Security Policy helpers organized into focused modules:
  - **`types.ts`**: Type definitions (HashAlgorithm, CSPDirectives)
  - **`nonce.ts`**: Nonce generation and validation
  - **`hash.ts`**: Hash generation for inline content
  - **`policy.ts`**: Policy building, parsing, and recommended CSP (buildCSPPolicy, getRecommendedCSP, parseCSPPolicy)
  - **`helpers.ts`**: Internal helper functions for policy operations
  - **`cryptoUtils.ts`**: Shared crypto API utilities (internal)
- **`permissions/`**: Permission model helpers:
  - **`permissionsTypes.ts`**: Type definitions for the permission system
  - **`permissionsCheck.ts`**: Basic permission checking functions (hasPermission, hasAllPermissions, hasAnyPermission)
  - **`permissionsValidate.ts`**: Detailed permission validation with results (checkPermissions)
  - **`permissionsRoles.ts`**: Role-based permission management (getPermissionsFromRoles)
  - **`permissionsManipulate.ts`**: Permission manipulation utilities (mergePermissions, filterPermissions)
  - **`permissionsPattern.ts`**: Pattern matching with wildcards (matchesPattern, findPermissionsByPattern)

## Usage

### Import Pattern

Import directly from the specific modules:

```ts
// ✅ Preferred - direct imports from specific modules
import { generateNonce } from '@core/security/csp/nonce';
import { generateHash } from '@core/security/csp/hash';
import { buildCSPPolicy, getRecommendedCSP } from '@core/security/csp/policy';
import type { HashAlgorithm, CSPDirectives } from '@core/security/csp/types';
import { escapeHtml } from '@core/security/sanitize/sanitizeHtmlEscape';
import { sanitizeHtml } from '@core/security/sanitize/sanitizeHtml';
import { hasPermission } from '@core/security/permissions/permissionsCheck';
```

### CSP (Content Security Policy)

Generate nonces and build CSP policies:

```ts
import { generateNonce } from '@core/security/csp/nonce';
import { generateHash } from '@core/security/csp/hash';
import { buildCSPPolicy, getRecommendedCSP, parseCSPPolicy } from '@core/security/csp/policy';
import type { HashAlgorithm, CSPDirectives } from '@core/security/csp/types';

// Generate a unique nonce per request
const nonce = generateNonce();

// Generate hash for inline content (async)
const hash = await generateHash('console.log("hello");', 'sha256');

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

// Parse existing CSP policy string
const parsed = parseCSPPolicy("default-src 'self'; script-src 'self' 'nonce-abc'");
```

### HTML Sanitization

Sanitize user-provided HTML to prevent XSS attacks:

```ts
import { escapeHtml } from '@core/security/sanitize/sanitizeHtmlEscape';
import { sanitizeHtml } from '@core/security/sanitize/sanitizeHtml';
import { sanitizeHtmlWithDOMPurify } from '@core/security/sanitize/sanitizeHtmlDOMPurify';
```

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

````

**Note**: The HTML sanitization utilities are SSR-safe and will fall back to basic escaping in non-browser environments. For Node.js/server-side contexts with complex HTML, consider using dedicated server-side sanitization libraries.

### Permission Management

Manage and evaluate user permissions. Import directly from the specific modules:

```ts
// ✅ Preferred - direct imports from specific modules
import {
	hasPermission,
	hasAllPermissions,
	hasAnyPermission,
} from '@core/security/permissions/permissionsCheck';
import { checkPermissions } from '@core/security/permissions/permissionsValidate';
import { getPermissionsFromRoles } from '@core/security/permissions/permissionsRoles';
import { mergePermissions, filterPermissions } from '@core/security/permissions/permissionsManipulate';
import { matchesPattern, findPermissionsByPattern } from '@core/security/permissions/permissionsPattern';
import type {
	Permissions,
	PermissionCheckResult,
	PermissionRoles,
} from '@core/security/permissions/permissionsTypes';
````

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

// Merge permissions from multiple sources
const mergedPermissions = mergePermissions([permissions1, permissions2]);

// Filter permissions to only include those in the allowed list
const filteredPermissions = filterPermissions(permissions, ['article:read', 'article:write']);

// Check if permission matches pattern
if (matchesPattern('article:read', 'article:\*')) {
// Permission matches pattern
}

// Find permissions by pattern
const matchingPermissions = findPermissionsByPattern(permissions, 'article:\*');

```

## Security Principles

- **Least privilege**: Grant minimum necessary permissions
- **Fail securely**: Deny access when permission cannot be verified
- **Sanitize untrusted content**: Never render user-provided HTML without sanitization
- **CSP first**: Start with Report-Only mode before enforcing strict CSP policies

## See Also

- `.cursor/rules/security/security-privacy.mdc` - Security & privacy guidelines
- `.cursor/rules/security/threat-model.mdc` - Threat modeling checklist
```
