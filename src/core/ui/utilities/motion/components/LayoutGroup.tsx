/**
 * LayoutGroup - Wrapper for Framer Motion's LayoutGroup
 *
 * Provides a consistent interface for shared layout animations across
 * route boundaries and complex UI transitions.
 */

import { LayoutGroup as FramerLayoutGroup } from 'framer-motion';
import type { ComponentProps, ReactNode } from 'react';

/**
 * Props for LayoutGroup wrapper
 */
type FramerLayoutGroupProps = ComponentProps<typeof FramerLayoutGroup>;

export interface LayoutGroupProps extends Omit<FramerLayoutGroupProps, 'children'> {
	/** Animated children participating in the layout group */
	children: ReactNode;
}

/**
 * LayoutGroup wrapper component
 *
 * Groups layout-linked motion components so they can share transitions.
 */
export function LayoutGroup({ children, ...layoutGroupProps }: Readonly<LayoutGroupProps>) {
	return <FramerLayoutGroup {...layoutGroupProps}>{children}</FramerLayoutGroup>;
}
