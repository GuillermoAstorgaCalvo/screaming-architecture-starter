import type { AccordionProps } from '@src-types/ui/navigation';
import { useId } from 'react';

import { getAccordionClasses } from './AccordionHelpers';
import { AccordionItem } from './AccordionItem';
import { useAccordion } from './useAccordion';

/**
 * Generates a unique accordion ID from the provided ID or a generated one.
 */
function getAccordionId(accordionId: string | undefined, generatedId: string): string {
	return accordionId ?? `accordion-${generatedId}`;
}

interface AccordionContainerPropsParams {
	variant: AccordionProps['variant'];
	allowMultiple: boolean;
	className: string | undefined;
	props: Omit<
		AccordionProps,
		'items' | 'allowMultiple' | 'variant' | 'size' | 'accordionId' | 'className'
	>;
}

/**
 * Gets the container props for the accordion wrapper element.
 */
function getAccordionContainerProps({
	variant,
	allowMultiple,
	className,
	props,
}: AccordionContainerPropsParams) {
	return {
		className: getAccordionClasses(variant ?? 'default', className),
		'aria-multiselectable': allowMultiple,
		...props,
	};
}

interface RenderAccordionItemsParams {
	items: AccordionProps['items'];
	id: string;
	variant: AccordionProps['variant'];
	size: AccordionProps['size'];
	expandedItems: Set<string>;
	toggleItem: (itemId: string) => void;
}

/**
 * Renders accordion items from the provided items array.
 */
function renderAccordionItems({
	items,
	id,
	variant,
	size,
	expandedItems,
	toggleItem,
}: RenderAccordionItemsParams) {
	return items.map((item: AccordionProps['items'][number]) => (
		<AccordionItem
			key={item.id}
			item={item}
			id={id}
			variant={variant ?? 'default'}
			size={size ?? 'md'}
			isExpanded={expandedItems.has(item.id)}
			onToggle={() => toggleItem(item.id)}
		/>
	));
}

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
	const renderedItems = renderAccordionItems({
		items,
		id,
		variant,
		size,
		expandedItems,
		toggleItem,
	});

	return <div {...containerProps}>{renderedItems}</div>;
}
