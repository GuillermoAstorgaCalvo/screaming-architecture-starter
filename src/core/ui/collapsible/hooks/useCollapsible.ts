import { useId, useState } from 'react';

import { createToggleHandler } from './CollapsibleHelpers';

export interface UseCollapsibleStateParams {
	defaultExpanded: boolean;
	controlledExpanded: boolean | undefined;
	onExpandedChange?: ((expanded: boolean) => void) | undefined;
}

export interface UseCollapsibleStateReturn {
	expanded: boolean;
	isControlled: boolean;
	setInternalExpanded: (value: boolean) => void;
}

/**
 * Manages collapsible state (controlled or uncontrolled)
 */
export function useCollapsibleState({
	defaultExpanded,
	controlledExpanded,
}: Readonly<UseCollapsibleStateParams>): UseCollapsibleStateReturn {
	const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
	const isControlled = controlledExpanded !== undefined;
	const expanded = isControlled ? controlledExpanded : internalExpanded;

	return {
		expanded,
		isControlled,
		setInternalExpanded,
	};
}

/**
 * Generates unique IDs for collapsible header and content
 */
export function useCollapsibleIds(): { headerId: string; contentId: string } {
	const collapsibleId = useId();
	return {
		headerId: `${collapsibleId}-header`,
		contentId: `${collapsibleId}-content`,
	};
}

interface UseCollapsibleParams {
	defaultExpanded: boolean;
	controlledExpanded: boolean | undefined;
	onExpandedChange?: ((expanded: boolean) => void) | undefined;
	disabled: boolean;
}

interface UseCollapsibleReturn {
	expanded: boolean;
	headerId: string;
	contentId: string;
	handleToggle: () => void;
}

/**
 * Main hook that combines state management, ID generation, and toggle handler
 */
export function useCollapsible({
	defaultExpanded,
	controlledExpanded,
	onExpandedChange,
	disabled,
}: Readonly<UseCollapsibleParams>): UseCollapsibleReturn {
	const { expanded, isControlled, setInternalExpanded } = useCollapsibleState({
		defaultExpanded,
		controlledExpanded,
		onExpandedChange,
	});

	const { headerId, contentId } = useCollapsibleIds();

	const handleToggle = createToggleHandler({
		expanded,
		isControlled,
		disabled,
		setInternalExpanded,
		onExpandedChange,
	});

	return {
		expanded,
		headerId,
		contentId,
		handleToggle,
	};
}
