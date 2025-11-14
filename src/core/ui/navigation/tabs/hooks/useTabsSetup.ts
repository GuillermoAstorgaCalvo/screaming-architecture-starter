import type { TabsProps } from '@src-types/ui/navigation/tabs';
import { useId } from 'react';

export interface UseTabsSetupOptions {
	readonly items: TabsProps['items'];
	readonly activeTabId: string;
	readonly tabsId: string | undefined;
}

export interface UseTabsSetupReturn {
	readonly id: string;
	readonly activeTab: TabsProps['items'][number] | undefined;
}

/**
 * Hook to set up tabs with ID generation and active tab resolution
 *
 * @param options - Configuration options for tabs setup
 * @returns Generated tabs ID and active tab item
 */
export function useTabsSetup({
	items,
	activeTabId,
	tabsId,
}: UseTabsSetupOptions): UseTabsSetupReturn {
	const generatedId = useId();
	const id = tabsId ?? `tabs-${generatedId}`;
	const activeTab = items.find((item: TabsProps['items'][number]) => item.id === activeTabId);
	return { id, activeTab };
}
