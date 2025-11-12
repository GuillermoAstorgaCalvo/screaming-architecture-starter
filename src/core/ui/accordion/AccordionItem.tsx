import type { StandardSize } from '@src-types/ui/base';
import type { AccordionProps, AccordionVariant } from '@src-types/ui/navigation';
import { useMemo } from 'react';

import { AccordionContent } from './AccordionContent';
import { AccordionHeader } from './AccordionHeader';
import { getAccordionItemClasses, getAccordionItemIds } from './AccordionHelpers';

type AccordionItemProps = Readonly<{
	item: AccordionProps['items'][number];
	id: string;
	variant: AccordionVariant;
	size: StandardSize;
	isExpanded: boolean;
	onToggle: () => void;
}>;

export function AccordionItem({
	item,
	id,
	variant,
	size,
	isExpanded,
	onToggle,
}: AccordionItemProps) {
	const { headerId, contentId } = useMemo(() => getAccordionItemIds(id, item.id), [id, item.id]);

	return (
		<div className={getAccordionItemClasses(variant)}>
			<AccordionHeader
				headerId={headerId}
				contentId={contentId}
				isExpanded={isExpanded}
				{...(item.disabled !== undefined && { disabled: item.disabled })}
				onToggle={onToggle}
				size={size}
				header={item.header}
			/>
			<AccordionContent
				contentId={contentId}
				headerId={headerId}
				size={size}
				isExpanded={isExpanded}
				content={item.content}
			/>
		</div>
	);
}
