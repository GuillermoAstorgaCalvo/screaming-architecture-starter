import { ARIA_ROLES } from '@core/constants/aria';
import type { TabsProps } from '@src-types/ui/navigation/tabs';
import { useMemo } from 'react';

// ============================================================================
// TabsPanel Component
// ============================================================================

type TabsPanelProps = Readonly<{
	id: string;
	activeTab: TabsProps['items'][number] | undefined;
}>;

export function TabsPanel({ id, activeTab }: TabsPanelProps) {
	const panelId = useMemo(() => (activeTab ? `${id}-panel-${activeTab.id}` : ''), [id, activeTab]);
	const tabId = useMemo(() => (activeTab ? `${id}-tab-${activeTab.id}` : ''), [id, activeTab]);

	if (!activeTab) {
		return null;
	}

	return (
		<div id={panelId} role={ARIA_ROLES.TABPANEL} aria-labelledby={tabId} className="mt-4">
			{activeTab.content}
		</div>
	);
}
