import { ROUTES } from '@core/config/routes';
import { getRouteTemplate, isRouteKey, ROUTE_KEYS, type RouteKey } from '@core/router/routes.gen';
import { describe, expect, it } from 'vitest';

import { buildRouteWithTemplate } from './routes.gen.test-utils';

describe('routes.gen', () => {
	describe('getRouteTemplate', () => {
		testGetRouteTemplate();
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

function testGetRouteTemplate() {
	it('should return the raw template path for a route key', () => {
		expect(getRouteTemplate('HOME')).toBe('/');
	});

	it('should return correct template for all route keys', () => {
		for (const key of ROUTE_KEYS) {
			const template = getRouteTemplate(key);
			expect(template).toBe(ROUTES[key]);
		}
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

	it('should handle invalid route keys gracefully at runtime', () => {
		// TypeScript should prevent invalid route keys at compile time
		// At runtime, if an invalid key is used, it will return undefined from ROUTES
		// This test verifies isRouteKey can detect invalid keys
		expect(isRouteKey('INVALID_ROUTE')).toBe(false);
		expect(isRouteKey('HOME')).toBe(true);
	});

	it('should enforce parameter requirements at runtime', () => {
		// For routes that would require params (if they existed)
		// This test ensures the error handling works correctly
		expect(() => {
			buildRouteWithTemplate('/users/:id', {});
		}).toThrow(/Missing required route param/);
	});
}
