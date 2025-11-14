import { type TypedTFunction, useTranslation } from '@core/i18n/useTranslation';
import IconButton from '@core/ui/icon-button/IconButton';
import Icon from '@core/ui/icons/Icon';
import Tooltip from '@core/ui/tooltip/Tooltip';
import { useCopyButton } from '@core/ui/utilities/copy-button/hooks/useCopyButton';
import type { HookOptionsInput } from '@core/ui/utilities/copy-button/types/copyButton.types';
import { getHookOptions, getUIState } from '@core/ui/utilities/copy-button/utils/copyButtonUtils';
import type { CopyButtonProps } from '@src-types/ui/buttons';

function getDefaults(
	t: TypedTFunction<'common'>,
	opts: {
		copyTooltip?: string | undefined;
		copiedTooltip?: string | undefined;
		ariaLabel?: string | undefined;
	}
) {
	return {
		copyTooltip: opts.copyTooltip ?? t('copy.copyToClipboard'),
		copiedTooltip: opts.copiedTooltip ?? t('copy.copied'),
		ariaLabel: opts.ariaLabel ?? t('copy.copyToClipboard'),
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
	copyTooltip,
	copiedTooltip,
	size = 'md',
	variant = 'default',
	onCopySuccess,
	onCopyError,
	successDuration = 2000,
	className,
	...props
}: Readonly<CopyButtonProps>) {
	const { t } = useTranslation('common');
	const defaults = getDefaults(t, { copyTooltip, copiedTooltip, ariaLabel });
	const hookOptions: HookOptionsInput = {
		text,
		successDuration,
		...(onCopySuccess && { onCopySuccess }),
		...(onCopyError && { onCopyError }),
	};
	const { isCopied, copyToClipboard } = useCopyButton(getHookOptions(hookOptions));
	const { tooltipText, iconName, buttonAriaLabel } = getUIState({ isCopied, ...defaults });
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
