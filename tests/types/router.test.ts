import type {
	LocationState,
	NavigationOptions,
	NavigationResult,
	QueryParams,
	Route,
	RouteMeta,
	RouteParams,
	RouterContextValue,
	RouterLinkProps,
} from '@src-types/router';
import { describe, expect, it } from 'vitest';

const USER_DETAIL_PATH = '/users/:id';
const USER_DETAIL_NAME = 'user-detail';
const USER_PATH = '/users';
const USER_ID_PATH = '/users/123';

describe('router types', () => {
	describe('RouteParams', () => {
		it('should allow RouteParams with string values', () => {
			const params: RouteParams = {
				id: '123',
				name: 'test',
			};
			expect(params.id).toBe('123');
			expect(params.name).toBe('test');
		});

		it('should allow RouteParams with undefined values', () => {
			const params: RouteParams = {
				id: '123',
				name: undefined,
			};
			expect(params.id).toBe('123');
			expect(params.name).toBeUndefined();
		});
	});

	describe('QueryParams', () => {
		it('should allow QueryParams with string values', () => {
			const params: QueryParams = {
				search: 'test',
				page: '1',
			};
			expect(params.search).toBe('test');
			expect(params.page).toBe('1');
		});

		it('should allow QueryParams with string array values', () => {
			const params: QueryParams = {
				tags: ['tag1', 'tag2'],
			};
			expect(params.tags).toEqual(['tag1', 'tag2']);
		});

		it('should allow QueryParams with undefined values', () => {
			const params: QueryParams = {
				search: 'test',
				filter: undefined,
			};
			expect(params.search).toBe('test');
			expect(params.filter).toBeUndefined();
		});
	});

	describe('LocationState', () => {
		it('should allow LocationState with any values', () => {
			const state: LocationState = {
				from: '/previous',
				data: { key: 'value' },
				count: 42,
			};
			expect(state.from).toBe('/previous');
			expect(state.data).toEqual({ key: 'value' });
			expect(state.count).toBe(42);
		});
	});

	describe('RouteMeta', () => {
		it('should allow RouteMeta with all properties', () => {
			const meta: RouteMeta = {
				title: 'Page Title',
				description: 'Page Description',
				requiresAuth: true,
				permissions: ['read', 'write'],
				roles: ['admin', 'user'],
				indexable: true,
				customKey: 'custom value',
			};
			expect(meta.title).toBe('Page Title');
			expect(meta.description).toBe('Page Description');
			expect(meta.requiresAuth).toBe(true);
			expect(meta.permissions).toEqual(['read', 'write']);
			expect(meta.roles).toEqual(['admin', 'user']);
			expect(meta.indexable).toBe(true);
			expect(meta.customKey).toBe('custom value');
		});

		it('should allow RouteMeta without optional properties', () => {
			const meta: RouteMeta = {};
			expect(meta).toBeDefined();
		});
	});

	describe('Route', () => {
		it('should allow Route with all properties', () => {
			const route: Route = {
				path: USER_DETAIL_PATH,
				name: USER_DETAIL_NAME,
				meta: {
					title: 'User Detail',
				},
				params: { id: '123' },
				query: { tab: 'profile' },
				component: 'UserDetail',
				children: [],
			};
			expect(route.path).toBe(USER_DETAIL_PATH);
			expect(route.name).toBe(USER_DETAIL_NAME);
			expect(route.meta).toBeDefined();
			expect(route.params).toEqual({ id: '123' });
			expect(route.query).toEqual({ tab: 'profile' });
			expect(route.component).toBe('UserDetail');
			expect(route.children).toEqual([]);
		});

		it('should allow Route with nested children', () => {
			const route: Route = {
				path: USER_PATH,
				children: [
					{ path: USER_DETAIL_PATH, name: USER_DETAIL_NAME },
					{ path: '/users/:id/edit', name: 'user-edit' },
				],
			};
			expect(route.path).toBe(USER_PATH);
			expect(route.children).toHaveLength(2);
		});
	});

	describe('NavigationOptions', () => {
		it('should allow NavigationOptions with all properties', () => {
			const options: NavigationOptions = {
				replace: true,
				state: { from: '/previous' },
				reload: false,
			};
			expect(options.replace).toBe(true);
			expect(options.state).toEqual({ from: '/previous' });
			expect(options.reload).toBe(false);
		});

		it('should allow NavigationOptions without optional properties', () => {
			const options: NavigationOptions = {};
			expect(options).toBeDefined();
		});
	});

	describe('NavigationResult', () => {
		it('should allow NavigationResult with success', () => {
			const result: NavigationResult = {
				success: true,
			};
			expect(result.success).toBe(true);
			expect(result.error).toBeUndefined();
		});

		it('should allow NavigationResult with error', () => {
			const result: NavigationResult = {
				success: false,
				error: new Error('Navigation failed'),
			};
			expect(result.success).toBe(false);
			expect(result.error).toBeInstanceOf(Error);
		});
	});

	describe('RouterLinkProps', () => {
		it('should allow RouterLinkProps with all properties', () => {
			const options: NavigationOptions = {
				replace: true,
			};
			const props: RouterLinkProps = {
				to: USER_ID_PATH,
				children: 'User Link',
				isActive: true,
				className: 'active-link',
				navigationOptions: options,
			};
			expect(props.to).toBe(USER_ID_PATH);
			expect(props.children).toBe('User Link');
			expect(props.isActive).toBe(true);
			expect(props.className).toBe('active-link');
			expect(props.navigationOptions).toBeDefined();
		});

		it('should allow RouterLinkProps without optional properties', () => {
			const props: RouterLinkProps = {
				to: '/home',
			};
			expect(props.to).toBe('/home');
		});
	});

	describe('RouterContextValue', () => {
		it('should allow RouterContextValue with all properties', () => {
			const route: Route = {
				path: USER_DETAIL_PATH,
				name: USER_DETAIL_NAME,
			};
			const context: RouterContextValue = {
				currentRoute: route,
				pathname: USER_ID_PATH,
				query: { tab: 'profile' },
				params: { id: '123' },
				navigate: async (_to, _options) => {
					return { success: true };
				},
				goBack: () => {
					// go back
				},
				goForward: () => {
					// go forward
				},
				isActive: path => path === USER_ID_PATH,
			};
			expect(context.currentRoute).toBeDefined();
			expect(context.pathname).toBe(USER_ID_PATH);
			expect(context.query).toEqual({ tab: 'profile' });
			expect(context.params).toEqual({ id: '123' });
			expect(context.navigate).toBeDefined();
			expect(context.goBack).toBeDefined();
			expect(context.goForward).toBeDefined();
			expect(context.isActive).toBeDefined();
		});
	});
});
