import type { AnalyticsInitOptions, AnalyticsPort } from '@core/ports/AnalyticsPort';
import { AnalyticsContext } from '@core/providers/analytics/AnalyticsContext';
import { type ReactNode, useEffect, useMemo, useRef } from 'react';

function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
	return Boolean(value) && typeof (value as PromiseLike<T>).then === 'function';
}

interface SerializedConfigRef {
	current: string | null;
}

function prepareInitialization(
	serializedConfigRef: SerializedConfigRef,
	config: AnalyticsInitOptions | null | undefined
): config is AnalyticsInitOptions {
	if (!config) {
		serializedConfigRef.current = null;
		return false;
	}

	const serializedConfig = JSON.stringify(config);
	if (serializedConfigRef.current === serializedConfig) {
		return false;
	}

	serializedConfigRef.current = serializedConfig;
	return true;
}

interface ExecuteInitializeParams {
	readonly initialize: NonNullable<AnalyticsPort['initialize']>;
	readonly analytics: AnalyticsPort;
	readonly config: AnalyticsInitOptions;
	readonly onError: (error: unknown) => void;
}

function createInitializationErrorHandler(
	serializedConfigRef: SerializedConfigRef,
	isMounted: () => boolean
) {
	return (error: unknown) => {
		console.warn('Failed to initialize analytics provider', error);
		if (isMounted()) {
			serializedConfigRef.current = null;
		}
	};
}

function executeInitialize({ initialize, analytics, config, onError }: ExecuteInitializeParams) {
	try {
		const result = initialize.call(analytics, config);
		if (isPromiseLike<void>(result)) {
			result.catch(onError);
		}
	} catch (error) {
		onError(error);
	}
}

export interface AnalyticsProviderProps {
	readonly analytics: AnalyticsPort;
	readonly children: ReactNode;
	readonly config?: AnalyticsInitOptions | null;
}

/**
 * AnalyticsProvider - Provides AnalyticsPort instance to the component tree
 *
 * The analytics implementation is injected at the app level (infrastructure layer).
 * This provider optionally runs initialization when configuration is provided
 * (e.g., measurement ID for Google Analytics) and exposes the port via context.
 */
function useAnalyticsInitialization(
	analytics: AnalyticsPort,
	config: AnalyticsInitOptions | null | undefined
) {
	const serializedConfigRef = useRef<string | null>(null);

	useEffect(() => {
		if (!prepareInitialization(serializedConfigRef, config)) {
			return;
		}

		const { initialize } = analytics;
		if (typeof initialize !== 'function') {
			return;
		}

		let isMounted = true;
		const handleError = createInitializationErrorHandler(serializedConfigRef, () => isMounted);

		executeInitialize({
			initialize,
			analytics,
			config,
			onError: handleError,
		});

		return () => {
			isMounted = false;
		};
	}, [analytics, config]);
}

export function AnalyticsProvider({ analytics, children, config }: AnalyticsProviderProps) {
	useAnalyticsInitialization(analytics, config);

	const value = useMemo(() => analytics, [analytics]);

	return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

AnalyticsProvider.displayName = 'AnalyticsProvider';
