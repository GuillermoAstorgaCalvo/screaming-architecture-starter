/**
 * useCopyButton Tests
 *
 * Tests for the useCopyButton hook including:
 * - Initial state
 * - Successful copy operation
 * - Failed copy operation
 * - Success state duration
 * - Callback execution
 * - Clipboard API availability
 * - Error handling
 */

import { useCopyButton } from '@core/ui/utilities/copy-button/hooks/useCopyButton';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock i18n
vi.mock('@core/i18n/i18n', () => ({
	default: {
		t: (key: string) => {
			const translations: Record<string, string> = {
				'copy.clipboardApiNotAvailable': 'Clipboard API is not available',
				'copy.failedToCopy': 'Failed to copy text to clipboard',
			};
			return translations[key] ?? key;
		},
	},
}));

// Helper function to setup clipboard mock
function setupClipboardMock(mockImplementation?: () => Promise<void>) {
	const writeTextMock = mockImplementation
		? vi.fn(mockImplementation)
		: vi.fn().mockResolvedValue(undefined);

	Object.defineProperty(navigator, 'clipboard', {
		value: {
			writeText: writeTextMock,
		},
		writable: true,
		configurable: true,
	});
}

describe('useCopyButton - Initial State', () => {
	it('should return initial state correctly', () => {
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test text',
			})
		);

		expect(result.current.isCopied).toBe(false);
		expect(typeof result.current.copyToClipboard).toBe('function');
	});

	it('should return stable function reference', () => {
		const { result, rerender } = renderHook(() =>
			useCopyButton({
				text: 'test text',
			})
		);

		const firstCopy = result.current.copyToClipboard;

		rerender();

		expect(result.current.copyToClipboard).toBe(firstCopy);
	});
});

describe('useCopyButton - Successful Copy', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('should copy text to clipboard successfully', async () => {
		const text = 'test text to copy';
		const { result } = renderHook(() =>
			useCopyButton({
				text,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(navigator.clipboard?.writeText).toHaveBeenCalledWith(text);
		expect(navigator.clipboard?.writeText).toHaveBeenCalledTimes(1);
		expect(result.current.isCopied).toBe(true);
	});

	it('should set isCopied to true after successful copy', async () => {
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
			})
		);

		expect(result.current.isCopied).toBe(false);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);
	});

	it('should call onCopySuccess callback when provided', async () => {
		const onCopySuccess = vi.fn();
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
				onCopySuccess,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(onCopySuccess).toHaveBeenCalledTimes(1);
		expect(onCopySuccess).toHaveBeenCalledWith();
	});

	it('should not call onCopySuccess when not provided', async () => {
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		// Should not throw or error
		expect(result.current.isCopied).toBe(true);
	});

	it('should reset isCopied after successDuration', async () => {
		vi.useFakeTimers();
		const successDuration = 2000;
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
				successDuration,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(successDuration);
		});

		expect(result.current.isCopied).toBe(false);

		vi.useRealTimers();
	});

	it('should use default successDuration of 2000ms', async () => {
		vi.useFakeTimers();
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(result.current.isCopied).toBe(false);

		vi.useRealTimers();
	});

	it('should handle custom successDuration', async () => {
		vi.useFakeTimers();
		const successDuration = 5000;
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
				successDuration,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(3000);
		});

		expect(result.current.isCopied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		expect(result.current.isCopied).toBe(false);

		vi.useRealTimers();
	});

	it('should handle successDuration of 0', async () => {
		vi.useFakeTimers();
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
				successDuration: 0,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);

		act(() => {
			vi.runAllTimers();
		});

		expect(result.current.isCopied).toBe(false);

		vi.useRealTimers();
	});
});

describe('useCopyButton - Failed Copy', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should handle clipboard API not available', async () => {
		// Remove clipboard API
		Object.defineProperty(navigator, 'clipboard', {
			value: undefined,
			writable: true,
			configurable: true,
		});

		const onCopyError = vi.fn();
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
				onCopyError,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(false);
		expect(onCopyError).toHaveBeenCalledTimes(1);
		expect(onCopyError).toHaveBeenCalledWith(expect.any(Error));
	});

	it('should handle clipboard writeText failure', async () => {
		const error = new Error('Clipboard write failed');
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: vi.fn().mockRejectedValue(error),
			},
			writable: true,
			configurable: true,
		});

		const onCopyError = vi.fn();
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
				onCopyError,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(false);
		expect(onCopyError).toHaveBeenCalledTimes(1);
		expect(onCopyError).toHaveBeenCalledWith(expect.any(Error));
	});

	it('should handle non-Error rejection', async () => {
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: vi.fn().mockRejectedValue('String error'),
			},
			writable: true,
			configurable: true,
		});

		const onCopyError = vi.fn();
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
				onCopyError,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(false);
		expect(onCopyError).toHaveBeenCalledTimes(1);
		expect(onCopyError).toHaveBeenCalledWith(expect.any(Error));
	});

	it('should not call onCopyError when not provided', async () => {
		const error = new Error('Clipboard write failed');
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: vi.fn().mockRejectedValue(error),
			},
			writable: true,
			configurable: true,
		});

		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(false);
		// Should not throw
	});

	it('should keep isCopied as false on error', async () => {
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: vi.fn().mockRejectedValue(new Error('Failed')),
			},
			writable: true,
			configurable: true,
		});

		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
			})
		);

		expect(result.current.isCopied).toBe(false);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(false);
	});
});

describe('useCopyButton - Multiple Calls', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('should handle multiple successful copies', async () => {
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);
		expect(navigator.clipboard?.writeText).toHaveBeenCalledTimes(2);
	});

	it('should reset timer on subsequent copies', async () => {
		vi.useFakeTimers();
		const { result } = renderHook(() =>
			useCopyButton({
				text: 'test',
				successDuration: 2000,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		// Copy again before timer expires
		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);

		// Advance by another 1000ms (total 2000ms from last copy)
		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(result.current.isCopied).toBe(false);

		vi.useRealTimers();
	});
});

describe('useCopyButton - Dependencies', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('should update when text changes', async () => {
		const { result, rerender } = renderHook(
			({ text }) =>
				useCopyButton({
					text,
				}),
			{
				initialProps: { text: 'text1' },
			}
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(navigator.clipboard?.writeText).toHaveBeenCalledWith('text1');

		rerender({ text: 'text2' });

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(navigator.clipboard?.writeText).toHaveBeenCalledWith('text2');
	});

	it('should update when callbacks change', async () => {
		const onCopySuccess1 = vi.fn();
		const onCopySuccess2 = vi.fn();

		const { result, rerender } = renderHook(
			({ onCopySuccess }) =>
				useCopyButton({
					text: 'test',
					onCopySuccess,
				}),
			{
				initialProps: { onCopySuccess: onCopySuccess1 },
			}
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(onCopySuccess1).toHaveBeenCalledTimes(1);
		expect(onCopySuccess2).not.toHaveBeenCalled();

		rerender({ onCopySuccess: onCopySuccess2 });

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(onCopySuccess1).toHaveBeenCalledTimes(1);
		expect(onCopySuccess2).toHaveBeenCalledTimes(1);
	});

	it('should update when successDuration changes', async () => {
		vi.useFakeTimers();
		const { result, rerender } = renderHook(
			({ successDuration }) =>
				useCopyButton({
					text: 'test',
					successDuration,
				}),
			{
				initialProps: { successDuration: 1000 },
			}
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);

		// Clear any pending timers from first copy
		act(() => {
			vi.runAllTimers();
		});

		// Reset state
		expect(result.current.isCopied).toBe(false);

		// Update duration and copy again
		rerender({ successDuration: 3000 });

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(result.current.isCopied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(2000);
		});

		// Should still be true because duration is now 3000ms
		expect(result.current.isCopied).toBe(true);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(result.current.isCopied).toBe(false);

		vi.useRealTimers();
	});
});

describe('useCopyButton - Edge Cases', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		setupClipboardMock();
	});

	it('should handle empty string text', async () => {
		const { result } = renderHook(() =>
			useCopyButton({
				text: '',
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(navigator.clipboard?.writeText).toHaveBeenCalledWith('');
		expect(result.current.isCopied).toBe(true);
	});

	it('should handle very long text', async () => {
		const longText = 'a'.repeat(10000);
		const { result } = renderHook(() =>
			useCopyButton({
				text: longText,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(navigator.clipboard?.writeText).toHaveBeenCalledWith(longText);
		expect(result.current.isCopied).toBe(true);
	});

	it('should handle special characters in text', async () => {
		const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
		const { result } = renderHook(() =>
			useCopyButton({
				text: specialText,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(navigator.clipboard?.writeText).toHaveBeenCalledWith(specialText);
		expect(result.current.isCopied).toBe(true);
	});

	it('should handle unicode characters', async () => {
		const unicodeText = 'Hello 世界 🌍';
		const { result } = renderHook(() =>
			useCopyButton({
				text: unicodeText,
			})
		);

		await act(async () => {
			await result.current.copyToClipboard();
		});

		expect(navigator.clipboard?.writeText).toHaveBeenCalledWith(unicodeText);
		expect(result.current.isCopied).toBe(true);
	});
});
