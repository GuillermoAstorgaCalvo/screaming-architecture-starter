/**
 * Loadable utility functions
 *
 * Extracted to separate file for Fast Refresh compatibility.
 */

import { DefaultLoadingFallback } from '@core/ui/utilities/loadable/components/loadableFallback';
import { Loadable, type LoadableProps } from '@core/ui/utilities/loadable/loadable';
import type { ComponentProps, ComponentType } from 'react';

/** Create a loadable component with default loading fallback */
export function createLoadable<T extends ComponentType<unknown>>(
	loader: () => Promise<{ default: T }>
): ComponentType<LoadableProps & ComponentProps<T>> {
	return Loadable({
		loader,
		loading: () => DefaultLoadingFallback(),
	});
}
