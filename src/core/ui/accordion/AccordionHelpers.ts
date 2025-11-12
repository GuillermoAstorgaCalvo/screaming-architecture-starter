import {
	ACCORDION_BASE_CLASSES,
	ACCORDION_CONTENT_BASE_CLASSES,
	ACCORDION_CONTENT_SIZE_CLASSES,
	ACCORDION_HEADER_BASE_CLASSES,
	ACCORDION_HEADER_SIZE_CLASSES,
	ACCORDION_ITEM_BASE_CLASSES,
	ACCORDION_VARIANT_CLASSES,
} from '@core/constants/ui/navigation';
import type { StandardSize } from '@src-types/ui/base';
import type { AccordionVariant } from '@src-types/ui/navigation';
import { twMerge } from 'tailwind-merge';

export function getAccordionClasses(variant: AccordionVariant, className?: string): string {
	const variantClasses = ACCORDION_VARIANT_CLASSES[variant];
	return twMerge(ACCORDION_BASE_CLASSES, variantClasses, className);
}

export function getAccordionItemClasses(variant: AccordionVariant): string {
	const variantClasses = ACCORDION_VARIANT_CLASSES[variant];
	return twMerge(ACCORDION_ITEM_BASE_CLASSES, variant === 'bordered' ? variantClasses : '');
}

export function getHeaderClasses(size: StandardSize): string {
	return twMerge(ACCORDION_HEADER_BASE_CLASSES, ACCORDION_HEADER_SIZE_CLASSES[size]);
}

export function getContentClasses(size: StandardSize, isExpanded: boolean): string {
	const sizeClasses = ACCORDION_CONTENT_SIZE_CLASSES[size];
	const heightClass = isExpanded ? 'max-h-[1000px]' : 'max-h-0';
	return twMerge(ACCORDION_CONTENT_BASE_CLASSES, sizeClasses, heightClass);
}

export function getAccordionItemIds(
	id: string,
	itemId: string
): {
	headerId: string;
	contentId: string;
} {
	const fullItemId = `${id}-item-${itemId}`;
	return {
		headerId: `${fullItemId}-header`,
		contentId: `${fullItemId}-content`,
	};
}
