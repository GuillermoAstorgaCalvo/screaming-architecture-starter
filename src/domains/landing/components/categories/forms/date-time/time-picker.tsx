import TimePicker from '@core/ui/forms/time-picker/TimePicker';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderTimePickerSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="TimePicker"
			description="Time input component"
			tags={['form', 'input', 'time']}
		>
			<div className="space-y-4">
				<TimePicker
					label="Select Time"
					value={state.timeValue}
					onChange={e => state.setTimeValue(e.target.value)}
				/>
				<TimePicker
					label="Business Hours"
					min="09:00"
					max="17:00"
					helperText="Select a time between 9 AM and 5 PM"
				/>
			</div>
		</ShowcaseSection>
	);
}
