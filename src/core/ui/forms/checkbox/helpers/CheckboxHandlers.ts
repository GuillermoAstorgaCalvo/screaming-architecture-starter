import type { ChangeEvent, MouseEvent } from 'react';

export function handleDisabledChange(e: ChangeEvent<HTMLInputElement>) {
	// Prevent onChange when disabled to stop React's internal state management
	e.preventDefault();
	e.stopPropagation();
}

export function handleDisabledClick(e: MouseEvent<HTMLInputElement>) {
	// Prevent click when disabled to stop React's internal state management
	e.preventDefault();
	e.stopPropagation();
}
