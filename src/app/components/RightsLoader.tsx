import { useAuth } from '@core/providers/auth/useAuth';
import { useHttp } from '@core/providers/http/useHttp';
import { useLogger } from '@core/providers/logger/useLogger';
import { type ReactNode, useEffect, useState } from 'react';

interface RightsData {
	readonly permissions: readonly string[];
	readonly roles: readonly string[];
}

interface RightsLoaderProps {
	readonly children: ReactNode;
	readonly endpoint?: string;
	readonly fallback?: ReactNode;
	readonly onError?: (error: Error) => void;
}

interface LoadRightsParams {
	readonly auth: ReturnType<typeof useAuth>;
	readonly endpoint: string;
	readonly http: ReturnType<typeof useHttp>;
	readonly logger: ReturnType<typeof useLogger>;
	readonly onError: ((error: Error) => void) | undefined;
	readonly isMounted: { current: boolean };
	readonly setLoading: (loading: boolean) => void;
	readonly setError: (error: Error | null) => void;
}

async function loadRights({
	auth,
	endpoint,
	http,
	logger,
	onError,
	isMounted,
	setLoading,
	setError,
}: LoadRightsParams): Promise<void> {
	if (!auth.isAuthenticated) {
		if (isMounted.current) {
			setLoading(false);
		}
		return;
	}

	try {
		setLoading(true);
		setError(null);

		await http.get<RightsData>(endpoint);

		if (isMounted.current) {
			setLoading(false);
		}
	} catch (error_) {
		const loadError = error_ instanceof Error ? error_ : new Error('Failed to load rights');
		logger.error('RightsLoader: Failed to load rights', { error: loadError, endpoint });

		if (isMounted.current) {
			setError(loadError);
			setLoading(false);
			onError?.(loadError);
		}
	}
}

/**
 * RightsLoader - Loads user rights/permissions from API
 *
 * Fetches additional rights data from the API endpoint and provides
 * loading and error states. Renders children when rights are loaded.
 */
export function RightsLoader({
	children,
	endpoint = '/api/user/rights',
	fallback,
	onError,
}: Readonly<RightsLoaderProps>) {
	const auth = useAuth();
	const http = useHttp();
	const logger = useLogger();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const isMounted = { current: true };

		loadRights({
			auth,
			endpoint,
			http,
			logger,
			onError,
			isMounted,
			setLoading,
			setError,
		}).catch(error_ => {
			logger.error('RightsLoader: Unexpected error', { error: error_ });
		});

		return () => {
			isMounted.current = false;
		};
	}, [auth, endpoint, http, logger, onError]);

	if (loading || error || !auth.isAuthenticated) {
		return fallback ?? null;
	}

	return children;
}

RightsLoader.displayName = 'RightsLoader';
