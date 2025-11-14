import { renderTabs } from '@core/ui/navigation/tabs/helpers/renderTabs';
import { useTabs } from '@core/ui/navigation/tabs/hooks/useTabs';
import { useTabsSetup } from '@core/ui/navigation/tabs/hooks/useTabsSetup';
import type { TabsProps } from '@src-types/ui/navigation/tabs';

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
