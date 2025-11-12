import { afterEach, describe, expect, it, vi } from 'vitest';

type TestRouteKey = 'HOME' | 'USER_DETAIL' | 'USER_POST';
type TestRouteParams = Record<string, string | number>;

interface TestRouterModule {
	readonly ROUTE_KEYS: readonly TestRouteKey[];
	buildRoute: (key: TestRouteKey, params?: TestRouteParams) => string;
	getRouteTemplate: (key: TestRouteKey) => string;
	isRouteKey: (value: string) => value is TestRouteKey;
}

describe('core/router/routes.gen', () => {
	afterEach(() => {
		vi.resetModules();
		vi.doUnmock('@core/config/routes');
	});

	it('builds routes with required and optional params', async () => {
		vi.doMock('@core/config/routes', () => ({
			ROUTES: {
				HOME: '/',
				USER_DETAIL: '/users/:id',
				USER_POST: '/users/:id/posts/:postId?',
			} as const,
		}));

		const { buildRoute, getRouteTemplate, isRouteKey, ROUTE_KEYS } = (await import(
			'@core/router/routes.gen'
		)) as unknown as TestRouterModule;

		expect(ROUTE_KEYS).toEqual(['HOME', 'USER_DETAIL', 'USER_POST']);

		expect(getRouteTemplate('HOME')).toBe('/');
		expect(buildRoute('HOME')).toBe('/');

		expect(getRouteTemplate('USER_DETAIL')).toBe('/users/:id');
		expect(buildRoute('USER_DETAIL', { id: 42 })).toBe('/users/42');

		expect(getRouteTemplate('USER_POST')).toBe('/users/:id/posts/:postId?');
		expect(buildRoute('USER_POST', { id: 7, postId: 12 })).toBe('/users/7/posts/12');
		expect(buildRoute('USER_POST', { id: 7 })).toBe('/users/7/posts');

		expect(() => buildRoute('USER_DETAIL')).toThrowError(
			'Missing required route param "id" for template "/users/:id"'
		);

		expect(isRouteKey('USER_POST')).toBe(true);
		expect(isRouteKey('UNKNOWN')).toBe(false);
	});
});
