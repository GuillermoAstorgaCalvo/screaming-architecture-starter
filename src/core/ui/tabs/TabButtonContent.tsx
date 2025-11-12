import type { TabsProps } from '@src-types/ui/navigation';

// ============================================================================
// TabButtonContent Component
// ============================================================================

type TabButtonContentProps = Readonly<{
	item: TabsProps['items'][number];
}>;

export function TabButtonContent({ item }: TabButtonContentProps) {
	return (
		<>
			{item.icon ? <span className="mr-2">{item.icon}</span> : null}
			{item.label}
		</>
	);
}
