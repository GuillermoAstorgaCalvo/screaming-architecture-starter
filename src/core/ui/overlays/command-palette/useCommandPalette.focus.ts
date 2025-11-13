import { type RefObject, useEffect } from 'react';

export function useFocusManagement(
	isOpen: boolean,
	searchInputRef: RefObject<HTMLInputElement | null>
) {
	useEffect(() => {
		if (isOpen && searchInputRef.current) {
			// Small delay to ensure DOM is ready
			setTimeout(() => {
				searchInputRef.current?.focus();
			}, 0);
		}
	}, [isOpen, searchInputRef]);
}
