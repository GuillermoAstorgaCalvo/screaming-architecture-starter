import Button from '@core/ui/button/Button';
import { DismissButton } from '@core/ui/feedback/snackbar/components/DismissButton';
import { SNACKBAR_INTENT_STYLES } from '@core/ui/feedback/snackbar/constants/snackbar.constants';
import { useAutoDismiss } from '@core/ui/feedback/snackbar/hooks/useAutoDismiss';
import type {
	SnackbarIntent,
	SnackbarProps,
} from '@core/ui/feedback/snackbar/types/snackbar.types';
import { componentZIndex } from '@core/ui/theme/tokens';
import { classNames } from '@core/utils/classNames';

const SNACKBAR_STYLE = {
	zIndex: componentZIndex.popover,
	minWidth: 'calc(var(--spacing-3xl) * 6.25)',
	maxWidth: 'calc(var(--spacing-4xl) * 7.8125)',
} as const;

function SnackbarContent({
	message,
	intent,
	className,
	action,
	onDismiss,
}: Readonly<{
	message: SnackbarProps['message'];
	intent: SnackbarIntent;
	className?: string | undefined;
	action?: SnackbarProps['action'] | undefined;
	onDismiss?: (() => void) | undefined;
}>) {
	return (
		<output
			aria-live="polite"
			className={classNames(
				'fixed flex items-center justify-between gap-md rounded-lg px-md py-md shadow-lg transition-all duration-slow',
				SNACKBAR_INTENT_STYLES[intent],
				className
			)}
			style={SNACKBAR_STYLE}
		>
			<div className="flex-1 text-sm font-medium">{message}</div>
			{action ? (
				<Button
					type="button"
					size="sm"
					variant="ghost"
					onClick={action.onClick}
					className="text-current hover:bg-surface/20"
				>
					{action.label}
				</Button>
			) : null}
			{onDismiss ? <DismissButton onDismiss={onDismiss} /> : null}
		</output>
	);
}

/**
 * Snackbar - Simple bottom-positioned notification component
 *
 * Features:
 * - Appears at bottom of screen (less intrusive than Toast)
 * - Auto-dismisses by default
 * - Simple, minimal design
 * - Optional action button
 * - Accessible with proper ARIA attributes
 *
 * @example
 * ```tsx
 * <Snackbar
 *   isOpen={isOpen}
 *   onDismiss={() => setIsOpen(false)}
 *   message="Item saved successfully"
 *   intent="success"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Snackbar
 *   isOpen={isOpen}
 *   onDismiss={() => setIsOpen(false)}
 *   message="Connection lost"
 *   intent="error"
 *   action={{
 *     label: "Retry",
 *     onClick: handleRetry
 *   }}
 * />
 * ```
 */
export default function Snackbar({
	isOpen,
	onDismiss,
	message,
	intent = 'info',
	className,
	autoDismiss = true,
	dismissAfter = 4000,
	action,
}: Readonly<SnackbarProps>) {
	useAutoDismiss({ isOpen, autoDismiss, dismissAfter, onDismiss });

	if (!isOpen) {
		return null;
	}

	return (
		<SnackbarContent
			message={message}
			intent={intent}
			className={className}
			action={action}
			onDismiss={onDismiss}
		/>
	);
}
