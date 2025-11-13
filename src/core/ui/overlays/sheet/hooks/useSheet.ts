import { useEffect, useId } from 'react';

/**
 * Generates a unique sheet ID using React's useId hook
 */
export function useSheetId(sheetId: string | undefined): string {
	const generatedId = useId();
	return sheetId ?? `sheet-${generatedId}`;
}

/**
 * Hook to manage body overflow when sheet is open
 */
export function useBodyOverflow(isOpen: boolean): void {
	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);
}
