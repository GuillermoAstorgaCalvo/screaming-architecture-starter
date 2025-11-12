import { UI_TIMEOUTS } from '@core/constants/timeouts';
import type { SnackbarItem } from '@core/ui/snackbar/snackbar.types';
import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { SnackbarContext, type SnackbarContextValue } from './SnackbarContext';

const BASE_36_RADIX = 36;
const RANDOM_ID_LENGTH = 7;
const RANDOM_ID_START_INDEX = 2;

interface SnackbarStateConfig {
	readonly maxSnackbars?: number;
	readonly defaultAutoDismiss?: boolean;
	readonly defaultDismissAfter?: number;
}

function useSnackbarState(config: SnackbarStateConfig) {
	const {
		maxSnackbars = 3,
		defaultAutoDismiss = true,
		defaultDismissAfter = UI_TIMEOUTS.TOAST_DELAY,
	} = config;
	const [snackbars, setSnackbars] = useState<readonly SnackbarItem[]>([]);

	const addSnackbar = useCallback(
		(snackbar: Omit<SnackbarItem, 'id'>): string => {
			const id = `snackbar-${Date.now()}-${Math.random()
				.toString(BASE_36_RADIX)
				.slice(RANDOM_ID_START_INDEX, RANDOM_ID_START_INDEX + RANDOM_ID_LENGTH)}`;
			const newSnackbar: SnackbarItem = {
				id,
				...snackbar,
				autoDismiss: snackbar.autoDismiss ?? defaultAutoDismiss,
				dismissAfter: snackbar.dismissAfter ?? defaultDismissAfter,
			};

			setSnackbars(prev => {
				const updated = [...prev, newSnackbar];
				return updated.slice(-maxSnackbars);
			});

			return id;
		},
		[maxSnackbars, defaultAutoDismiss, defaultDismissAfter]
	);

	const removeSnackbar = useCallback((id: string) => {
		setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
	}, []);

	const clearAll = useCallback(() => {
		setSnackbars([]);
	}, []);

	return { snackbars, addSnackbar, removeSnackbar, clearAll };
}

/**
 * SnackbarProvider - Provides snackbar notification queue management
 *
 * Manages a queue of snackbar notifications with automatic dismissal,
 * stacking, and positioning. Provides snackbar management functions
 * via the useSnackbar hook.
 *
 * @example
 * ```tsx
 * <SnackbarProvider>
 *   <App />
 * </SnackbarProvider>
 * ```
 */
export function SnackbarProvider({
	children,
	maxSnackbars = 3,
	defaultDismissAfter = UI_TIMEOUTS.TOAST_DELAY,
	defaultAutoDismiss = true,
}: {
	readonly children: ReactNode;
	readonly maxSnackbars?: number;
	readonly defaultDismissAfter?: number;
	readonly defaultAutoDismiss?: boolean;
}) {
	const { snackbars, addSnackbar, removeSnackbar, clearAll } = useSnackbarState({
		maxSnackbars,
		defaultAutoDismiss,
		defaultDismissAfter,
	});

	const value: SnackbarContextValue = useMemo(
		() => ({
			snackbars,
			addSnackbar,
			removeSnackbar,
			clearAll,
		}),
		[snackbars, addSnackbar, removeSnackbar, clearAll]
	);

	return <SnackbarContext.Provider value={value}>{children}</SnackbarContext.Provider>;
}

SnackbarProvider.displayName = 'SnackbarProvider';
