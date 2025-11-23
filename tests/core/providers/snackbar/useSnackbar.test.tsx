/**
 * Tests for useSnackbar hook
 *
 * Tests the useSnackbar hook:
 * - Intent helper methods (success, error, warning, info)
 * - String and object options handling
 * - Show, dismiss, and clear methods
 * - Snackbars array access
 * - Error handling when used outside provider
 * - Callback memoization
 * - ReactNode messages
 * - All options (autoDismiss, dismissAfter, action, className)
 */

import { UI_TIMEOUTS } from '@core/constants/timeouts';
import { SnackbarProvider } from '@core/providers/snackbar/SnackbarProvider';
import { useSnackbar } from '@core/providers/snackbar/useSnackbar';
import { act, renderHook } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

type SnackbarProviderConfig = Omit<ComponentProps<typeof SnackbarProvider>, 'children'>;

const createWrapper = (config?: SnackbarProviderConfig) => {
	const SnackbarProviderTestWrapper = ({ children }: { children: ReactNode }) => (
		<SnackbarProvider {...config}>{children}</SnackbarProvider>
	);
	SnackbarProviderTestWrapper.displayName = 'SnackbarProviderTestWrapper';
	return SnackbarProviderTestWrapper;
};

describe('useSnackbar - Initialization', () => {
	it('returns all expected methods and properties', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		expect(result.current).toBeDefined();
		expect(result.current.snackbars).toBeDefined();
		expect(Array.isArray(result.current.snackbars)).toBe(true);
		expect(typeof result.current.success).toBe('function');
		expect(typeof result.current.error).toBe('function');
		expect(typeof result.current.warning).toBe('function');
		expect(typeof result.current.info).toBe('function');
		expect(typeof result.current.show).toBe('function');
		expect(typeof result.current.dismiss).toBe('function');
		expect(typeof result.current.clear).toBe('function');
	});

	it('initializes with empty snackbars array', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		expect(result.current.snackbars).toEqual([]);
		expect(result.current.snackbars).toHaveLength(0);
	});

	it('throws error when used outside SnackbarProvider', () => {
		expect(() => renderHook(() => useSnackbar())).toThrowError(
			'useSnackbar must be used within a SnackbarProvider'
		);
	});
});

describe('useSnackbar - Intent methods with string messages', () => {
	it('success() creates a success snackbar with string message', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		let snackbarId: string | undefined;
		act(() => {
			snackbarId = result.current.success('Operation completed successfully');
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.id).toBe(snackbarId);
		expect(snackbar?.message).toBe('Operation completed successfully');
		expect(snackbar?.intent).toBe('success');
		expect(snackbar?.autoDismiss).toBe(true);
		expect(snackbar?.dismissAfter).toBe(UI_TIMEOUTS.TOAST_DELAY);
	});

	it('error() creates an error snackbar with string message', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		let snackbarId: string | undefined;
		act(() => {
			snackbarId = result.current.error('Something went wrong');
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.id).toBe(snackbarId);
		expect(snackbar?.message).toBe('Something went wrong');
		expect(snackbar?.intent).toBe('error');
	});

	it('warning() creates a warning snackbar with string message', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		let snackbarId: string | undefined;
		act(() => {
			snackbarId = result.current.warning('Please check your input');
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.id).toBe(snackbarId);
		expect(snackbar?.message).toBe('Please check your input');
		expect(snackbar?.intent).toBe('warning');
	});

	it('info() creates an info snackbar with string message', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		let snackbarId: string | undefined;
		act(() => {
			snackbarId = result.current.info('New message received');
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.id).toBe(snackbarId);
		expect(snackbar?.message).toBe('New message received');
		expect(snackbar?.intent).toBe('info');
	});
});

describe('useSnackbar - Intent methods with object options', () => {
	it('success() accepts object options with all properties', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		const action = { label: 'Undo', onClick: () => {} };
		let snackbarId: string | undefined;

		act(() => {
			snackbarId = result.current.success({
				message: 'Item saved',
				autoDismiss: false,
				dismissAfter: 10000,
				action,
				className: 'custom-class',
			});
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.id).toBe(snackbarId);
		expect(snackbar?.message).toBe('Item saved');
		expect(snackbar?.intent).toBe('success');
		expect(snackbar?.autoDismiss).toBe(false);
		expect(snackbar?.dismissAfter).toBe(10000);
		expect(snackbar?.action).toBe(action);
		expect(snackbar?.className).toBe('custom-class');
	});

	it('error() accepts object options', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.error({
				message: 'Failed to save',
				autoDismiss: true,
				dismissAfter: 5000,
			});
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.intent).toBe('error');
		expect(snackbar?.message).toBe('Failed to save');
		expect(snackbar?.autoDismiss).toBe(true);
		expect(snackbar?.dismissAfter).toBe(5000);
	});
});

describe('useSnackbar - Intent methods with object options (continued)', () => {
	it('warning() accepts object options', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.warning({
				message: 'Validation warning',
				autoDismiss: false,
			});
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.intent).toBe('warning');
		expect(snackbar?.message).toBe('Validation warning');
		expect(snackbar?.autoDismiss).toBe(false);
	});

	it('info() accepts object options', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.info({
				message: 'Information message',
				dismissAfter: 3000,
			});
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.intent).toBe('info');
		expect(snackbar?.message).toBe('Information message');
		expect(snackbar?.dismissAfter).toBe(3000);
	});
});

describe('useSnackbar - ReactNode messages', () => {
	it('accepts ReactNode as message in string form', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		const messageNode = (
			<span>
				Custom <strong>message</strong>
			</span>
		);

		act(() => {
			result.current.success({
				message: messageNode,
			});
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.message).toBe(messageNode);
	});

	it('accepts ReactNode as message in object options', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		const messageNode = (
			<div>
				<p>
					Complex message with <em>formatting</em>
				</p>
			</div>
		);

		act(() => {
			result.current.error({
				message: messageNode,
			});
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.message).toBe(messageNode);
	});
});

describe('useSnackbar - show() method', () => {
	it('show() creates snackbar with specified intent and string message', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		let snackbarId: string | undefined;

		act(() => {
			snackbarId = result.current.show('success', 'Operation successful');
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.id).toBe(snackbarId);
		expect(snackbar?.intent).toBe('success');
		expect(snackbar?.message).toBe('Operation successful');
	});

	it('show() creates snackbar with specified intent and object options', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		let snackbarId: string | undefined;

		act(() => {
			snackbarId = result.current.show('error', {
				message: 'Error occurred',
				autoDismiss: false,
				dismissAfter: 8000,
			});
		});

		expect(result.current.snackbars).toHaveLength(1);
		const [snackbar] = result.current.snackbars;
		expect(snackbar?.id).toBe(snackbarId);
		expect(snackbar?.intent).toBe('error');
		expect(snackbar?.message).toBe('Error occurred');
		expect(snackbar?.autoDismiss).toBe(false);
		expect(snackbar?.dismissAfter).toBe(8000);
	});

	it('show() works with all intent types', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper({ maxSnackbars: 4 }),
		});

		act(() => {
			result.current.show('success', 'Success message');
			result.current.show('error', 'Error message');
			result.current.show('warning', 'Warning message');
			result.current.show('info', 'Info message');
		});

		expect(result.current.snackbars).toHaveLength(4);
		expect(result.current.snackbars.map(s => s.intent)).toEqual([
			'success',
			'error',
			'warning',
			'info',
		]);
	});
});

describe('useSnackbar - dismiss() method', () => {
	it('dismiss() removes snackbar by id', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		let firstId: string | undefined;
		let secondId: string | undefined;

		act(() => {
			firstId = result.current.success('First message');
			secondId = result.current.error('Second message');
		});

		expect(result.current.snackbars).toHaveLength(2);

		act(() => {
			if (firstId) {
				result.current.dismiss(firstId);
			}
		});

		expect(result.current.snackbars).toHaveLength(1);
		expect(result.current.snackbars[0]?.id).toBe(secondId);
		expect(result.current.snackbars[0]?.message).toBe('Second message');
	});

	it('dismiss() handles non-existent id gracefully', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.success('Test message');
		});

		expect(result.current.snackbars).toHaveLength(1);

		act(() => {
			result.current.dismiss('non-existent-id');
		});

		// Should not throw and should not affect existing snackbars
		expect(result.current.snackbars).toHaveLength(1);
	});
});

describe('useSnackbar - dismiss() method (continued)', () => {
	it('dismiss() can remove multiple snackbars sequentially', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper({ maxSnackbars: 5 }),
		});

		let id0: string | undefined;
		let id1: string | undefined;
		let id2: string | undefined;

		act(() => {
			id0 = result.current.success('Message 1');
			id1 = result.current.error('Message 2');
			id2 = result.current.warning('Message 3');
		});

		expect(result.current.snackbars).toHaveLength(3);

		act(() => {
			if (id1) {
				result.current.dismiss(id1);
			}
		});

		expect(result.current.snackbars).toHaveLength(2);
		expect(result.current.snackbars.map(s => s.id)).toEqual([id0, id2]);

		act(() => {
			if (id0) {
				result.current.dismiss(id0);
			}
		});

		expect(result.current.snackbars).toHaveLength(1);
		expect(result.current.snackbars[0]?.id).toBe(id2);
	});
});

describe('useSnackbar - clear() method', () => {
	it('clear() removes all snackbars', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper({ maxSnackbars: 5 }),
		});

		act(() => {
			result.current.success('Message 1');
			result.current.error('Message 2');
			result.current.warning('Message 3');
			result.current.info('Message 4');
		});

		expect(result.current.snackbars).toHaveLength(4);

		act(() => {
			result.current.clear();
		});

		expect(result.current.snackbars).toHaveLength(0);
		expect(result.current.snackbars).toEqual([]);
	});

	it('clear() works when no snackbars exist', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		expect(result.current.snackbars).toHaveLength(0);

		act(() => {
			result.current.clear();
		});

		expect(result.current.snackbars).toHaveLength(0);
	});

	it('clear() works after adding and removing snackbars', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		let id1: string | undefined;

		act(() => {
			id1 = result.current.success('Message 1');
			result.current.error('Message 2');
		});

		expect(result.current.snackbars).toHaveLength(2);

		act(() => {
			if (id1) {
				result.current.dismiss(id1);
			}
		});

		expect(result.current.snackbars).toHaveLength(1);

		act(() => {
			result.current.clear();
		});

		expect(result.current.snackbars).toHaveLength(0);
	});
});

describe('useSnackbar - snackbars array access', () => {
	it('snackbars array reflects current state', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper({ maxSnackbars: 3 }),
		});

		expect(result.current.snackbars).toHaveLength(0);

		act(() => {
			result.current.success('First');
		});

		expect(result.current.snackbars).toHaveLength(1);
		expect(result.current.snackbars[0]?.message).toBe('First');

		act(() => {
			result.current.error('Second');
		});

		expect(result.current.snackbars).toHaveLength(2);
		expect(result.current.snackbars[1]?.message).toBe('Second');

		act(() => {
			result.current.warning('Third');
		});

		expect(result.current.snackbars).toHaveLength(3);
		expect(result.current.snackbars[2]?.message).toBe('Third');
	});

	it('snackbars array is readonly in TypeScript', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.success('Test');
		});

		// TypeScript enforces readonly, but at runtime arrays are still mutable
		// This test verifies the array exists and is accessible
		const { snackbars } = result.current;
		expect(Array.isArray(snackbars)).toBe(true);
		expect(snackbars).toHaveLength(1);
		// TypeScript will prevent mutations, but runtime behavior may vary
		expect(snackbars[0]?.message).toBe('Test');
	});
});

describe('useSnackbar - Callback memoization', () => {
	const AFTER_RERENDER_MESSAGE = 'After rerender';

	it('intent callbacks are functions and work correctly', () => {
		const { result, rerender } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		// Verify callbacks are functions
		expect(typeof result.current.success).toBe('function');
		expect(typeof result.current.error).toBe('function');
		expect(typeof result.current.warning).toBe('function');
		expect(typeof result.current.info).toBe('function');
		expect(typeof result.current.show).toBe('function');
		expect(typeof result.current.dismiss).toBe('function');
		expect(typeof result.current.clear).toBe('function');

		// Verify they still work after rerender
		rerender();

		expect(typeof result.current.success).toBe('function');
		expect(typeof result.current.error).toBe('function');

		// Verify functionality is preserved
		act(() => {
			result.current.success(AFTER_RERENDER_MESSAGE);
		});

		expect(result.current.snackbars).toHaveLength(1);
		expect(result.current.snackbars[0]?.message).toBe(AFTER_RERENDER_MESSAGE);
	});

	it('callbacks work correctly after adding snackbars', () => {
		const { result, rerender } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.success('Test');
			result.current.error('Test');
		});

		expect(result.current.snackbars).toHaveLength(2);

		// Verify callbacks still work after rerender
		rerender();

		expect(typeof result.current.success).toBe('function');
		expect(typeof result.current.error).toBe('function');

		act(() => {
			result.current.warning(AFTER_RERENDER_MESSAGE);
		});

		expect(result.current.snackbars).toHaveLength(3);
		expect(result.current.snackbars[2]?.message).toBe(AFTER_RERENDER_MESSAGE);
	});
});

describe('useSnackbar - Options handling', () => {
	it('handles autoDismiss option', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper({ defaultAutoDismiss: true }),
		});

		act(() => {
			result.current.success({
				message: 'Auto dismiss enabled',
				autoDismiss: true,
			});
		});

		expect(result.current.snackbars[0]?.autoDismiss).toBe(true);

		act(() => {
			result.current.error({
				message: 'Auto dismiss disabled',
				autoDismiss: false,
			});
		});

		expect(result.current.snackbars[1]?.autoDismiss).toBe(false);
	});

	it('handles dismissAfter option', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.success({
				message: 'Custom timeout',
				dismissAfter: 15000,
			});
		});

		expect(result.current.snackbars[0]?.dismissAfter).toBe(15000);
	});

	it('handles action option', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		const actionHandler = () => {
			// Action handler
		};
		const action = { label: 'Retry', onClick: actionHandler };

		act(() => {
			result.current.error({
				message: 'Action snackbar',
				action,
			});
		});

		expect(result.current.snackbars[0]?.action).toBe(action);
		expect(result.current.snackbars[0]?.action?.label).toBe('Retry');
		expect(result.current.snackbars[0]?.action?.onClick).toBe(actionHandler);
	});
});

describe('useSnackbar - Options handling (continued)', () => {
	it('handles className option', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.info({
				message: 'Custom class snackbar',
				className: 'my-custom-class',
			});
		});

		expect(result.current.snackbars[0]?.className).toBe('my-custom-class');
	});

	it('handles all options together', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		const action = { label: 'Action', onClick: () => {} };

		act(() => {
			result.current.warning({
				message: 'Full options test',
				autoDismiss: false,
				dismissAfter: 20000,
				action,
				className: 'full-options-class',
			});
		});

		const [snackbar] = result.current.snackbars;
		expect(snackbar?.message).toBe('Full options test');
		expect(snackbar?.autoDismiss).toBe(false);
		expect(snackbar?.dismissAfter).toBe(20000);
		expect(snackbar?.action).toBe(action);
		expect(snackbar?.className).toBe('full-options-class');
	});
});

describe('useSnackbar - Integration scenarios', () => {
	it('handles complex workflow: add, dismiss, add again, clear', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper({ maxSnackbars: 10 }),
		});

		// Add multiple snackbars
		let id2: string | undefined;

		act(() => {
			result.current.success('Saved');
			id2 = result.current.error('Failed');
			result.current.info('Processing');
		});

		expect(result.current.snackbars).toHaveLength(3);

		// Dismiss one
		act(() => {
			if (id2) {
				result.current.dismiss(id2);
			}
		});

		expect(result.current.snackbars).toHaveLength(2);

		// Add more
		act(() => {
			result.current.warning('Warning');
			result.current.success('Done');
		});

		expect(result.current.snackbars).toHaveLength(4);

		// Clear all
		act(() => {
			result.current.clear();
		});

		expect(result.current.snackbars).toHaveLength(0);
	});

	it('handles rapid successive calls', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper({ maxSnackbars: 5 }),
		});

		act(() => {
			for (let i = 0; i < 5; i++) {
				result.current.info(`Message ${i + 1}`);
			}
		});

		expect(result.current.snackbars).toHaveLength(5);
		expect(result.current.snackbars.map(s => s.message)).toEqual([
			'Message 1',
			'Message 2',
			'Message 3',
			'Message 4',
			'Message 5',
		]);
	});
});

describe('useSnackbar - Integration scenarios (continued)', () => {
	it('handles mixed string and object option calls', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper({ maxSnackbars: 4 }),
		});

		act(() => {
			result.current.success('String message');
			result.current.error({ message: 'Object message', autoDismiss: false });
			result.current.warning('Another string');
			result.current.info({ message: 'Another object', dismissAfter: 5000 });
		});

		expect(result.current.snackbars).toHaveLength(4);
		expect(result.current.snackbars[0]?.message).toBe('String message');
		expect(result.current.snackbars[1]?.message).toBe('Object message');
		expect(result.current.snackbars[1]?.autoDismiss).toBe(false);
		expect(result.current.snackbars[2]?.message).toBe('Another string');
		expect(result.current.snackbars[3]?.message).toBe('Another object');
		expect(result.current.snackbars[3]?.dismissAfter).toBe(5000);
	});
});

describe('useSnackbar - Edge cases', () => {
	it('handles empty string message', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.success('');
		});

		expect(result.current.snackbars).toHaveLength(1);
		expect(result.current.snackbars[0]?.message).toBe('');
	});

	it('handles very long string messages', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		const longMessage = 'A'.repeat(1000);

		act(() => {
			result.current.info(longMessage);
		});

		expect(result.current.snackbars).toHaveLength(1);
		expect(result.current.snackbars[0]?.message).toBe(longMessage);
	});

	it('handles dismiss with empty string id', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper(),
		});

		act(() => {
			result.current.success('Test');
		});

		expect(result.current.snackbars).toHaveLength(1);

		act(() => {
			result.current.dismiss('');
		});

		// Should not throw and should not affect existing snackbars
		expect(result.current.snackbars).toHaveLength(1);
	});

	it('handles show with all intent types via show() method', () => {
		const { result } = renderHook(() => useSnackbar(), {
			wrapper: createWrapper({ maxSnackbars: 4 }),
		});

		act(() => {
			result.current.show('success', 'Success via show');
			result.current.show('error', 'Error via show');
			result.current.show('warning', 'Warning via show');
			result.current.show('info', 'Info via show');
		});

		expect(result.current.snackbars).toHaveLength(4);
		expect(result.current.snackbars.map(s => s.intent)).toEqual([
			'success',
			'error',
			'warning',
			'info',
		]);
	});
});
