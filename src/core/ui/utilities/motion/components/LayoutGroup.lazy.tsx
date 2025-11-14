/**
 * Lazy-loaded LayoutGroup wrapper
 *
 * Defers loading of framer-motion until LayoutGroup is actually rendered.
 */

import { lazy, Suspense } from 'react';

import type { LayoutGroupProps } from './LayoutGroup';

const LayoutGroupBase = lazy(() =>
	import('./LayoutGroup').then(module => ({ default: module.LayoutGroup }))
);

/**
 * Lazy LayoutGroup component
 *
 * Wraps the LayoutGroup in React.lazy to defer framer-motion loading.
 * Use this instead of LayoutGroup when you want to lazy-load layout animations.
 */
export function LazyLayoutGroup(props: Readonly<LayoutGroupProps>) {
	return (
		<Suspense fallback={null}>
			<LayoutGroupBase {...props} />
		</Suspense>
	);
}
