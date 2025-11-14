import type { AccordionProps } from '@src-types/ui/navigation/accordion';
import { useId } from 'react';

import { AccordionItem } from './components/AccordionItem';
import { getAccordionContainerProps, getAccordionId } from './helpers/AccordionHelpers';
import { useAccordion } from './hooks/useAccordion';

/**
 * Accordion - Collapsible content component
 *
 * Features:
 * - Accessible: proper ARIA attributes and keyboard navigation
 * - Multiple variants: default, bordered, separated
 * - Size variants: sm, md, lg
 * - Support for single or multiple expanded items
 * - Smooth expand/collapse animations
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Accordion
 *   items={[
 *     { id: 'item1', header: 'Header 1', content: <div>Content 1</div> },
 *     { id: 'item2', header: 'Header 2', content: <div>Content 2</div> },
 *   ]}
 *   allowMultiple={false}
 *   variant="default"
 * />
 * ```
 */
export default function Accordion({
	items,
	allowMultiple = false,
	variant = 'default',
	size = 'md',
	accordionId,
	className,
	...props
}: Readonly<AccordionProps>) {
	const generatedId = useId();
	const id = getAccordionId(accordionId, generatedId);
	const { expandedItems, toggleItem } = useAccordion(items, allowMultiple);
	const containerProps = getAccordionContainerProps({ variant, allowMultiple, className, props });

	const renderedItems = items.map((item: AccordionProps['items'][number]) => (
		<AccordionItem
			key={item.id}
			item={item}
			id={id}
			variant={variant}
			size={size}
			isExpanded={expandedItems.has(item.id)}
			onToggle={() => toggleItem(item.id)}
		/>
	));

	return <div {...containerProps}>{renderedItems}</div>;
}
