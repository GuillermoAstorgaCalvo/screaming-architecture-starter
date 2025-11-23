import Card from '@core/ui/data-display/card/Card';
import Input from '@core/ui/forms/input/Input';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

interface DebounceShowcaseProps {
	readonly inputValue: string;
	readonly onInputChange: (value: string) => void;
	readonly debouncedValue: string;
}

export function DebounceShowcase({
	inputValue,
	onInputChange,
	debouncedValue,
}: DebounceShowcaseProps) {
	return (
		<ShowcaseSection
			title="useDebounce"
			description="Debounce a value"
			tags={['hook', 'debounce', 'performance']}
		>
			<div className="space-y-4">
				<Input
					label="Type to see debounced value (500ms delay)"
					value={inputValue}
					onChange={e => onInputChange(e.target.value)}
				/>
				<Card variant="outlined" padding="sm">
					<Text size="sm">
						<strong>Current:</strong> {inputValue || '(empty)'}
					</Text>
					<Text size="sm">
						<strong>Debounced:</strong> {debouncedValue || '(empty)'}
					</Text>
				</Card>
			</div>
		</ShowcaseSection>
	);
}
