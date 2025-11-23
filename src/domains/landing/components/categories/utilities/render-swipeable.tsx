import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import Swipeable from '@core/ui/utilities/swipeable/Swipeable';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderSwipeableShowcase() {
	return (
		<ShowcaseSection
			title="Swipeable"
			description="Swipeable component for mobile gestures"
			tags={['utility', 'swipe', 'mobile', 'gesture']}
		>
			<div className="space-y-4">
				<Swipeable
					direction="horizontal"
					threshold={50}
					leftActions={[
						{
							id: 'delete',
							content: <Text className="text-white">Delete</Text>,
							background: 'bg-destructive',
							onAction: () => {
								// Delete action handler
							},
						},
					]}
					rightActions={[
						{
							id: 'edit',
							content: <Text className="text-white">Edit</Text>,
							background: 'bg-primary',
							onAction: () => {
								// Edit action handler
							},
						},
					]}
				>
					<Card variant="outlined" padding="md">
						<Text>Swipe left or right to reveal actions (mobile/touch devices)</Text>
					</Card>
				</Swipeable>
			</div>
		</ShowcaseSection>
	);
}
