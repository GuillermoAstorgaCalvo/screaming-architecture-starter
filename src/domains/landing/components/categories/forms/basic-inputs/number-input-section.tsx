import NumberInput from '@core/ui/forms/number-input/NumberInput';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderNumberInputSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="NumberInput"
			description="Number input component"
			tags={['form', 'input', 'number', 'numeric']}
		>
			<div className="space-y-4">
				<NumberInput
					label="Number"
					value={state.numberValue}
					onChange={value => state.setNumberValue(value)}
				/>
				<NumberInput
					label="Number with Min/Max"
					min={0}
					max={100}
					helperText="Enter a number between 0 and 100"
				/>
			</div>
		</ShowcaseSection>
	);
}
