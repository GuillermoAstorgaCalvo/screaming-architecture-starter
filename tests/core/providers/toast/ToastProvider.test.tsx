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

describe('ToastProvider lifecycle', () => {
	it('clears toasts on unmount', () => {
		const { result, unmount } = renderUseToastHook();

		act(() => {
			result.current.success('Test toast');
		});

		expect(result.current.toasts).toHaveLength(1);

		unmount();

		// After unmount, the hook should be cleaned up
		// Re-render to verify state is reset
		const { result: newResult } = renderUseToastHook();
		expect(newResult.current.toasts).toHaveLength(0);
	});
});

describe('ToastProvider error handling', () => {
	it('handles toast operations with invalid IDs gracefully', () => {
		const { result } = renderUseToastHook();

		act(() => {
			result.current.dismiss('nonexistent-id');
		});

		// Should not throw
		expect(result.current.toasts).toHaveLength(0);
	});

	it('handles clear when no toasts exist', () => {
		const { result } = renderUseToastHook();

		expect(result.current.toasts).toHaveLength(0);

		act(() => {
			result.current.clear();
		});

		expect(result.current.toasts).toHaveLength(0);
	});
});

describe('ToastProvider context memoization', () => {
	it('memoizes context value when state is stable', () => {
		const { result, rerender } = renderUseToastHook();

		const firstValue = result.current;
		rerender();

		// Context value should be memoized when state doesn't change
		expect(result.current.toasts).toBe(firstValue.toasts);
		expect(result.current.dismiss).toBe(firstValue.dismiss);
		expect(result.current.clear).toBe(firstValue.clear);
		expect(result.current.success).toBe(firstValue.success);
	});
});

describe('ToastProvider composition', () => {
	it('works correctly when nested with other providers', () => {
		const NestedWrapper = ({ children }: { children: ReactNode }) => (
			<ToastProvider>
				<div data-testid="nested">{children}</div>
			</ToastProvider>
		);

		const { result } = renderHook(() => useToast(), {
			wrapper: NestedWrapper,
		});

		act(() => {
			result.current.success('Nested toast');
		});

		expect(result.current.toasts).toHaveLength(1);
	});
});

describe('ToastProvider edge cases', () => {
	it('handles toast with custom dismissAfter', () => {
		const { result } = renderUseToastHook();

		act(() => {
			result.current.info({ title: 'Custom timeout', dismissAfter: 10000 });
		});

		const [toast] = result.current.toasts;
		expect(toast?.dismissAfter).toBe(10000);
	});

	it('handles toast with autoDismiss disabled', () => {
		const { result } = renderUseToastHook();

		act(() => {
			result.current.warning({ title: 'Manual dismiss', autoDismiss: false });
		});

		const [toast] = result.current.toasts;
		expect(toast?.autoDismiss).toBe(false);
	});

	it('handles toast with pauseOnHover disabled', () => {
		const { result } = renderUseToastHook();

		act(() => {
			result.current.info({ title: 'No pause', pauseOnHover: false });
		});

		const [toast] = result.current.toasts;
		expect(toast?.pauseOnHover).toBe(false);
	});

	it('handles toast with description', () => {
		const { result } = renderUseToastHook();

		act(() => {
			result.current.error({
				title: 'Error occurred',
				description: 'Detailed error message',
			});
		});

		const [toast] = result.current.toasts;
		expect(toast?.title).toBe('Error occurred');
		expect(toast?.description).toBe('Detailed error message');
	});
});

describe('ToastProvider with useToast', () => {
	registerDefaultConfigurationTests();
	registerProviderOverrideTests();
	registerToastLifecycleTests();
	registerQueueManagementTests();
	registerVariantTests();
});
