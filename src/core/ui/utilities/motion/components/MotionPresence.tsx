/**
 * MotionPresence - AnimatePresence + MotionBox convenience wrapper
 *
 * Provides a declarative API for toggling content with consistent motion
 * defaults and reduced-motion awareness.
 */

import { AnimatePresence } from '@core/ui/utilities/motion/components/AnimatePresence';
import { MotionBox } from '@core/ui/utilities/motion/MotionBox';
import type { MotionBoxProps } from '@core/ui/utilities/motion/types/motionTypes';
import { type Key, type ReactNode, useEffect, useReducer } from 'react';

/**
 * Props for MotionPresence component
 */
export interface MotionPresenceProps extends Omit<MotionBoxProps, 'children'> {
	/** Whether the content should be present */
	isPresent: boolean;
	/** Children to render when present */
	children: ReactNode;
	/** Unique key for presence transitions @default 'motion-presence' */
	presenceKey?: Key;
	/** AnimatePresence mode @default 'wait' */
	mode?: 'sync' | 'wait' | 'popLayout';
	/** Mount only when first shown @default true */
	mountOnEnter?: boolean;
	/** Remove node from tree when hidden @default true */
	unmountOnExit?: boolean;
	/** Animate on initial mount @default true */
	presenceInitial?: boolean;
}

/**
 * MotionPresence component
 */
export function MotionPresence({
	isPresent,
	children,
	presenceKey,
	mode = 'wait',
	mountOnEnter = true,
	unmountOnExit = true,
	presenceInitial = true,
	...motionBoxProps
}: Readonly<MotionPresenceProps>) {
	const shouldMount = [isPresent, !mountOnEnter, !unmountOnExit].some(Boolean);
	const shouldRender = [isPresent, !unmountOnExit].some(Boolean);

	const [hasMounted, markMounted] = useReducer(() => true, shouldMount);

	useEffect(() => {
		if (!hasMounted && shouldMount) {
			markMounted();
		}
	}, [hasMounted, shouldMount]);

	if (!hasMounted) {
		return null;
	}

	const resolvedPresenceKey = presenceKey ?? 'motion-presence';

	return (
		<AnimatePresence mode={mode} initial={presenceInitial}>
			{shouldRender ? (
				<MotionBox key={resolvedPresenceKey} {...motionBoxProps}>
					{children}
				</MotionBox>
			) : null}
		</AnimatePresence>
	);
}
