/**
 * Lazy-loaded MotionProvider wrapper
 *
 * Defers loading of framer-motion until MotionProvider is actually rendered.
 * This reduces initial bundle size by ~39KB gzipped.
 */

import { lazy, Suspense } from 'react';

import type { MotionProviderProps } from './MotionProvider';

const MotionProviderBase = lazy(() =>
	import('./MotionProvider').then(module => ({ default: module.MotionProvider }))
);

/**
 * Lazy MotionProvider component
 *
 * Wraps the MotionProvider in React.lazy to defer framer-motion loading.
 * This reduces initial bundle size by ~39KB gzipped.
 * Use this instead of MotionProvider when you want to lazy-load animations.
 */
export function LazyMotionProvider(props: Readonly<MotionProviderProps>) {
	return (
		<Suspense fallback={null}>
			<MotionProviderBase {...props} />
		</Suspense>
	);
}
