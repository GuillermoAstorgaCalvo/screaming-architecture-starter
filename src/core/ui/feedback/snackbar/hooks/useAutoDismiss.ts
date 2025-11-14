import { useEffect, useRef } from 'react';

export interface UseAutoDismissParams {
	readonly isOpen: boolean;
	readonly autoDismiss: boolean;
	readonly dismissAfter: number;
	readonly onDismiss: (() => void) | undefined;
}

/**
 * Hook to automatically dismiss a snackbar after a specified duration
 *
 * @param params - Configuration for auto-dismiss behavior
 * @param params.isOpen - Whether the snackbar is currently open
 * @param params.autoDismiss - Whether auto-dismiss is enabled
 * @param params.dismissAfter - Time in milliseconds before dismissing
 * @param params.onDismiss - Callback function to dismiss the snackbar
 */
export function useAutoDismiss({
	isOpen,
	autoDismiss,
	dismissAfter,
	onDismiss,
}: UseAutoDismissParams): void {
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
