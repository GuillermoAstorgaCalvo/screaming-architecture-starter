import { useToggle } from '@core/hooks/ui/useToggle';
import Button from '@core/ui/button/Button';
import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ToggleShowcase() {
	const [isToggled, toggle] = useToggle(false);

	return (
		<ShowcaseSection
			title="useToggle"
			description="Toggle boolean state"
			tags={['hook', 'toggle', 'state']}
		>
			<div className="space-y-4">
				<Button variant="primary" onClick={toggle}>
					Toggle ({isToggled ? 'ON' : 'OFF'})
				</Button>
				<Card variant="outlined" padding="sm">
					<Text size="sm">Current state: {isToggled ? 'true' : 'false'}</Text>
				</Card>
			</div>
		</ShowcaseSection>
	);
}
