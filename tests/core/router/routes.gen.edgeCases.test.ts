import { ROUTES } from '@core/config/routes';
import { getRouteTemplate, isRouteKey, ROUTE_KEYS } from '@core/router/routes.gen';
import { describe, expect, it } from 'vitest';

import {
	buildRouteWithTemplate,
	TEMPLATE_USERS_ID,
	TEMPLATE_USERS_ID_OPTIONAL,
} from './routes.gen.test-utils';

const TEMPLATE_USERS_ID_SIMPLE = '/users/:id';
const TEMPLATE_USERS_ID_POSTS = '/users/:id/posts/:postId';
const EXPECTED_USERS_123 = '/users/123';

describe('routes.gen - edge cases', () => {
	describe('additional edge cases', () => {
		testAdditionalEdgeCases();
	});

	describe('parameter value types', () => {
		testParameterValueTypes();
	});

	describe('path normalization', () => {
		testPathNormalization();
	});

	describe('segment handling', () => {
		testSegmentHandling();
	});

	describe('error messages', () => {
		testErrorMessageDetails();
	});

	describe('concurrent usage', () => {
		testConcurrentUsage();
	});
});

function testAdditionalEdgeCases() {
	testAdditionalEdgeCasesOptionalParams();
	testAdditionalEdgeCasesComplexPaths();
	testAdditionalEdgeCasesTrailingSlashes();
}

function testAdditionalEdgeCasesOptionalParams() {
	it('should handle route with all optional params in middle', () => {
		const params = {};
		const result = buildRouteWithTemplate('/users/:id?/posts/:postId?/comments', params);
		expect(result).toBe('/users/posts/comments');
	});

	it('should handle route with optional param at start', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate('/:id?/users', params);
		expect(result).toBe('/123/users');
	});

	it('should handle route with optional param at end', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate('/users/:id?', params);
		expect(result).toBe(EXPECTED_USERS_123);
	});

	it('should handle route with optional param at end omitted', () => {
		const params = {};
		const result = buildRouteWithTemplate('/users/:id?', params);
		expect(result).toBe('/users');
	});

	it('should handle route with multiple consecutive optional params', () => {
		const params = { a: '1', b: '2' };
		const result = buildRouteWithTemplate('/path/:a?/:b?/:c?', params);
		expect(result).toBe('/path/1/2');
	});
}

function testAdditionalEdgeCasesComplexPaths() {
	it('should handle route with mixed required and optional in complex pattern', () => {
		const params = { userId: '123', postId: '456' };
		const result = buildRouteWithTemplate(
			'/users/:userId/posts/:postId?/comments/:commentId?',
			params
		);
		expect(result).toBe('/users/123/posts/456/comments');
	});

	it('should handle route with only required params in complex nested path', () => {
		const params = { org: 'acme', team: 'dev', project: 'web' };
		const result = buildRouteWithTemplate('/orgs/:org/teams/:team/projects/:project', params);
		expect(result).toBe('/orgs/acme/teams/dev/projects/web');
	});
}

function testAdditionalEdgeCasesTrailingSlashes() {
	it('should handle route template with trailing slash', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate('/users/:id/', params);
		expect(result).toBe(EXPECTED_USERS_123);
	});

	it('should handle route template with multiple trailing slashes', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate('/users/:id///', params);
		expect(result).toBe(EXPECTED_USERS_123);
	});
}

function testParameterValueTypes() {
	testParameterValueTypesPrimitives();
	testParameterValueTypesNumbers();
	testParameterValueTypesSpecial();
}

function testParameterValueTypesPrimitives() {
	it('should handle boolean true as parameter value', () => {
		const params = { id: String(true) };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/true');
	});

	it('should handle boolean false as parameter value', () => {
		const params = { id: String(false) };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/false');
	});

	it('should handle empty string as parameter value', () => {
		const params = { id: '' };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		// Empty string gets encoded but then filtered out as empty segment
		expect(result).toBe('/users');
	});

	it('should handle null as parameter value (converted to string)', () => {
		const params = { id: String(null) };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/null');
	});

	it('should handle undefined as parameter value for required param (should throw)', () => {
		const params = { id: undefined as unknown as string };
		expect(() => buildRouteWithTemplate(TEMPLATE_USERS_ID, params)).toThrow(
			/Missing required route param/
		);
	});

	it('should handle undefined as parameter value for optional param', () => {
		const params = { id: undefined };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID_OPTIONAL, params);
		expect(result).toBe('/users/posts');
	});
}

function testParameterValueTypesNumbers() {
	it('should handle negative numbers as parameter values', () => {
		const params = { id: -123 };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/-123');
	});

	it('should handle decimal numbers as parameter values', () => {
		const params = { id: 123.456 };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/123.456');
	});

	it('should handle very large numbers as parameter values', () => {
		const params = { id: Number.MAX_SAFE_INTEGER };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe(`/users/${Number.MAX_SAFE_INTEGER}`);
	});

	it('should handle scientific notation numbers as parameter values', () => {
		const params = { id: 1e10 };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/10000000000');
	});
}

function testParameterValueTypesSpecial() {
	it('should handle object toString() for parameter values', () => {
		const params = { id: { toString: () => 'custom-id' } as unknown as string };
		const result = buildRouteWithTemplate(TEMPLATE_USERS_ID, params);
		expect(result).toBe('/users/custom-id');
	});
}

function testPathNormalization() {
	it('should normalize path with single leading slash', () => {
		const params = {};
		const result = buildRouteWithTemplate('/path', params);
		expect(result).toBe('/path');
	});

	it('should normalize path with multiple leading slashes', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate('///users/:id', params);
		expect(result).toBe(EXPECTED_USERS_123);
	});

	it('should preserve path without leading slash', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate('users/:id', params);
		expect(result).toBe('users/123');
	});

	it('should handle path with only slashes', () => {
		const params = {};
		const result = buildRouteWithTemplate('///', params);
		expect(result).toBe('/');
	});

	it('should handle empty segments in middle of path', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate('/users//:id', params);
		expect(result).toBe(EXPECTED_USERS_123);
	});

	it('should handle path with all empty segments after filtering', () => {
		const params = {};
		const result = buildRouteWithTemplate('/:id?/:postId?', params);
		expect(result).toBe('/');
	});

	it('should handle path that becomes empty after filtering optional params', () => {
		const params = {};
		const result = buildRouteWithTemplate('/:id?', params);
		expect(result).toBe('/');
	});
}

function testSegmentHandling() {
	it('should handle segment with colon but not a param', () => {
		const params = {};
		const result = buildRouteWithTemplate('/users:invalid', params);
		// Should treat as literal segment since it doesn't match param pattern
		expect(result).toBe('/users:invalid');
	});

	it('should handle segment with colon at end', () => {
		const params = {};
		const result = buildRouteWithTemplate('/users:', params);
		expect(result).toBe('/users:');
	});

	it('should handle segment with question mark but not optional param', () => {
		const params = {};
		const result = buildRouteWithTemplate('/users?query', params);
		expect(result).toBe('/users?query');
	});

	it('should handle segment with special characters in literal part', () => {
		const params = { id: '123' };
		// Note: ':id-profile' doesn't match the param regex (^:\w+$)
		// because it has characters after the param name, so it's treated as literal
		const result = buildRouteWithTemplate('/users/:id-profile', params);
		expect(result).toBe('/users/:id-profile');
	});

	it('should handle segment with numbers in literal part', () => {
		const params = { id: '123' };
		const result = buildRouteWithTemplate('/users-v2/:id', params);
		expect(result).toBe('/users-v2/123');
	});

	it('should handle segment with underscores in param name', () => {
		const params = { user_id: '123' };
		const result = buildRouteWithTemplate('/users/:user_id', params);
		expect(result).toBe(EXPECTED_USERS_123);
	});

	it('should handle segment with hyphens in param name', () => {
		const params = { 'user-id': '123' };
		const result = buildRouteWithTemplate('/users/:user-id', params);
		// Note: \w+ regex doesn't match hyphens, so :user-id is not recognized as a param
		// The segment is treated as a literal string
		expect(result).toBe('/users/:user-id');
	});

	it('should handle very long segment names', () => {
		const longSegment = 'a'.repeat(100);
		const params = {};
		const result = buildRouteWithTemplate(`/${longSegment}`, params);
		expect(result).toBe(`/${longSegment}`);
	});

	it('should handle segment with unicode characters', () => {
		const params = {};
		const result = buildRouteWithTemplate('/用户/测试', params);
		expect(result).toBe('/用户/测试');
	});
}

function testErrorMessageDetails() {
	it('should include param name in error message', () => {
		const params = {};
		expect(() => buildRouteWithTemplate(TEMPLATE_USERS_ID_SIMPLE, params)).toThrow(
			/Missing required route param "id"/
		);
	});

	it('should include template in error message', () => {
		const params = {};
		const template = TEMPLATE_USERS_ID_SIMPLE;
		expect(() => buildRouteWithTemplate(template, params)).toThrow(
			new RegExp(`template "${template}"`)
		);
	});

	it('should provide clear error for missing first required param', () => {
		const params = {};
		expect(() => buildRouteWithTemplate(TEMPLATE_USERS_ID_POSTS, params)).toThrow(
			/Missing required route param "id"/
		);
	});

	it('should provide clear error for missing second required param', () => {
		const params = { id: '123' };
		expect(() => buildRouteWithTemplate(TEMPLATE_USERS_ID_POSTS, params)).toThrow(
			/Missing required route param "postId"/
		);
	});

	it('should provide error message with correct param name for complex paths', () => {
		const params = {};
		expect(() => buildRouteWithTemplate('/orgs/:orgId/teams/:teamId', params)).toThrow(
			/Missing required route param "orgId"/
		);
	});
}

function testConcurrentUsage() {
	it('should handle multiple route builds with same template', () => {
		const template = TEMPLATE_USERS_ID_SIMPLE;
		const results = [
			buildRouteWithTemplate(template, { id: '1' }),
			buildRouteWithTemplate(template, { id: '2' }),
			buildRouteWithTemplate(template, { id: '3' }),
		];
		expect(results).toEqual(['/users/1', '/users/2', '/users/3']);
	});

	it('should handle multiple route builds with different templates', () => {
		const results = [
			buildRouteWithTemplate(TEMPLATE_USERS_ID_SIMPLE, { id: '1' }),
			buildRouteWithTemplate('/posts/:postId', { postId: '2' }),
			buildRouteWithTemplate('/comments/:commentId', { commentId: '3' }),
		];
		expect(results).toEqual(['/users/1', '/posts/2', '/comments/3']);
	});

	it('should handle concurrent calls to getRouteTemplate', () => {
		const results = ROUTE_KEYS.map(key => getRouteTemplate(key));
		expect(results.length).toBe(ROUTE_KEYS.length);
		for (const [index, result] of results.entries()) {
			const key = ROUTE_KEYS[index];
			if (key) {
				expect(result).toBe(ROUTES[key]);
			}
		}
	});

	it('should handle concurrent calls to isRouteKey', () => {
		const testKeys = ['HOME', 'INVALID', 'ANOTHER_INVALID', ...ROUTE_KEYS];
		const results = testKeys.map(key => isRouteKey(key));
		expect(results[0]).toBe(true); // HOME
		expect(results[1]).toBe(false); // INVALID
		expect(results[2]).toBe(false); // ANOTHER_INVALID
		// All actual route keys should be true
		for (let i = 3; i < results.length; i++) {
			expect(results[i]).toBe(true);
		}
	});

	it('should handle building routes with shared param objects', () => {
		const sharedParams = { id: '123', postId: '456' };
		const results = [
			buildRouteWithTemplate(TEMPLATE_USERS_ID_SIMPLE, sharedParams),
			buildRouteWithTemplate('/posts/:postId', sharedParams),
			buildRouteWithTemplate(TEMPLATE_USERS_ID_POSTS, sharedParams),
		];
		expect(results).toEqual([EXPECTED_USERS_123, '/posts/456', '/users/123/posts/456']);
	});
}
