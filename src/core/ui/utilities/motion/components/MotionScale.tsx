/**
 * MotionScale - Scale animation component
 *
 * A specialized motion component for scale animations.
 *
 * @example
 * ```tsx
 * <MotionScale>
 *   <div>Content that scales in</div>
 * </MotionScale>
 * ```
 *
 * @example
 * ```tsx
 * <MotionScale
 *   initialScale={0.8}
 *   finalScale={1}
 *   duration="slow"
 * >
 *   <div>Content with custom scale values</div>
 * </MotionScale>
 * ```
 */

import {
	extractRenderProps,
	extractRestProps,
} from '@core/ui/utilities/motion/helpers/MotionScale/propExtractors';
import { buildAllMotionProps } from '@core/ui/utilities/motion/helpers/MotionScale/scaleProps';
import type { MotionScaleProps } from '@core/ui/utilities/motion/types/motionTypes';
import { type HTMLMotionProps, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * MotionScale component
 */
export function MotionScale(props: Readonly<MotionScaleProps>) {
	const renderProps = extractRenderProps(props);
	const restProps = extractRestProps(props);
	const { motionProps, gestureProps } = buildAllMotionProps(props);

	const className = renderProps.className ? twMerge(renderProps.className) : undefined;

	return (
		<motion.div
			{...(className ? { className } : {})}
			{...motionProps}
			{...gestureProps}
			{...(restProps as unknown as HTMLMotionProps<'div'>)}
		>
			{renderProps.children}
		</motion.div>
	);
}
