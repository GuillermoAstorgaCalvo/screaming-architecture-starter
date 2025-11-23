import { useDeferredActivation } from '@core/hooks/useDeferredActivation';
import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function DeferredActivationShowcase() {
	return (
		<ShowcaseSection
			title="useDeferredActivation"
			description="Defer activation until user interaction"
			tags={['hook', 'defer', 'performance', 'loading']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Status:</strong>{' '}
					{useDeferredActivation() ? 'Activated' : 'Waiting for interaction'}
				</Text>
				<Text size="sm" className="mt-2 text-muted-foreground">
					useDeferredActivation returns true once the user has interacted with the page (click,
					keypress, etc.) or after a timeout. Useful for deferring non-critical UI or scripts until
					the page is interactive.
				</Text>
			</Card>
		</ShowcaseSection>
	);
}
