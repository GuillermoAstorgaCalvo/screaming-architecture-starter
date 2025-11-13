import { TabsList } from '@core/ui/navigation/tabs/components/TabsList';
import { TabsPanel } from '@core/ui/navigation/tabs/components/TabsPanel';
import { getTabsClasses } from '@core/ui/navigation/tabs/helpers/TabsHelpers';
import { useTabs, type UseTabsReturn } from '@core/ui/navigation/tabs/hooks/useTabs';
import type { TabsProps } from '@src-types/ui/navigation/tabs';
import { useId } from 'react';

interface UseTabsSetupOptions {
	readonly items: TabsProps['items'];
	readonly activeTabId: string;
	readonly tabsId: string | undefined;
}

interface UseTabsSetupReturn {
	readonly id: string;
	readonly activeTab: TabsProps['items'][number] | undefined;
}

function useTabsSetup({ items, activeTabId, tabsId }: UseTabsSetupOptions): UseTabsSetupReturn {
	const generatedId = useId();
	const id = tabsId ?? `tabs-${generatedId}`;
	const activeTab = items.find((item: TabsProps['items'][number]) => item.id === activeTabId);
	return { id, activeTab };
}

interface RenderTabsOptions {
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

function renderTabs(options: RenderTabsOptions) {
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

/**
 * Tabs - Tabbed interface component with keyboard navigation
 *
 * Features: Accessible ARIA, variants (default/pills/underline), sizes (sm/md/lg),
 * full width, icons, dark mode, keyboard nav (ArrowLeft/Right, Home, End)
 *
 * @example
 * ```tsx
 * const [activeTab, setActiveTab] = useState('tab1');
 * <Tabs items={[...]} activeTabId={activeTab} onTabChange={setActiveTab} />
 * ```
 */
export default function Tabs({
	items,
	activeTabId,
	onTabChange,
	variant = 'default',
	size = 'md',
	fullWidth = false,
	tabsId,
	className,
	...props
}: Readonly<TabsProps>) {
	const { id, activeTab } = useTabsSetup({ items, activeTabId, tabsId });
	const { handleKeyDown } = useTabs({ items, activeTabId, onTabChange });
	return renderTabs({
		id,
		activeTab,
		items,
		variant,
		size,
		fullWidth,
		activeTabId,
		onTabChange,
		handleKeyDown,
		className,
		props,
	});
}
