import type { AccordionProps } from '@src-types/ui/navigation';
import { useCallback, useMemo, useState } from 'react';

function updateExpandedItems(
	itemId: string,
	prev: Set<string>,
	allowMultiple: boolean
): Set<string> {
	const newSet = new Set(prev);
	if (newSet.has(itemId)) {
		newSet.delete(itemId);
	} else {
		if (!allowMultiple) {
			newSet.clear();
		}
		newSet.add(itemId);
	}
	return newSet;
}

export interface UseAccordionReturn {
	readonly expandedItems: Set<string>;
	readonly toggleItem: (itemId: string) => void;
}

export function useAccordion(
	items: AccordionProps['items'],
	allowMultiple: boolean
): UseAccordionReturn {
	const initialExpandedItems = useMemo(
		() =>
			new Set(
				items
					.filter((item: AccordionProps['items'][number]) => item.defaultExpanded)
					.map((item: AccordionProps['items'][number]) => item.id)
			),
		[items]
	);

	const [expandedItems, setExpandedItems] = useState<Set<string>>(initialExpandedItems);

	const toggleItem = useCallback(
		(itemId: string) => {
			setExpandedItems(prev => updateExpandedItems(itemId, prev, allowMultiple));
		},
		[allowMultiple]
	);

	return { expandedItems, toggleItem };
}
