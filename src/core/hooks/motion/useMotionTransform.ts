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
	// Type assertion needed because TypeScript can't narrow the overloads properly
	// framer-motion's useTransform handles the runtime logic
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
	return useTransform(
		valueOrValues as never,
		inputOrTransform as never,
		output as never
	) as MotionValue<O>;
}
