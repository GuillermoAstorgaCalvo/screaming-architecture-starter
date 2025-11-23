// Test constants and helper functions shared across route test files

export const TEMPLATE_USERS_ID = '/users/:id';
export const TEMPLATE_USERS_POSTS = '/users/:userId/posts/:postId';
export const TEMPLATE_USERS_ID_OPTIONAL = '/users/:id?/posts';
export const TEMPLATE_USERS_OPTIONAL_POSTS = '/users/:userId?/posts/:postId?';
export const TEMPLATE_USERS_POSTS_OPTIONAL = '/users/:userId/posts/:postId?';
export const TEMPLATE_USERS_NO_SLASH = 'users/:id';
export const EXPECTED_USERS_123_POSTS = '/users/123/posts';

export type RouteParamValue = string | number | undefined;
export type RouteParamMap = Record<string, RouteParamValue>;

// Helper function to test route building with custom templates
// This simulates the buildRoute functionality for testing parameter handling
export function buildRouteWithTemplate(template: string, params: RouteParamMap): string {
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
	// Match the actual implementation behavior
	return path.length > 0 ? `/${path}` : '/';
}
