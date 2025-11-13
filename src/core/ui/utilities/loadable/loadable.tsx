/**
 * Loadable Component
 *
 * Code splitting wrapper around React.lazy and Suspense.
 * Provides a convenient way to lazy-load components with customizable loading fallbacks.
 *
 * @example
 * ```tsx
 * const MyPage = Loadable({
 *   loader: () => import('./MyPage'),
 *   loading: <Spinner />,
 * });
 * <Route path="/page" element={<MyPage />} />
 * ```
 */

import { type ComponentProps, type ComponentType, lazy, type ReactNode, Suspense } from 'react';

/** Props for Loadable component */
export interface LoadableProps {
	/** Component to render while loading (overrides default from options) */
	fallback?: ReactNode;
}

/** Options for creating a loadable component */
export interface LoadableOptions<T extends ComponentType<Record<string, unknown>>> {
	/** Function that returns a promise resolving to the component module */
	loader: () => Promise<{ default: T }>;
	/** Loading fallback component or element */
	loading?: ReactNode | (() => ReactNode);
}

/**
 * Create a loadable component with code splitting
 * @param options - Loadable options
 * @returns Component that can be used like a normal React component
 */
export function Loadable<T extends ComponentType<Record<string, unknown>>>(
	options: LoadableOptions<T>
): ComponentType<LoadableProps & ComponentProps<T>> {
	const { loader, loading = null } = options;
	const LazyComponent = lazy(loader);

	const getLoadingFallback = (): ReactNode => {
		if (typeof loading === 'function') {
			return loading();
		}
		return loading ?? null;
	};

	const LoadableComponent = (allProps: LoadableProps & ComponentProps<T>) => {
		const { fallback, ...rest } = allProps;
		const suspenseFallback = fallback ?? getLoadingFallback();
		// Type assertion needed because TypeScript cannot verify generic component props compatibility
		const props = rest as ComponentProps<T> as Record<string, unknown>;
		const TypedLazyComponent = LazyComponent as unknown as ComponentType<Record<string, unknown>>;

		return (
			<Suspense fallback={suspenseFallback}>
				<TypedLazyComponent {...props} />
			</Suspense>
		);
	};

	// Set display name for better debugging
	const lazyMeta = LazyComponent as { displayName?: string; name?: string } | null;
	if (lazyMeta) {
		const componentName = lazyMeta.displayName ?? lazyMeta.name ?? 'Loadable';
		LoadableComponent.displayName = `Loadable(${componentName})`;
	}

	return LoadableComponent;
}
