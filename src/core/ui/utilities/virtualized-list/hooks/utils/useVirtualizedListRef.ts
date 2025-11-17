import { type RefObject, useRef } from 'react';

/**
 * Creates and returns a ref for the virtualized list container
 */
export function useVirtualizedListRef(): RefObject<HTMLDivElement | null> {
	return useRef<HTMLDivElement>(null);
}
