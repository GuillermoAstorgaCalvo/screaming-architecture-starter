import DatePicker from '@core/ui/forms/date-picker/DatePicker';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderDatePickerSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="DatePicker"
			description="Date input component"
			tags={['form', 'input', 'date', 'calendar']}
		>
			<div className="space-y-4">
				<DatePicker
					label="Select Date"
					value={state.dateValue}
					onChange={e => state.setDateValue(e.target.value)}
				/>
				<DatePicker
					label="Date with Min/Max"
					min="2024-01-01"
					max="2024-12-31"
					helperText="Select a date in 2024"
				/>
			</div>
		</ShowcaseSection>
	);
}
