import type { UseCopyButtonOptions } from '@core/ui/utilities/copy-button/hooks/useCopyButton';
import type {
	HookOptions,
	HookOptionsInput,
	UIState,
	UIStateInput,
} from '@core/ui/utilities/copy-button/types/copyButton.types';

/**
 * Gets the hook options with conditional callbacks
 *
 * @param input - Input options for building hook options
 * @returns Hook options with only defined properties
 */
export function getHookOptions(input: HookOptionsInput): HookOptions {
	const options: UseCopyButtonOptions = {
		text: input.text,
	};

	if (input.successDuration !== undefined) {
		options.successDuration = input.successDuration;
	}

	if (input.onCopySuccess) {
		options.onCopySuccess = input.onCopySuccess;
	}

	if (input.onCopyError) {
		options.onCopyError = input.onCopyError;
	}

	return options;
}

/**
 * Gets the derived UI state based on copy status
 *
 * @param input - Input options for deriving UI state
 * @returns Derived UI state with tooltip text, icon name, and aria label
 */
export function getUIState({
	isCopied,
	copyTooltip,
	copiedTooltip,
	ariaLabel,
}: UIStateInput): UIState {
	const tooltipText = isCopied ? copiedTooltip : copyTooltip;
	const iconName = isCopied ? 'check' : 'copy';
	const buttonAriaLabel = isCopied ? copiedTooltip : (ariaLabel ?? copyTooltip);

	return {
		tooltipText,
		iconName,
		buttonAriaLabel,
	};
}
