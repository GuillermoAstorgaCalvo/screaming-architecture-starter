import { ARIA_LABELS, ARIA_ROLES } from '@core/constants/aria';
import type { StandardSize } from '@src-types/ui/base';
import type { TabsProps, TabsVariant } from '@src-types/ui/navigation';
import { type KeyboardEvent, useMemo } from 'react';

import { TabButton } from './TabButton';
import { getTabsClasses } from './TabsHelpers';

// ============================================================================
// TabsList Component
// ============================================================================

type TabsListProps = Readonly<{
	items: TabsProps['items'];
	id: string;
	variant: TabsVariant;
	size: StandardSize;
	fullWidth: boolean;
	activeTabId: string;
	onTabChange: (tabId: string) => void;
	onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}>;

function renderTabButton(props: {
	item: TabsProps['items'][number];
	id: string;
	variant: TabsVariant;
	size: StandardSize;
	fullWidth: boolean;
	activeTabId: string;
	onTabChange: (tabId: string) => void;
}) {
	return (
		<TabButton
			key={props.item.id}
			item={props.item}
			id={props.id}
			variant={props.variant}
			size={props.size}
			fullWidth={props.fullWidth}
			isActive={props.item.id === props.activeTabId}
			onTabChange={props.onTabChange}
		/>
	);
}

export function TabsList({
	items,
	id,
	variant,
	size,
	fullWidth,
	activeTabId,
	onTabChange,
	onKeyDown,
}: TabsListProps) {
	const tablistClasses = useMemo(() => getTabsClasses(variant, fullWidth), [variant, fullWidth]);
	const tabButtons = useMemo(
		() =>
			items.map((item: TabsProps['items'][number]) =>
				renderTabButton({ item, id, variant, size, fullWidth, activeTabId, onTabChange })
			),
		[items, id, variant, size, fullWidth, activeTabId, onTabChange]
	);

	// Note: Using div with role="tablist" is the correct ARIA pattern for tabs
	// The div has proper keyboard handling via onKeyDown and tabIndex for focus management
	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions -- This div has role="tablist" and proper keyboard handling, which is the correct ARIA pattern
		<div
			role={ARIA_ROLES.TABLIST}
			aria-label={ARIA_LABELS.TABS}
			tabIndex={0} // NOSONAR: typescript:S6845 - tabIndex is required for keyboard navigation on tablist container per ARIA spec
			onKeyDown={onKeyDown}
			className={tablistClasses}
		>
			{tabButtons}
		</div>
	);
}
