import Radio from '@core/ui/forms/radio/Radio';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderRadioSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Radio"
			description="Radio button component"
			tags={['form', 'input', 'radio', 'selection']}
		>
			<div className="space-y-4">
				<Radio
					name="radio-group"
					value="option1"
					checked={state.radioValue === 'option1'}
					onChange={() => state.setRadioValue('option1')}
					label="Option 1"
				/>
				<Radio
					name="radio-group"
					value="option2"
					checked={state.radioValue === 'option2'}
					onChange={() => state.setRadioValue('option2')}
					label="Option 2"
				/>
				<Radio
					name="radio-group"
					value="option3"
					checked={state.radioValue === 'option3'}
					onChange={() => state.setRadioValue('option3')}
					label="Option 3"
				/>
				<Radio name="radio-group-disabled" value="disabled" disabled label="Disabled option" />
			</div>
		</ShowcaseSection>
	);
}
