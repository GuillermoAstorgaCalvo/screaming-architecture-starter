import i18n from '@core/i18n/i18n';
import { useCallback, useState } from 'react';

export interface UseCopyButtonOptions {
	/** Text to copy to clipboard */
	text: string;
	/** Callback when copy succeeds */
	onCopySuccess?: () => void;
	/** Callback when copy fails */
	onCopyError?: (error: Error) => void;
	/** Duration to show success state in milliseconds */
	successDuration?: number;
}

export interface UseCopyButtonReturn {
	/** Whether the copy was successful (showing success state) */
	isCopied: boolean;
	/** Function to copy text to clipboard */
	copyToClipboard: () => Promise<void>;
}

/**
 * Checks if the modern Clipboard API is available
 */
function isClipboardAPIAvailable(): boolean {
	return 'clipboard' in navigator && typeof navigator.clipboard.writeText === 'function';
}

/**
 * Copies text to clipboard using the modern Clipboard API
 *
 * @param text - Text to copy
 * @throws Error if clipboard API is not available or copy fails
 */
async function copyWithClipboardAPI(text: string): Promise<void> {
	if (!isClipboardAPIAvailable()) {
		const errorMessage = i18n.t('copy.clipboardApiNotAvailable', { ns: 'common' });
		throw new Error(errorMessage);
	}

	await navigator.clipboard.writeText(text);
}

/**
 * Handles successful copy operation
 *
 * @param setIsCopied - State setter for copied state
 * @param onCopySuccess - Optional success callback
 * @param successDuration - Duration to show success state
 */
function handleCopySuccess(
	setIsCopied: (value: boolean) => void,
	onCopySuccess: (() => void) | undefined,
	successDuration: number
): void {
	setIsCopied(true);
	onCopySuccess?.();

	// Reset success state after duration
	setTimeout(() => {
		setIsCopied(false);
	}, successDuration);
}

/**
 * Handles copy error
 *
 * @param error - The error that occurred
 * @param setIsCopied - State setter for copied state
 * @param onCopyError - Optional error callback
 */
function handleCopyError(
	error: unknown,
	setIsCopied: (value: boolean) => void,
	onCopyError: ((error: Error) => void) | undefined
): void {
	const errorMessage = i18n.t('copy.failedToCopy', { ns: 'common' });
	const copyError = error instanceof Error ? error : new Error(errorMessage);
	onCopyError?.(copyError);
	setIsCopied(false);
}

/**
 * Hook for copy-to-clipboard functionality with success feedback
 *
 * @param options - Copy button options
 * @returns Copy button state and handler
 */
export function useCopyButton({
	text,
	onCopySuccess,
	onCopyError,
	successDuration = 2000,
}: UseCopyButtonOptions): UseCopyButtonReturn {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = useCallback(async () => {
		try {
			await copyWithClipboardAPI(text);
			handleCopySuccess(setIsCopied, onCopySuccess, successDuration);
		} catch (error: unknown) {
			handleCopyError(error, setIsCopied, onCopyError);
		}
	}, [text, onCopySuccess, onCopyError, successDuration]);

	return {
		isCopied,
		copyToClipboard,
	};
}
