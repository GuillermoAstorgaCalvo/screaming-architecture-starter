/**
 * Class names utility function
 *
 * A lightweight utility for conditionally joining class names together.
 * Similar to the popular `clsx` library but implemented as a zero-dependency utility.
 *
 * Framework Agnostic:
 * This utility is in `core/utils/` (not `core/lib/`) because it:
 * - Has no framework dependencies (works in any JavaScript context)
 * - Is a pure function with no side effects
 * - Can be used in Node.js, browser, tests, or any JS runtime
 *
 * See: src/core/README.md for distinction between `lib/` and `utils/`
 *
 * Useful for:
 * - Conditionally applying CSS classes
 * - Combining multiple class name sources
 * - Handling arrays and objects of class names
 *
 * @example
 * ```ts
 * // Simple strings
 * classNames('foo', 'bar'); // => 'foo bar'
 *
 * // Conditional classes
 * classNames('foo', isActive && 'active', isDisabled && 'disabled');
 * // => 'foo active' (if isActive is true, isDisabled is false)
 *
 * // Arrays
 * classNames(['foo', 'bar']); // => 'foo bar'
 *
 * // Objects (keys with truthy values are included)
 * classNames({ foo: true, bar: false, baz: true }); // => 'foo baz'
 *
 * // Mixed
 * classNames('foo', { bar: true }, ['baz']); // => 'foo bar baz'
 *
 * // Falsy values are ignored
 * classNames('foo', null, undefined, false, '', 0); // => 'foo'
 *
 * // Whitespace-only strings are filtered out
 * classNames('foo', '  ', '\t'); // => 'foo'
 * ```
 */

type ClassValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Record<string, boolean | null | undefined>
	| ClassValue[];

/**
 * Process string or number class value
 *
 * Filters out empty strings and whitespace-only strings.
 */
function processPrimitiveClass(input: string | number, classes: string[]): void {
	const classStr = String(input).trim();
	if (classStr) {
		classes.push(classStr);
	}
}

/**
 * Check if a value should be filtered out (not processed as a class name)
 */
function shouldFilterValue(value: ClassValue): boolean {
	// Filter out falsy values, booleans, and zero/NaN numbers
	return (
		!value ||
		typeof value === 'boolean' ||
		(typeof value === 'number' && (value === 0 || Number.isNaN(value)))
	);
}

/**
 * Process array class value
 */
function processArrayClass(input: ClassValue[], classes: string[]): void {
	const inner = classNames(...input);
	if (inner) {
		classes.push(inner);
	}
}

/**
 * Process a single class value
 *
 * Note: Booleans are in the type to support conditional patterns like `condition && 'class'`,
 * but standalone booleans (true/false) have no meaning as class names and are filtered out.
 */
function processClassValue(input: ClassValue, classes: string[]): void {
	if (shouldFilterValue(input)) {
		return;
	}

	const inputType = typeof input;
	if (inputType === 'string' || inputType === 'number') {
		processPrimitiveClass(input as string | number, classes);
		return;
	}

	if (Array.isArray(input)) {
		processArrayClass(input, classes);
		return;
	}

	// At this point, input must be an object (not null, already filtered)
	if (inputType === 'object') {
		processObjectClass(input as Record<string, boolean | null | undefined>, classes);
	}
}

/**
 * Process object-style class names
 *
 * Iterates over object keys and includes keys where the value is truthy.
 * Uses Object.hasOwn() to ensure we only check own properties, not inherited ones.
 */
function processObjectClass(
	input: Record<string, boolean | null | undefined>,
	classes: string[]
): void {
	for (const key in input) {
		if (Object.hasOwn(input, key) && input[key]) {
			classes.push(key);
		}
	}
}

/**
 * Conditionally join class names together
 *
 * @param inputs - Class names (strings, arrays, objects, or falsy values)
 * @returns A single string with all truthy class names joined by spaces
 */
export function classNames(...inputs: ClassValue[]): string {
	const classes: string[] = [];

	for (const input of inputs) {
		processClassValue(input, classes);
	}

	return classes.join(' ');
}
