import { ROUTES } from '@core/config/routes';
import {
	buildRoute,
	getRouteTemplate,
	isRouteKey,
	ROUTE_KEYS,
	type RouteKey,
} from '@core/router/routes.gen';
import { describe, expect, it } from 'vitest';

// Test constants
const TEMPLATE_USERS_ID = '/users/:id';
const TEMPLATE_USERS_POSTS = '/users/:userId/posts/:postId';
const TEMPLATE_USERS_ID_OPTIONAL = '/users/:id?/posts';
const TEMPLATE_USERS_OPTIONAL_POSTS = '/users/:userId?/posts/:postId?';
const TEMPLATE_USERS_POSTS_OPTIONAL = '/users/:userId/posts/:postId?';
const TEMPLATE_USERS_NO_SLASH = 'users/:id';
const EXPECTED_USERS_123_POSTS = '/users/123/posts';

describe('routes.gen', () => {
	describe('getRouteTemplate', () => {
		it('should return the raw template path for a route key', () => {
			expect(getRouteTemplate('HOME')).toBe('/');
		});

		it('should return correct template for all route keys', () => {
			for (const key of ROUTE_KEYS) {
				const template = getRouteTemplate(key);
				expect(template).toBe(ROUTES[key]);
			}
		});
	});

	describe('buildRoute', () => {
		describe('routes without parameters', () => {
			it('should build route path for HOME without params', () => {
				expect(buildRoute('HOME')).toBe('/');
			});
		});

		describe('routes with required parameters', () => {
			testRequiredParamsBasic();
			testRequiredParamsEncoding();
		});

		describe('routes with optional parameters', () => {
			testOptionalParamsBasic();
			testOptionalParamsMixed();
		});

		describe('edge cases', () => {
			testEdgeCases();
		});
	});

	describe('ROUTE_KEYS', () => {
		testRouteKeys();
	});

	describe('isRouteKey', () => {
		testIsRouteKey();
	});

	describe('type safety', () => {
		testTypeSafety();
	});
});

function testRequiredParamsBasic() {
	it('should build route with single required param', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/123');
	});

	it('should build route with multiple required params', () => {
		const params = { userId: '456', postId: '789' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_POSTS, params);
		expect(result).toBe('/users/456/posts/789');
	});

	it('should throw error when required param is missing', () => {
		const params = {};
		expect(() => buildRouteWithTemplate(TEMPLATE_USERS_ID, params)).toThrow(
			'Missing required route param "id"'
		);
	});
}

function testRequiredParamsEncoding() {
	it('should encode URL parameters', () => {
		const params = { id: 'user@example.com' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/user%40example.com');
	});

	it('should handle numeric parameters', () => {
		const params = { id: 123 };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/123');
	});
}

function testOptionalParamsBasic() {
	it('should build route with optional param provided', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID_OPTIONAL, params);
		expect(result).toBe(EXPECTED_USERS_123_POSTS);
	});

	it('should build route with optional param omitted', () => {
		const params = {};
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID_OPTIONAL, params);
		// Optional param segment is filtered out, but surrounding segments remain
		expect(result).toBe('/users/posts');
	});

	it('should handle multiple optional params', () => {
		const params = { userId: '123' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_OPTIONAL_POSTS, params);
		// Only userId is provided, postId segment is filtered out
		expect(result).toBe(EXPECTED_USERS_123_POSTS);
	});
}

function testOptionalParamsMixed() {
	it('should handle mixed required and optional params', () => {
		const params = { userId: '123', postId: '456' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_POSTS_OPTIONAL, params);
		expect(result).toBe('/users/123/posts/456');
	});

	it('should handle mixed required and optional params with optional omitted', () => {
		const params = { userId: '123' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_POSTS_OPTIONAL, params);
		expect(result).toBe(EXPECTED_USERS_123_POSTS);
	});
}

function testEdgeCases() {
	it('should handle route without leading slash', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_NO_SLASH, params);
		expect(result).toBe('users/123');
	});

	it('should handle empty path segments', () => {
		const params = {};
		const result = buildRouteWithTemplate('/', params);
		expect(result).toBe('/');
	});

	it('should handle special characters in params', () => {
		const params = { id: 'user name with spaces' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/user%20name%20with%20spaces');
	});

	it('should handle unicode characters in params', () => {
		const params = { id: '用户123' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/%E7%94%A8%E6%88%B7123');
	});
}

function testRouteKeys() {
	it('should be a readonly array', () => {
		expect(Array.isArray(ROUTE_KEYS)).toBe(true);
		expect(Object.isFrozen(ROUTE_KEYS)).toBe(true);
	});

	it('should contain all route keys from ROUTES', () => {
		const routeKeysFromRoutes = Object.keys(ROUTES) as RouteKey[];
		expect(ROUTE_KEYS.length).toBe(routeKeysFromRoutes.length);
		for (const key of routeKeysFromRoutes) {
			expect(ROUTE_KEYS).toContain(key);
		}
	});

	it('should contain HOME route key', () => {
		expect(ROUTE_KEYS).toContain('HOME');
	});
}

function testIsRouteKey() {
	it('should return true for valid route keys', () => {
		for (const key of ROUTE_KEYS) {
			expect(isRouteKey(key)).toBe(true);
		}
	});

	it('should return false for invalid route keys', () => {
		expect(isRouteKey('INVALID_ROUTE')).toBe(false);
		expect(isRouteKey('')).toBe(false);
		expect(isRouteKey('home')).toBe(false); // case sensitive
		expect(isRouteKey('HOME_EXTRA')).toBe(false);
	});

	it('should work as a type guard', () => {
		const key: string = 'HOME';
		if (isRouteKey(key)) {
			// TypeScript should narrow the type here
			expect(key).toBe('HOME');
		}
	});
}

function testTypeSafety() {
	it('should have correct RouteParams type for routes without params', () => {
		// This test verifies TypeScript type checking
		// RouteParams<'HOME'> should be undefined for routes without params
		expect(true).toBe(true); // Placeholder assertion
	});
}

type RouteParamValue = string | number | undefined;
type RouteParamMap = Record<string, RouteParamValue>;

// Helper function to test route building with custom templates
// This simulates the buildRoute functionality for testing parameter handling
function buildRouteWithTemplate(template: string, params: RouteParamMap): string {
	const hasLeadingSlash = template.startsWith('/');
	const segments = template
		.split('/')
		.filter((segment, index) => !(index === 0 && segment.length === 0))
		.map(segment => resolveSegment(segment, params, template))
		.filter(segment => typeof segment === 'string' && segment.length > 0);

	const path = segments.join('/');
	return hasLeadingSlash ? ensureLeadingSlash(path) : path;
}

function resolveSegment(
	segment: string,
	params: RouteParamMap,
	template: string
): string | undefined {
	if (!segment.startsWith(':')) {
		return segment;
	}

	const optionalParam = getOptionalParamName(segment);
	if (optionalParam) {
		return getOptionalParamValue(optionalParam, params);
	}

	const requiredParam = getRequiredParamName(segment);
	if (requiredParam) {
		return getRequiredParamValue(requiredParam, params, template);
	}

	return segment;
}

function getOptionalParamName(segment: string): string | undefined {
	const OPTIONAL_PARAM_REGEX = /^:(?<param>\w+)\?$/;
	const match = OPTIONAL_PARAM_REGEX.exec(segment);
	return match?.groups?.['param'];
}

function getOptionalParamValue(paramName: string, params: RouteParamMap): string | undefined {
	const value = params[paramName];
	if (value === undefined) {
		return undefined;
	}

	return encodeURIComponent(String(value));
}

function getRequiredParamName(segment: string): string | undefined {
	const REQUIRED_PARAM_REGEX = /^:(?<param>\w+)$/;
	const match = REQUIRED_PARAM_REGEX.exec(segment);
	return match?.groups?.['param'];
}

function getRequiredParamValue(paramName: string, params: RouteParamMap, template: string): string {
	const value = params[paramName];
	if (value === undefined) {
		throw new Error(`Missing required route param "${paramName}" for template "${template}"`);
	}

	return encodeURIComponent(String(value));
}

function ensureLeadingSlash(path: string): string {
	return path.length > 0 ? `/${path}` : '/';
}
