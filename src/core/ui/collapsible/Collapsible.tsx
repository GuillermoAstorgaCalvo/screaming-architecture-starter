import type { HTMLAttributes, ReactNode } from 'react';

import { CollapsibleContent } from './CollapsibleContent';
import { CollapsibleHeader } from './CollapsibleHeader';
import { getContainerClasses } from './CollapsibleHelpers';
import { useCollapsible } from './useCollapsible';

export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Header content (always visible) */
	header: ReactNode;
	/** Content to show/hide */
	children: ReactNode;
	/** Whether the collapsible is expanded by default @default false */
	defaultExpanded?: boolean;
	/** Whether the collapsible is expanded (controlled) */
	expanded?: boolean;
	/** Callback when expanded state changes */
	onExpandedChange?: (expanded: boolean) => void;
	/** Whether the collapsible is disabled @default false */
	disabled?: boolean;
	/** Additional CSS classes */
	className?: string;
	/** Additional CSS classes for the header */
	headerClassName?: string;
	/** Additional CSS classes for the content */
	contentClassName?: string;
}

/**
 * Collapsible - Simple expand/collapse component for single sections
 *
 * Features: Accessible ARIA attributes, controlled/uncontrolled modes,
 * smooth animations, dark mode support. Simpler alternative to Accordion.
 *
 * @example
 * ```tsx
 * <Collapsible header="Click to expand">
 *   <div>Hidden content</div>
 * </Collapsible>
 * ```
 */
export default function Collapsible({
	header,
	children,
	defaultExpanded = false,
	expanded: controlledExpanded,
	onExpandedChange,
	disabled = false,
	className,
	headerClassName,
	contentClassName,
	...props
}: Readonly<CollapsibleProps>) {
	const { expanded, headerId, contentId, handleToggle } = useCollapsible({
		defaultExpanded,
		controlledExpanded,
		onExpandedChange,
		disabled,
	});

	return (
		<div className={getContainerClasses(className)} {...props}>
			<CollapsibleHeader
				header={header}
				headerId={headerId}
				contentId={contentId}
				expanded={expanded}
				disabled={disabled}
				headerClassName={headerClassName}
				onToggle={handleToggle}
			/>
			<CollapsibleContent
				contentId={contentId}
				headerId={headerId}
				expanded={expanded}
				contentClassName={contentClassName}
			>
				{children}
			</CollapsibleContent>
		</div>
	);
}
