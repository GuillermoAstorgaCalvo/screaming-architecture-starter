/**
 * MotionBox - Reusable animated div component
 *
 * A flexible motion component that wraps framer-motion's motion.div
 * with design token-aligned animations and variants.
 *
 * @example
 * ```tsx
 * <MotionBox variant="fade" duration="normal">
 *   <div>Content that fades in</div>
 * </MotionBox>
 * ```
 *
 * @example
 * ```tsx
 * <MotionBox
 *   variant="slide"
 *   duration="slow"
 *   delay={0.2}
 *   className="p-4"
 * >
 *   <div>Content that slides in from left</div>
 * </MotionBox>
 * ```
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { buildMotionProps } from './motionPropsHelpers';
import { getInitialState } from './motionStateHelpers';
import type { MotionBoxProps } from './motionTypes';
import { getMotionDuration, getMotionEasing } from './motionUtils';
import { getVariant } from './motionVariantHelpers';

/**
 * Render motion component configuration
 */
interface RenderMotionConfig {
	as: MotionBoxProps['as'];
	className: string | undefined;
	motionProps: ReturnType<typeof buildMotionProps>;
	children: ReactNode;
}

/**
 * Render motion component with appropriate element
 */
function renderMotionComponent(config: RenderMotionConfig) {
	const { as, className, motionProps, children } = config;
	if (!as) {
		return (
			<motion.div className={twMerge(className)} {...motionProps}>
				{children}
			</motion.div>
		);
	}

	// For custom elements, we need to cast to any due to TypeScript limitations
	// with dynamic component selection
	const CustomComponent = motion[as as keyof typeof motion] as typeof motion.div;
	return (
		<CustomComponent className={twMerge(className)} {...motionProps}>
			{children}
		</CustomComponent>
	);
}

/**
 * MotionBox component
 */
export function MotionBox({
	variant = 'fade',
	duration = 'normal',
	ease = 'ease-out',
	delay = 0,
	initial = false,
	repeat = false,
	repeatType = 'loop',
	className,
	children,
	as,
	...props
}: Readonly<MotionBoxProps>) {
	const variants = getVariant(variant);
	const customTransition = {
		duration: getMotionDuration(duration),
		ease: getMotionEasing(ease),
		delay,
	};
	const initialState = getInitialState(initial);
	const motionProps = buildMotionProps({
		variants,
		initialState,
		customTransition,
		repeat,
		repeatType,
		props,
	});

	return renderMotionComponent({ as, className, motionProps, children });
}
