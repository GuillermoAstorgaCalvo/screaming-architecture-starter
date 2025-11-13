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
import type { MotionDuration, MotionVariant, ReducedMotionStrategy } from './motionTypes';
import {
	REDUCED_FADE_VARIANTS,
	STATIC_VARIANTS,
	withInstantTransitions,
} from './reducedMotionVariants';
import { slideVariants } from './slideVariants';
import { type EffectiveMotionStrategy, useMotionConfig } from './useMotionConfig';

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
	/** Strategy when reduced motion is requested @default 'fade' */
	reducedMotionStrategy?: ReducedMotionStrategy;
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

function getRouteBaseVariants(strategy: EffectiveMotionStrategy, variant: MotionVariant) {
	if (strategy === 'skip') {
		return STATIC_VARIANTS;
	}
	if (strategy === 'fade') {
		return REDUCED_FADE_VARIANTS;
	}
	return getVariants(variant);
}

function getRouteVariants(
	strategy: EffectiveMotionStrategy,
	baseVariants: ReturnType<typeof getVariants>
) {
	return strategy === 'static' ? withInstantTransitions(baseVariants) : baseVariants;
}

function getRouteTransitionDuration(strategy: EffectiveMotionStrategy, duration: MotionDuration) {
	if (strategy === 'fade') {
		return 'micro';
	}
	if (strategy === 'static' || strategy === 'skip') {
		return 'instant';
	}
	return duration;
}

function getRouteTransitionDelay(strategy: EffectiveMotionStrategy) {
	return strategy === 'skip' || strategy === 'static' ? 0 : undefined;
}

function getRouteInitialState(strategy: EffectiveMotionStrategy): 'hidden' | 'visible' {
	return strategy === 'skip' ? 'visible' : 'hidden';
}

function resolveRouteStrategy(params: {
	strategy: EffectiveMotionStrategy;
	variant: MotionVariant;
	duration: MotionDuration;
	createTransition: ReturnType<typeof useMotionConfig>['createTransition'];
}) {
	const { strategy, variant, duration, createTransition } = params;

	const baseVariants = getRouteBaseVariants(strategy, variant);
	const variants = getRouteVariants(strategy, baseVariants);
	const transitionDuration = getRouteTransitionDuration(strategy, duration);
	const transitionDelay = getRouteTransitionDelay(strategy);
	const transitionOptions =
		transitionDelay === undefined
			? { duration: transitionDuration }
			: { duration: transitionDuration, delay: transitionDelay };
	const transition = createTransition(transitionOptions);

	const initialState = getRouteInitialState(strategy);

	return { variants, transition, initialState };
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
	reducedMotionStrategy = 'fade',
}: Readonly<RouteTransitionProps>) {
	const { createTransition, resolveReducedMotionStrategy } = useMotionConfig();
	const strategy = resolveReducedMotionStrategy(reducedMotionStrategy);
	const { variants, transition, initialState } = resolveRouteStrategy({
		strategy,
		variant,
		duration,
		createTransition,
	});

	return (
		<AnimatePresence mode={mode}>
			<motion.div
				key={locationKey}
				variants={variants}
				initial={initialState}
				animate="visible"
				exit="exit"
				transition={transition}
				className={twMerge('w-full', className)}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
