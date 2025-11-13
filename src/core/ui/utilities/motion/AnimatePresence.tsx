/**
 * AnimatePresence - Wrapper for Framer Motion's AnimatePresence
 *
 * A wrapper component that provides a consistent interface for exit animations.
 * Wraps framer-motion's AnimatePresence with sensible defaults and type safety.
 *
 * @example
 * ```tsx
 * <AnimatePresence mode="wait">
 *   {isVisible && (
 *     <motion.div
 *       key="content"
 *       initial={{ opacity: 0 }}
 *       animate={{ opacity: 1 }}
 *       exit={{ opacity: 0 }}
 *     >
 *       Content
 *     </motion.div>
 *   )}
 * </AnimatePresence>
 * ```
 *
 * @example
 * ```tsx
 * <AnimatePresence mode="popLayout" initial={false}>
 *   {items.map(item => (
 *     <motion.div key={item.id} exit={{ opacity: 0 }}>
 *       {item.name}
 *     </motion.div>
 *   ))}
 * </AnimatePresence>
 * ```
 */

import {
	AnimatePresence as FramerAnimatePresence,
	type AnimatePresenceProps as FramerAnimatePresenceProps,
} from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Props for AnimatePresence wrapper
 */
export interface AnimatePresenceProps {
	/** Children to animate */
	children: ReactNode;
	/** Whether to show initial animation on mount @default true */
	initial?: boolean;
	/** Animation mode @default 'sync' */
	mode?: FramerAnimatePresenceProps['mode'];
}

/**
 * AnimatePresence wrapper component
 *
 * Provides exit animations for components that are removed from the React tree.
 * Must wrap motion components that have exit animations defined.
 */
export function AnimatePresence({
	children,
	initial = true,
	mode = 'sync',
}: Readonly<AnimatePresenceProps>) {
	return (
		<FramerAnimatePresence mode={mode} initial={initial}>
			{children}
		</FramerAnimatePresence>
	);
}
