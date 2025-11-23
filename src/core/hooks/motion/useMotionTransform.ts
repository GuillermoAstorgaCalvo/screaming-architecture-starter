/**
 * useMotionTransform - Hook for transforming motion values
 *
 * Wraps framer-motion's useTransform to create derived motion values.
 * Transforms allow you to map one motion value to another using a function.
 *
 * @example
 * ```tsx
 * const scrollY = useMotionValue(0);
 * const opacity = useMotionTransform(scrollY, [0, 100], [1, 0]);
 *
 * return (
 *   <motion.div style={{ opacity }}>
 *     Content that fades as you scroll
 *   </motion.div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const progress = useMotionValue(0);
 * const scale = useMotionTransform(progress, [0, 1], [0.5, 1.5]);
 * const rotate = useMotionTransform(progress, (value) => value * 360);
 *
 * return (
 *   <motion.div style={{ scale, rotate }}>
 *     Animated content
 *   </motion.div>
 * );
 * ```
 */

/* eslint-disable no-redeclare -- TypeScript function overloads are valid */
import { type MotionValue, useTransform } from 'framer-motion';

/**
 * Transform a motion value using input/output ranges
 */
export function useMotionTransform<O>(
	value: MotionValue<number>,
	input: number[],
	output: O[]
): MotionValue<O>;

/**
 * Transform a motion value using a custom transform function
 */
export function useMotionTransform<O>(
	value: MotionValue<number>,
	transform: (value: number) => O
): MotionValue<O>;

/**
 * Transform multiple motion values
 */
export function useMotionTransform<O>(
	values: MotionValue<number>[],
	transform: (...values: number[]) => O
): MotionValue<O>;

// Implementation - useTransform handles overloads internally
export function useMotionTransform<O>(
	valueOrValues: MotionValue<number> | MotionValue<number>[],
	inputOrTransform: number[] | ((...values: number[]) => O),
	output?: O[]
): MotionValue<O> {
	// TypeScript cannot narrow union types in parameters to match function overloads.
	// When wrapping a library function with complex overloads (like framer-motion's useTransform),
	// we must use type assertions. The `as never` pattern is a standard workaround that allows
	// passing union types to functions with multiple overloads.
	//
	// Why this is safe:
	// 1. Our overload signatures ensure callers provide correct types at compile time
	// 2. framer-motion's useTransform validates and dispatches correctly at runtime
	// 3. This is a well-established pattern for library wrapper functions
	//
	// Alternative approaches considered:
	// - Runtime type checks: Violates React's Rules of Hooks (hooks must be called unconditionally)
	// - Separate functions: Would break the API and reduce type safety
	// - @ts-expect-error: TypeScript doesn't error here, so this wouldn't work
	//
	// The ESLint disable is necessary because the rule correctly identifies this as "unnecessary"
	// from a type system perspective, but it's actually necessary for overload resolution to work.
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
	return useTransform(
		valueOrValues as never,
		inputOrTransform as never,
		output as never
	) as MotionValue<O>;
}
