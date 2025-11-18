import { type RouteKey, ROUTES, type Routes } from '@core/config/routes';
import { describe, expect, expectTypeOf, it } from 'vitest';

describe('ROUTES configuration', () => {
	it('exposes the expected route definitions', () => {
		expect(ROUTES).toEqual({
			HOME: '/',
		});
	});

	it('ensures every route path starts with "/"', () => {
		const invalidEntries = Object.entries(ROUTES).filter(
			([, path]) => typeof path === 'string' && !path.startsWith('/')
		);

		expect(invalidEntries).toHaveLength(0);
	});

	it('provides fast helpers for accessing known paths', () => {
		expect(ROUTES.HOME).toBe('/');
	});
});

describe('routes typing', () => {
	it('exports the correct route keys', () => {
		expectTypeOf<RouteKey>().toEqualTypeOf<'HOME'>();
	});

	it('keeps the Routes shape aligned with the configuration', () => {
		expectTypeOf<Routes>().toEqualTypeOf<{
			readonly HOME: '/';
		}>();
	});
});
