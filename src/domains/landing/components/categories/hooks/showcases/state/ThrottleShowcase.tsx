import Card from '@core/ui/data-display/card/Card';
import Input from '@core/ui/forms/input/Input';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

interface ThrottleShowcaseProps {
	readonly inputValue: string;
	readonly onInputChange: (value: string) => void;
	readonly throttledValue: string;
}

export function ThrottleShowcase({
	inputValue,
	onInputChange,
	throttledValue,
}: ThrottleShowcaseProps) {
	return (
		<ShowcaseSection
			title="useThrottle"
			description="Throttle a value"
			tags={['hook', 'throttle', 'performance']}
		>
			<div className="space-y-4">
				<Input
					label="Type to see throttled value (1000ms throttle)"
					value={inputValue}
					onChange={e => onInputChange(e.target.value)}
				/>
				<Card variant="outlined" padding="sm">
					<Text size="sm">
						<strong>Current:</strong> {inputValue || '(empty)'}
					</Text>
					<Text size="sm">
						<strong>Throttled:</strong> {throttledValue || '(empty)'}
					</Text>
				</Card>
			</div>
		</ShowcaseSection>
	);
}
