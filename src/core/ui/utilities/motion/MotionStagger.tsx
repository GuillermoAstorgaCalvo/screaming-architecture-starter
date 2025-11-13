/**
 * MotionStagger - Staggered animation container
 *
 * A container component that animates its children with a stagger effect.
 * Useful for lists, grids, and other collections of items.
 *
 * @example
 * ```tsx
 * <MotionStagger>
 *   {items.map(item => (
 *     <motion.div key={item.id}>{item.name}</motion.div>
 *   ))}
 * </MotionStagger>
 * ```
 *
 * @example
 * ```tsx
 * <MotionStagger staggerDelay={0.15} delayChildren={0.2}>
 *   {children}
 * </MotionStagger>
 * ```
 */

import { type HTMLMotionProps, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

import type { MotionStaggerProps } from './motionTypes';
import { STATIC_VARIANTS } from './reducedMotionVariants';
import { staggerContainerVariants } from './staggerVariants';
import { type EffectiveMotionStrategy, useMotionConfig } from './useMotionConfig';

const MIN_REDUCED_DELAY = 0.05;

function createStaggerVariants(staggerDelay: number, delayChildren: number) {
	return {
		...staggerContainerVariants,
		visible: {
			...staggerContainerVariants['visible'],
			transition: {
				staggerChildren: staggerDelay,
				delayChildren,
			},
		},
	};
}

function getEffectiveDelays(
	strategy: EffectiveMotionStrategy,
	staggerDelay: number,
	delayChildren: number
) {
	if (strategy === 'fade') {
		return {
			staggerDelay: Math.min(staggerDelay, MIN_REDUCED_DELAY),
			delayChildren: Math.min(delayChildren, MIN_REDUCED_DELAY),
		};
	}

	return { staggerDelay, delayChildren };
}

/**
 * MotionStagger component
 */
export function MotionStagger({
	staggerDelay = 0.1,
	delayChildren = 0.1,
	className,
	children,
	reducedMotionStrategy = 'static',
	...props
}: Readonly<MotionStaggerProps>) {
	const { resolveReducedMotionStrategy } = useMotionConfig();
	const strategy = resolveReducedMotionStrategy(reducedMotionStrategy);

	const shouldSkip = strategy === 'skip' || strategy === 'static';
	const { staggerDelay: effectiveStaggerDelay, delayChildren: effectiveDelayChildren } =
		getEffectiveDelays(strategy, staggerDelay, delayChildren);

	if (shouldSkip) {
		return (
			<motion.div
				className={twMerge(className)}
				initial="visible"
				animate="visible"
				variants={STATIC_VARIANTS}
				{...props}
			>
				{children}
			</motion.div>
		);
	}

	const motionProps: HTMLMotionProps<'div'> = {
		initial: 'hidden',
		animate: 'visible',
		variants: createStaggerVariants(effectiveStaggerDelay, effectiveDelayChildren),
		...props,
	};

	return (
		<motion.div className={twMerge(className)} {...motionProps}>
			{children}
		</motion.div>
	);
}
