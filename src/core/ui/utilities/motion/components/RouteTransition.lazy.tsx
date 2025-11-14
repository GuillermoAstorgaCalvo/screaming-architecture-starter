/**
 * Lazy-loaded RouteTransition wrapper
 *
 * Defers loading of framer-motion until RouteTransition is actually rendered.
 * This reduces initial bundle size by ~39KB gzipped.
 */

import { lazy, Suspense } from 'react';

import type { RouteTransitionProps } from './RouteTransition';

const RouteTransitionBase = lazy(() =>
	import('./RouteTransition').then(module => ({ default: module.RouteTransition }))
);

/**
 * Lazy RouteTransition component
 *
 * Wraps the RouteTransition in React.lazy to defer framer-motion loading.
 * This reduces initial bundle size by ~39KB gzipped.
 * Use this instead of RouteTransition when you want to lazy-load route animations.
 */
export function LazyRouteTransition(props: Readonly<RouteTransitionProps>) {
	return (
		<Suspense fallback={null}>
			<RouteTransitionBase {...props} />
		</Suspense>
	);
}
