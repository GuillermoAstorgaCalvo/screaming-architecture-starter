import EmptyState from '@core/ui/feedback/empty-state/EmptyState';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function EmptyStateShowcase() {
	return (
		<ShowcaseSection
			title="EmptyState"
			description="Empty state component"
			tags={['feedback', 'empty', 'state']}
		>
			<EmptyState
				title="No items found"
				description="Get started by creating your first item."
				actionLabel="Create Item"
				onAction={() => {}}
			/>
		</ShowcaseSection>
	);
}
