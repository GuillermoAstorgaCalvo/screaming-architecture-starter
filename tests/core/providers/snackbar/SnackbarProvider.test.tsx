import { UI_TIMEOUTS } from '@core/constants/timeouts';
import { SnackbarContext } from '@core/providers/snackbar/SnackbarContext';
import { SnackbarProvider } from '@core/providers/snackbar/SnackbarProvider';
import { useSnackbar } from '@core/providers/snackbar/useSnackbar';
import { act, renderHook } from '@testing-library/react';
import { type ComponentProps, type ReactNode, useContext } from 'react';
import { describe, expect, it } from 'vitest';

type SnackbarProviderConfig = Omit<ComponentProps<typeof SnackbarProvider>, 'children'>;

const createWrapper = (config?: SnackbarProviderConfig) => {
	const SnackbarProviderTestWrapper = ({ children }: { children: ReactNode }) => (
		<SnackbarProvider {...config}>{children}</SnackbarProvider>
	);
	SnackbarProviderTestWrapper.displayName = 'SnackbarProviderTestWrapper';
	return SnackbarProviderTestWrapper;
};

describe('SnackbarProvider context', () => {
	it('provides snackbar management functions to descendants', () => {
		const { result } = renderHook(() => useContext(SnackbarContext), {
			wrapper: createWrapper(),
		});

		expect(result.current).toBeDefined();
		expect(result.current?.snackbars).toEqual([]);
		expect(typeof result.current?.addSnackbar).toBe('function');
		expect(typeof result.current?.removeSnackbar).toBe('function');
		expect(typeof result.current?.clearAll).toBe('function');
	});

	it('adds snackbars with generated ids and default options', () => {
		const { result } = renderHook(() => useContext(SnackbarContext), {
			wrapper: createWrapper(),
		});

		let snackbarId: string | undefined;
		act(() => {
			snackbarId = result.current?.addSnackbar({ intent: 'info', message: 'Hello world' });
		});

		expect(result.current?.snackbars).toHaveLength(1);
		const [snackbar] = result.current?.snackbars ?? [];
		expect(snackbar?.id).toBe(snackbarId);
		expect(snackbar?.message).toBe('Hello world');
		expect(snackbar?.intent).toBe('info');
		expect(snackbar?.autoDismiss).toBe(true);
		expect(snackbar?.dismissAfter).toBe(UI_TIMEOUTS.TOAST_DELAY);
	});

	it('removes a snackbar by id', () => {
		const { result } = renderHook(() => useContext(SnackbarContext), {
			wrapper: createWrapper(),
		});

		let firstId: string | undefined;
		let secondId: string | undefined;
		act(() => {
			firstId = result.current?.addSnackbar({ intent: 'success', message: 'Saved' });
			secondId = result.current?.addSnackbar({ intent: 'error', message: 'Failed' });
		});

		expect(result.current?.snackbars).toHaveLength(2);

		act(() => {
			if (firstId) {
				result.current?.removeSnackbar(firstId);
			}
		});

		expect(result.current?.snackbars).toHaveLength(1);
		expect(result.current?.snackbars[0]?.id).toBe(secondId);
	});

	it('maintains the configured max snackbar queue length', () => {
		const { result } = renderHook(() => useContext(SnackbarContext), {
			wrapper: createWrapper({ maxSnackbars: 2 }),
		});

		act(() => {
			result.current?.addSnackbar({ intent: 'info', message: 'First' });
			result.current?.addSnackbar({ intent: 'info', message: 'Second' });
			result.current?.addSnackbar({ intent: 'info', message: 'Third' });
		});

		expect(result.current?.snackbars).toHaveLength(2);
		expect(result.current?.snackbars[0]?.message).toBe('Second');
		expect(result.current?.snackbars[1]?.message).toBe('Third');
	});
});

describe('useSnackbar hook integration', () => {
	const useSnackbarTestHook = () => {
		const snackbar = useSnackbar();
		const context = useContext(SnackbarContext);
		return { snackbar, context };
	};

	it('exposes intent helpers and management utilities', () => {
		const { result } = renderHook(() => useSnackbarTestHook(), {
			wrapper: createWrapper({ defaultAutoDismiss: false, defaultDismissAfter: 5000 }),
		});

		act(() => {
			result.current.snackbar.success('Created!');
		});

		expect(result.current.context?.snackbars).toHaveLength(1);
		const [snackbar] = result.current.context?.snackbars ?? [];
		expect(snackbar?.intent).toBe('success');
		expect(snackbar?.autoDismiss).toBe(false);
		expect(snackbar?.dismissAfter).toBe(5000);

		act(() => {
			if (snackbar?.id) {
				result.current.snackbar.dismiss(snackbar.id);
			}
		});

		expect(result.current.context?.snackbars).toHaveLength(0);
	});

	it('throws when used outside of a SnackbarProvider', () => {
		expect(() => renderHook(() => useSnackbar())).toThrowError(
			'useSnackbar must be used within a SnackbarProvider'
		);
	});
});
