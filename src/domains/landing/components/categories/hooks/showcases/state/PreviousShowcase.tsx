import Card from '@core/ui/data-display/card/Card';
import Input from '@core/ui/forms/input/Input';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

interface PreviousShowcaseProps {
	readonly inputValue: string;
	readonly onInputChange: (value: string) => void;
	readonly previousValue: string | undefined;
}

export function PreviousShowcase({
	inputValue,
	onInputChange,
	previousValue,
}: PreviousShowcaseProps) {
	return (
		<ShowcaseSection
			title="usePrevious"
			description="Get previous value"
			tags={['hook', 'previous', 'state']}
		>
			<div className="space-y-4">
				<Input
					label="Type to see previous value"
					value={inputValue}
					onChange={e => onInputChange(e.target.value)}
				/>
				<Card variant="outlined" padding="sm">
					<Text size="sm">
						<strong>Current:</strong> {inputValue || '(empty)'}
					</Text>
					<Text size="sm">
						<strong>Previous:</strong> {previousValue ?? '(none)'}
					</Text>
				</Card>
			</div>
		</ShowcaseSection>
	);
}
