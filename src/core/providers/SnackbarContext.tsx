import type { SnackbarItem } from '@core/ui/snackbar/snackbar.types';
import { createContext } from 'react';

export interface SnackbarContextValue {
	readonly snackbars: readonly SnackbarItem[];
	readonly addSnackbar: (snackbar: Omit<SnackbarItem, 'id'>) => string;
	readonly removeSnackbar: (id: string) => void;
	readonly clearAll: () => void;
}

export const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);
