import { twMerge } from 'tailwind-merge';

export const COLLAPSIBLE_BASE_CLASSES = 'w-full';
export const HEADER_BASE_CLASSES =
	'flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
export const CONTENT_BASE_CLASSES = 'overflow-hidden transition-all duration-200 ease-in-out';
export const CONTENT_EXPANDED_CLASSES = 'max-h-[1000px] opacity-100';
export const CONTENT_COLLAPSED_CLASSES = 'max-h-0 opacity-0';

interface CreateToggleHandlerParams {
	expanded: boolean;
	isControlled: boolean;
	disabled: boolean;
	setInternalExpanded: (value: boolean) => void;
	onExpandedChange?: ((expanded: boolean) => void) | undefined;
}

/**
 * Creates a toggle handler for the collapsible
 */
export function createToggleHandler({
	expanded,
	isControlled,
	disabled,
	setInternalExpanded,
	onExpandedChange,
}: Readonly<CreateToggleHandlerParams>): () => void {
	return () => {
		if (disabled) return;
		const newExpanded = !expanded;
		if (!isControlled) {
			setInternalExpanded(newExpanded);
		}
		onExpandedChange?.(newExpanded);
	};
}

/**
 * Computes CSS classes for the container
 */
export function getContainerClasses(className?: string): string {
	return twMerge(COLLAPSIBLE_BASE_CLASSES, className);
}

/**
 * Computes CSS classes for the header
 */
export function getHeaderClasses(headerClassName?: string): string {
	return twMerge(HEADER_BASE_CLASSES, headerClassName);
}

/**
 * Computes CSS classes for the content based on expanded state
 */
export function getContentClasses(isExpanded: boolean, className?: string): string {
	return twMerge(
		CONTENT_BASE_CLASSES,
		isExpanded ? CONTENT_EXPANDED_CLASSES : CONTENT_COLLAPSED_CLASSES,
		className
	);
}
