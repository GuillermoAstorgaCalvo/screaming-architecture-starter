import type { FocusEvent } from 'react';

export function createFocusHandlers() {
	const handleFocus = (_index: number, e: FocusEvent<HTMLInputElement>): void => {
		e.target.select();
	};
	return handleFocus;
}
