/**
 * MotionAccordion - Height + opacity composite wrapper
 *
 * Combines MotionPresence with MotionBox to create an animated accordion panel
 * that respects reduced motion strategies.
 */

import { MotionPresence } from '@core/ui/utilities/motion/components/MotionPresence';
import type { MotionBoxProps } from '@core/ui/utilities/motion/types/motionTypes';
import type { Key, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Props for MotionAccordion component
 */
export interface MotionAccordionProps extends Omit<MotionBoxProps, 'children'> {
	/** Whether the accordion content is expanded */
	isOpen: boolean;
	/** Accordion body content */
	children: ReactNode;
	/** Optional wrapper className */
	className?: string;
	/** Optional inner content className */
	contentClassName?: string;
	/** Presence key to help AnimatePresence track instances */
	presenceKey?: Key;
	/** Mount accordion content only when first shown @default true */
	mountOnEnter?: boolean;
	/** Remove content from DOM when hidden @default true */
	unmountOnExit?: boolean;
}

/**
 * MotionAccordion component
 */
export function MotionAccordion({
	isOpen,
	children,
	className,
	contentClassName,
	presenceKey,
	mountOnEnter = true,
	unmountOnExit = true,
	variant = 'height',
	duration = 'normal',
	ease = 'ease-in-out',
	initial = 'hidden',
	reducedMotionStrategy = 'static',
	...motionBoxProps
}: Readonly<MotionAccordionProps>) {
	return (
		<MotionPresence
			isPresent={isOpen}
			presenceKey={presenceKey ?? 'motion-accordion'}
			mode="sync"
			mountOnEnter={mountOnEnter}
			unmountOnExit={unmountOnExit}
			variant={variant}
			duration={duration}
			ease={ease}
			initial={initial}
			className={twMerge('overflow-hidden', className)}
			reducedMotionStrategy={reducedMotionStrategy}
			{...motionBoxProps}
		>
			<div className={contentClassName}>{children}</div>
		</MotionPresence>
	);
}
