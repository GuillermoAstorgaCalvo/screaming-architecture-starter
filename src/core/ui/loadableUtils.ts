/**
 * Loadable utility functions
 *
 * Extracted to separate file for Fast Refresh compatibility.
 */

import type { ComponentProps, ComponentType } from 'react';

import { Loadable, type LoadableProps } from './loadable';
import { DefaultLoadingFallback } from './loadableFallback';

/** Create a loadable component with default loading fallback */
export function createLoadable<T extends ComponentType<unknown>>(
	loader: () => Promise<{ default: T }>
): ComponentType<LoadableProps & ComponentProps<T>> {
	return Loadable({
		loader,
		loading: () => DefaultLoadingFallback(),
	});
}
