import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Accordion variant types
 */
export type AccordionVariant = 'default' | 'bordered' | 'separated';

/**
 * Accordion item data
 */
export interface AccordionItem {
	/** Unique identifier for the item */
	id: string;
	/** Item header content */
	header: ReactNode;
	/** Item content */
	content: ReactNode;
	/** Whether the item is expanded by default @default false */
	defaultExpanded?: boolean;
	/** Whether the item is disabled @default false */
	disabled?: boolean;
}

/**
 * Accordion component props
 */
export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of accordion items */
	items: readonly AccordionItem[];
	/** Whether multiple items can be expanded at once @default false */
	allowMultiple?: boolean;
	/** Visual variant of the accordion @default 'default' */
	variant?: AccordionVariant;
	/** Size of the accordion @default 'md' */
	size?: StandardSize;
	/** Optional accordion ID for accessibility */
	accordionId?: string;
}
