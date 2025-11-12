import { ROUTES } from '@core/config/routes';

type RouteDefinitions = typeof ROUTES;
export type RouteKey = keyof RouteDefinitions;

type TrimOptional<S extends string> = S extends `${infer Param}?` ? Param : S;

type ExtractParamNames<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
	? TrimOptional<Param> | ExtractParamNames<`/${Rest}`>
	: Path extends `${string}:${infer Param}`
		? TrimOptional<Param>
		: never;

type ExtractOptionalParamNames<Path extends string> =
	Path extends `${string}:${infer Param}/${infer Rest}`
		?
				| (Param extends `${infer Optional}?` ? Optional : never)
				| ExtractOptionalParamNames<`/${Rest}`>
		: Path extends `${string}:${infer Param}`
			? Param extends `${infer Optional}?`
				? Optional
				: never
			: never;

type ParamObject<Path extends string> = [ExtractParamNames<Path>] extends [never]
	? undefined
	: Record<Exclude<ExtractParamNames<Path>, ExtractOptionalParamNames<Path>>, string | number> &
			Partial<Record<ExtractOptionalParamNames<Path>, string | number>>;

export type RouteParams<Key extends RouteKey> = ParamObject<RouteDefinitions[Key]>;

type BuildArgs<Key extends RouteKey> = RouteParams<Key> extends undefined ? [] : [RouteParams<Key>];

/**
 * Build a route path from the route key and params.
 * Ensures required params are provided and optional params can be omitted.
 */
type RouteParamValue = string | number | undefined;
type RouteParamMap = Record<string, RouteParamValue>;

export function buildRoute<Key extends RouteKey>(key: Key, ...args: BuildArgs<Key>): string {
	const params = (args[0] ?? {}) as RouteParamMap;
	const template = ROUTES[key];

	return compilePath(template, params);
}

/**
 * Returns the raw template path for a given route key.
 */
export function getRouteTemplate<Key extends RouteKey>(key: Key): RouteDefinitions[Key] {
	return ROUTES[key];
}

/**
 * Array of all available route keys.
 */
export const ROUTE_KEYS = Object.freeze(Object.keys(ROUTES)) as readonly RouteKey[];

/**
 * Runtime helper to determine if a value is a valid route key.
 */
export function isRouteKey(value: string): value is RouteKey {
	return ROUTE_KEYS.includes(value as RouteKey);
}

const OPTIONAL_PARAM_REGEX = /^:(?<param>\w+)\?$/;
const REQUIRED_PARAM_REGEX = /^:(?<param>\w+)$/;

function compilePath(template: string, params: RouteParamMap): string {
	const hasLeadingSlash = template.startsWith('/');
	const segments = getPathSegments(template)
		.map(segment => resolveSegment(segment, params, template))
		.filter(segment => isNonEmptyString(segment));

	const path = segments.join('/');
	return hasLeadingSlash ? ensureLeadingSlash(path) : path;
}

function getPathSegments(template: string): readonly string[] {
	return template.split('/').filter((segment, index) => !(index === 0 && segment.length === 0));
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

function isNonEmptyString(value: string | undefined): value is string {
	return typeof value === 'string' && value.length > 0;
}
