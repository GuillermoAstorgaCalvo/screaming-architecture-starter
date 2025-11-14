import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { createRef, type RefObject } from 'react';

/**
 * Creates refs for all menubar items
 */
export function createItemRefs(
	items: readonly MenubarItem[]
): Map<string, RefObject<HTMLButtonElement>> {
	const refs = new Map<string, RefObject<HTMLButtonElement>>();
	for (const item of items) {
		refs.set(item.id, createRef<HTMLButtonElement>() as RefObject<HTMLButtonElement>);
	}
	return refs;
}
