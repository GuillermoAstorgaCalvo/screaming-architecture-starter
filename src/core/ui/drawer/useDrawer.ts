import { useEffect, useId } from 'react';

/**
 * Generates a unique drawer ID using React's useId hook
 */
export function useDrawerId(drawerId: string | undefined): string {
	const generatedId = useId();
	return drawerId ?? `drawer-${generatedId}`;
}

/**
 * Hook to manage body overflow when drawer is open
 */
export function useBodyOverflow(isOpen: boolean): void {
	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);
}
