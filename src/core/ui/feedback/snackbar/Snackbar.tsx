import Button from '@core/ui/button/Button';
import { SNACKBAR_INTENT_STYLES } from '@core/ui/feedback/snackbar/constants/snackbar.constants';
import type { SnackbarProps } from '@core/ui/feedback/snackbar/types/snackbar.types';
import { classNames } from '@core/utils/classNames';
import { useEffect, useRef } from 'react';

function useAutoDismiss({
	isOpen,
	autoDismiss,
	dismissAfter,
	onDismiss,
}: {
	readonly isOpen: boolean;
	readonly autoDismiss: boolean;
	readonly dismissAfter: number;
	readonly onDismiss: (() => void) | undefined;
}): void {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (isOpen && autoDismiss && onDismiss) {
			timeoutRef.current = setTimeout(() => {
				onDismiss();
			}, dismissAfter);

			return () => {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
			};
		}
		return undefined;
	}, [isOpen, autoDismiss, dismissAfter, onDismiss]);
}

function DismissButton({ onDismiss }: { readonly onDismiss: () => void }) {
	return (
		<button
			type="button"
			onClick={onDismiss}
			aria-label="Dismiss notification"
			className="ml-2 text-current/80 hover:text-current"
		>
			<svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
				<path
					fillRule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clipRule="evenodd"
				/>
			</svg>
		</button>
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
		<output
			aria-live="polite"
			className={classNames(
				'fixed z-50 flex min-w-[300px] max-w-[500px] items-center justify-between gap-4 rounded-lg px-4 py-3 shadow-lg transition-all duration-300',
				SNACKBAR_INTENT_STYLES[intent],
				className
			)}
		>
			<div className="flex-1 text-sm font-medium">{message}</div>
			{action ? (
				<Button
					type="button"
					size="sm"
					variant="ghost"
					onClick={action.onClick}
					className="text-current hover:bg-white/20"
				>
					{action.label}
				</Button>
			) : null}
			{onDismiss ? <DismissButton onDismiss={onDismiss} /> : null}
		</output>
	);
}
