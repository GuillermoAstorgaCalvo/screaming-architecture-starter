/**
 * RouteTransition - Component for animating route changes
 *
 * Wraps route content with AnimatePresence and motion animations
 * to provide smooth transitions between routes.
 *
 * @example
 * ```tsx
 * const location = useLocation();
 *
 * <RouteTransition locationKey={location.pathname}>
 *   <Routes location={location}>
 *     <Route path="/" element={<HomePage />} />
 *     <Route path="/about" element={<AboutPage />} />
 *   </Routes>
 * </RouteTransition>
 * ```
 *
 * @example
 * ```tsx
 * <RouteTransition locationKey={location.pathname} variant="slide" duration="slow">
 *   <Routes location={location}>
 *     <Route path="/" element={<HomePage />} />
 *   </Routes>
 * </RouteTransition>
 * ```
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { AnimatePresence } from './AnimatePresence';
import { fadeVariants } from './fadeVariants';
import { motionDurations } from './motionConstants';
import type { MotionDuration, MotionVariant } from './motionTypes';
import { slideVariants } from './slideVariants';

/**
 * Props for RouteTransition component
 */
export interface RouteTransitionProps {
	/** Children to animate (typically Routes component) */
	children: ReactNode;
	/** Key to identify the current route (typically location.pathname) */
	locationKey: string;
	/** Animation variant @default 'fade' */
	variant?: MotionVariant;
	/** Animation duration @default 'normal' */
	duration?: MotionDuration;
	/** Custom className */
	className?: string;
	/** Animation mode for AnimatePresence @default 'wait' */
	mode?: 'sync' | 'wait' | 'popLayout';
}

/**
 * Get animation variants based on variant prop
 */
function getVariants(variant: MotionVariant) {
	switch (variant) {
		case 'slide':
		case 'slideRight':
		case 'slideTop':
		case 'slideBottom': {
			return slideVariants;
		}
		case 'fade':
		default: {
			return fadeVariants;
		}
	}
}

/**
 * RouteTransition component
 *
 * Provides smooth transitions between routes using Framer Motion.
 * Wraps route content with AnimatePresence and applies exit animations.
 */
export function RouteTransition({
	children,
	locationKey,
	variant = 'fade',
	duration = 'normal',
	className,
	mode = 'wait',
}: Readonly<RouteTransitionProps>) {
	const variants = getVariants(variant);
	const durationValue = motionDurations[duration];

	return (
		<AnimatePresence mode={mode}>
			<motion.div
				key={locationKey}
				variants={variants}
				initial="hidden"
				animate="visible"
				exit="exit"
				transition={{
					duration: durationValue,
				}}
				className={twMerge('w-full', className)}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
