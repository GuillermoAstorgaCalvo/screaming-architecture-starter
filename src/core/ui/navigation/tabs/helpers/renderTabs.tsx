import { TabsList } from '@core/ui/navigation/tabs/components/TabsList';
import { TabsPanel } from '@core/ui/navigation/tabs/components/TabsPanel';
import { getTabsClasses } from '@core/ui/navigation/tabs/helpers/TabsHelpers';
import type { UseTabsReturn } from '@core/ui/navigation/tabs/hooks/useTabs';
import type { TabsProps } from '@src-types/ui/navigation/tabs';

export interface RenderTabsOptions {
	readonly id: string;
	readonly activeTab: TabsProps['items'][number] | undefined;
	readonly items: TabsProps['items'];
	readonly variant: TabsProps['variant'];
	readonly size: TabsProps['size'];
	readonly fullWidth: boolean;
	readonly activeTabId: string;
	readonly onTabChange: (tabId: string) => void;
	readonly handleKeyDown: UseTabsReturn['handleKeyDown'];
	readonly className: string | undefined;
	readonly props: Omit<
		Readonly<TabsProps>,
		| 'items'
		| 'activeTabId'
		| 'onTabChange'
		| 'variant'
		| 'size'
		| 'fullWidth'
		| 'tabsId'
		| 'className'
	>;
}

/**
 * Renders the tabs component structure
 *
 * @param options - Configuration options for rendering tabs
 * @returns JSX element representing the tabs structure
 */
export function renderTabs(options: RenderTabsOptions) {
	return (
		<div
			className={getTabsClasses(options.variant ?? 'default', options.fullWidth, options.className)}
			{...options.props}
		>
			<TabsList
				items={options.items}
				id={options.id}
				variant={options.variant ?? 'default'}
				size={options.size ?? 'md'}
				fullWidth={options.fullWidth}
				activeTabId={options.activeTabId}
				onTabChange={options.onTabChange}
				onKeyDown={options.handleKeyDown}
			/>
			<TabsPanel id={options.id} activeTab={options.activeTab} />
		</div>
	);
}
