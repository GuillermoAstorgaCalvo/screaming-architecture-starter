import { useInterval } from '@core/hooks/interval/useInterval';
import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

export function IntervalShowcase() {
	const [counter, setCounter] = useState(0);

	useInterval(() => {
		setCounter(prev => prev + 1);
	}, 1000);

	return (
		<ShowcaseSection
			title="useInterval"
			description="Run code at intervals"
			tags={['hook', 'interval', 'timer']}
		>
			<Card variant="outlined" padding="sm">
				<Text size="sm">
					<strong>Counter (updates every second):</strong> {counter}
				</Text>
			</Card>
		</ShowcaseSection>
	);
}
