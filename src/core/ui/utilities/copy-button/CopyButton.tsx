import IconButton from '@core/ui/icon-button/IconButton';
import Icon from '@core/ui/icons/Icon';
import Tooltip from '@core/ui/tooltip/Tooltip';
import { useCopyButton } from '@core/ui/utilities/copy-button/hooks/useCopyButton';
import type { CopyButtonProps } from '@src-types/ui/buttons';

interface HookOptionsInput {
	text: string;
	onCopySuccess?: () => void;
	onCopyError?: (error: Error) => void;
	successDuration?: number;
}

/**
 * Gets the hook options with conditional callbacks
 */
function getHookOptions(input: HookOptionsInput) {
	const options: Parameters<typeof useCopyButton>[0] = {
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

interface UIStateInput {
	isCopied: boolean;
	copyTooltip: string;
	copiedTooltip: string;
	ariaLabel?: string;
}

/**
 * Gets the derived UI state based on copy status
 */
function getUIState({
	isCopied,
	copyTooltip,
	copiedTooltip,
	ariaLabel = 'Copy to clipboard',
}: UIStateInput) {
	const tooltipText = isCopied ? copiedTooltip : copyTooltip;
	const iconName = isCopied ? 'check' : 'copy';
	const buttonAriaLabel = isCopied ? copiedTooltip : ariaLabel;

	return {
		tooltipText,
		iconName,
		buttonAriaLabel,
	};
}

/**
 * CopyButton - Copy-to-clipboard button with feedback
 *
 * Features:
 * - Copy text to clipboard on click
 * - Visual feedback: icon changes from copy to check on success
 * - Tooltip feedback: shows "Copy to clipboard" or "Copied!" based on state
 * - Accessible: proper ARIA labels and keyboard navigation
 * - Fallback support for older browsers
 * - Configurable success duration
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <CopyButton text="Hello, World!" />
 * ```
 *
 * @example
 * ```tsx
 * <CopyButton
 *   text={codeSnippet}
 *   copyTooltip="Copy code"
 *   copiedTooltip="Code copied!"
 *   onCopySuccess={() => console.log('Copied!')}
 * />
 * ```
 */
export default function CopyButton({
	text,
	'aria-label': ariaLabel,
	copyTooltip = 'Copy to clipboard',
	copiedTooltip = 'Copied!',
	size = 'md',
	variant = 'default',
	onCopySuccess,
	onCopyError,
	successDuration = 2000,
	className,
	...props
}: Readonly<CopyButtonProps>) {
	const hookOptionsInput: HookOptionsInput = { text, successDuration };
	if (onCopySuccess) hookOptionsInput.onCopySuccess = onCopySuccess;
	if (onCopyError) hookOptionsInput.onCopyError = onCopyError;

	const { isCopied, copyToClipboard } = useCopyButton(getHookOptions(hookOptionsInput));

	const uiStateInput: UIStateInput = { isCopied, copyTooltip, copiedTooltip };
	if (ariaLabel) uiStateInput.ariaLabel = ariaLabel;

	const { tooltipText, iconName, buttonAriaLabel } = getUIState(uiStateInput);

	// Extract title from props to avoid conflicts, we use tooltipText instead
	const { title: _title, ...restProps } = props;

	return (
		<Tooltip content={tooltipText} position="top">
			<IconButton
				icon={<Icon name={iconName} size={size} />}
				aria-label={buttonAriaLabel}
				title={tooltipText}
				size={size}
				variant={variant}
				className={className}
				onClick={copyToClipboard}
				{...restProps}
			/>
		</Tooltip>
	);
}
