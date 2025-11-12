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
import { staggerContainerVariants } from './motionVariants';

/**
 * MotionStagger component
 */
export function MotionStagger({
	staggerDelay = 0.1,
	delayChildren = 0.1,
	className,
	children,
	...props
}: Readonly<MotionStaggerProps>) {
	const motionProps: HTMLMotionProps<'div'> = {
		initial: 'hidden',
		animate: 'visible',
		variants: {
			...staggerContainerVariants,
			visible: {
				...staggerContainerVariants['visible'],
				transition: {
					staggerChildren: staggerDelay,
					delayChildren,
				},
			},
		},
		...props,
	};

	return (
		<motion.div className={twMerge(className)} {...motionProps}>
			{children}
		</motion.div>
	);
}
