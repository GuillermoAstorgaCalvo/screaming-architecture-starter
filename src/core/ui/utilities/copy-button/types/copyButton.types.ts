import type { UseCopyButtonOptions } from '@core/ui/utilities/copy-button/hooks/useCopyButton';

/**
 * Input options for building hook options
 */
export interface HookOptionsInput {
	text: string;
	onCopySuccess?: () => void;
	onCopyError?: (error: Error) => void;
	successDuration?: number;
}

/**
 * Input options for deriving UI state
 */
export interface UIStateInput {
	isCopied: boolean;
	copyTooltip: string;
	copiedTooltip: string;
	ariaLabel?: string;
}

/**
 * Derived UI state based on copy status
 */
export interface UIState {
	tooltipText: string;
	iconName: 'check' | 'copy';
	buttonAriaLabel: string;
}

/**
 * Type helper for hook options
 */
export type HookOptions = UseCopyButtonOptions;
