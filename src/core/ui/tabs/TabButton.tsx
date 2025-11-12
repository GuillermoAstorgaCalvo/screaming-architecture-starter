import { ARIA_ROLES } from '@core/constants/aria';
import type { StandardSize } from '@src-types/ui/base';
import type { TabsProps, TabsVariant } from '@src-types/ui/navigation';
import { useCallback, useMemo } from 'react';

import { TabButtonContent } from './TabButtonContent';
import { getTabButtonClasses, getTabIds } from './TabsHelpers';

// ============================================================================
// Types
// ============================================================================

type TabButtonProps = Readonly<{
	item: TabsProps['items'][number];
	id: string;
	variant: TabsVariant;
	size: StandardSize;
	fullWidth: boolean;
	isActive: boolean;
	onTabChange: (tabId: string) => void;
}>;

type UseTabButtonOptions = Readonly<{
	item: TabButtonProps['item'];
	id: TabButtonProps['id'];
	variant: TabButtonProps['variant'];
	size: TabButtonProps['size'];
	fullWidth: TabButtonProps['fullWidth'];
	isActive: TabButtonProps['isActive'];
	onTabChange: TabButtonProps['onTabChange'];
}>;

// ============================================================================
// Hooks
// ============================================================================

function useTabButtonIds(id: string, itemId: string) {
	return useMemo(() => getTabIds(id, itemId), [id, itemId]);
}

function useTabButtonClick(
	item: TabButtonProps['item'],
	onTabChange: TabButtonProps['onTabChange']
) {
	return useCallback(() => {
		if (!item.disabled) onTabChange(item.id);
	}, [item.disabled, item.id, onTabChange]);
}

type UseTabButtonClassesOptions = Readonly<{
	variant: TabsVariant;
	size: StandardSize;
	isActive: boolean;
	fullWidth: boolean;
}>;

function useTabButtonClasses(options: UseTabButtonClassesOptions) {
	const { variant, size, isActive, fullWidth } = options;
	return useMemo(
		() => getTabButtonClasses({ variant, size, isActive, fullWidth }),
		[variant, size, isActive, fullWidth]
	);
}

function useTabButton(options: UseTabButtonOptions) {
	const { item, id, variant, size, fullWidth, isActive, onTabChange } = options;
	const { tabId, panelId } = useTabButtonIds(id, item.id);
	const handleClick = useTabButtonClick(item, onTabChange);
	const buttonClasses = useTabButtonClasses({ variant, size, isActive, fullWidth });

	return {
		tabId,
		panelId,
		handleClick,
		buttonClasses,
	};
}

// ============================================================================
// Helpers
// ============================================================================

type GetButtonPropsOptions = Readonly<{
	tabId: string;
	panelId: string;
	isActive: boolean;
	disabled: boolean;
	handleClick: () => void;
	buttonClasses: string;
}>;

function getButtonProps(options: GetButtonPropsOptions) {
	const { tabId, panelId, isActive, disabled, handleClick, buttonClasses } = options;
	return {
		id: tabId,
		role: ARIA_ROLES.TAB,
		'aria-selected': isActive,
		'aria-controls': panelId,
		tabIndex: isActive ? 0 : -1,
		disabled,
		onClick: handleClick,
		className: buttonClasses,
	};
}

// ============================================================================
// TabButton Component
// ============================================================================

export function TabButton(props: TabButtonProps) {
	const { item, isActive } = props;
	const { tabId, panelId, handleClick, buttonClasses } = useTabButton(props);
	const buttonProps = getButtonProps({
		tabId,
		panelId,
		isActive,
		disabled: item.disabled ?? false,
		handleClick,
		buttonClasses,
	});

	return (
		<button {...buttonProps}>
			<TabButtonContent item={item} />
		</button>
	);
}
