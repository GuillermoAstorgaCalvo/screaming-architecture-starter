/**
 * MotionSharedElement - Component for shared element transitions
 *
 * A wrapper component that enables shared element transitions using layoutId.
 * When two components share the same layoutId, Framer Motion will automatically
 * animate between them, creating smooth transitions.
 *
 * @example
 * ```tsx
 * // In a list view
 * <MotionSharedElement layoutId={`item-${item.id}`}>
 *   <Card>{item.title}</Card>
 * </MotionSharedElement>
 *
 * // In a detail view (same layoutId)
 * <MotionSharedElement layoutId={`item-${item.id}`}>
 *   <Card expanded>{item.title}</Card>
 * </MotionSharedElement>
 * ```
 *
 * @example
 * ```tsx
 * // Image gallery with shared transitions
 * <MotionSharedElement layoutId={`image-${imageId}`} layout>
 *   <img src={imageUrl} alt={imageAlt} />
 * </MotionSharedElement>
 * ```
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Props for MotionSharedElement
 */
export interface MotionSharedElementProps {
	/** Unique layout ID for shared element transition */
	layoutId: string;
	/** Children to animate */
	children: ReactNode;
	/** Enable layout animations @default true */
	layout?: boolean | 'position' | 'size' | 'preserve-aspect';
	/** Custom className */
	className?: string;
	/** Additional motion props */
	[key: string]: unknown;
}

/**
 * MotionSharedElement component
 *
 * Enables shared element transitions by wrapping children with a motion component
 * that has a layoutId. When navigating between views with the same layoutId,
 * Framer Motion will animate the transition.
 */
export function MotionSharedElement({
	layoutId,
	children,
	layout = true,
	className,
	...props
}: Readonly<MotionSharedElementProps>) {
	return (
		<motion.div layoutId={layoutId} layout={layout} className={className} {...props}>
			{children}
		</motion.div>
	);
}
