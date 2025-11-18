import { UI_TIMEOUTS } from '@core/constants/timeouts';
import { ToastProvider, type ToastProviderProps } from '@core/providers/toast/ToastProvider';
import { useToast } from '@core/providers/toast/useToast';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

type ProviderConfig = Partial<Omit<ToastProviderProps, 'children'>>;

function renderUseToastHook(providerConfig: ProviderConfig = {}) {
	const wrapper = ({ children }: { children: ReactNode }) => (
		<ToastProvider {...providerConfig}>{children}</ToastProvider>
	);

	return renderHook(() => useToast(), { wrapper });
}

describe('useToast', () => {
	it('throws when used outside ToastProvider', () => {
		expect(() => renderHook(() => useToast())).toThrowError(
			'useToast must be used within a ToastProvider'
		);
	});
});

function registerDefaultConfigurationTests() {
	it('creates a toast with default configuration values', () => {
		const { result } = renderUseToastHook();
		let toastId = '';

		act(() => {
			toastId = result.current.success('Profile updated');
		});

		const [toast] = result.current.toasts;

		expect(toast?.id).toBe(toastId);
		expect(toast?.intent).toBe('success');
		expect(toast?.title).toBe('Profile updated');
		expect(toast?.autoDismiss).toBe(true);
		expect(toast?.pauseOnHover).toBe(true);
		expect(toast?.dismissAfter).toBe(UI_TIMEOUTS.TOAST_DELAY);
	});
}

function registerProviderOverrideTests() {
	it('allows overriding default toast behavior via provider props', () => {
		const { result } = renderUseToastHook({
			defaultAutoDismiss: false,
			defaultPauseOnHover: false,
			defaultDismissAfter: 500,
		});

		act(() => {
			result.current.error({ title: 'Upload failed', description: 'Please try again.' });
		});

		const toast = result.current.toasts.at(0);

		expect(toast?.autoDismiss).toBe(false);
		expect(toast?.pauseOnHover).toBe(false);
		expect(toast?.dismissAfter).toBe(500);
	});
}

function registerToastLifecycleTests() {
	it('removes individual toasts and clears the queue', () => {
		const { result } = renderUseToastHook();
		let toastId = '';

		act(() => {
			toastId = result.current.warning('Low storage space');
		});

		act(() => {
			result.current.dismiss(toastId);
		});

		expect(result.current.toasts).toHaveLength(0);

		act(() => {
			result.current.info('Sync started');
			result.current.success('Sync completed');
		});

		expect(result.current.toasts).toHaveLength(2);

		act(() => {
			result.current.clear();
		});

		expect(result.current.toasts).toHaveLength(0);
	});
}

function registerQueueManagementTests() {
	it('maintains the most recent toasts when maxToasts is exceeded', () => {
		const { result } = renderUseToastHook({ maxToasts: 2 });

		act(() => {
			result.current.info('Toast 1');
			result.current.info('Toast 2');
			result.current.info('Toast 3');
		});

		expect(result.current.toasts).toHaveLength(2);
		expect(result.current.toasts.map(toast => toast.title)).toEqual(['Toast 2', 'Toast 3']);
	});
}

function registerVariantTests() {
	it('creates variant toasts with the correct intents and payloads', () => {
		const { result } = renderUseToastHook();

		act(() => {
			result.current.success('Saved!');
			result.current.error('Failed!');
			result.current.warning({ title: 'Heads up', description: 'Check settings' });
			result.current.info('FYI');
		});

		expect(result.current.toasts).toHaveLength(4);
		expect(result.current.toasts.map(toast => toast.intent)).toEqual([
			'success',
			'error',
			'warning',
			'info',
		]);
		expect(result.current.toasts.at(2)?.description).toBe('Check settings');
	});
}

describe('ToastProvider with useToast', () => {
	registerDefaultConfigurationTests();
	registerProviderOverrideTests();
	registerToastLifecycleTests();
	registerQueueManagementTests();
	registerVariantTests();
});
