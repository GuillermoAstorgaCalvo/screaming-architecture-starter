import DateRangePicker from '@core/ui/forms/date-range-picker/DateRangePicker';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderDateRangePickerSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="DateRangePicker"
			description="Date range input component"
			tags={['form', 'input', 'date', 'range', 'calendar']}
		>
			<div className="space-y-4">
				<DateRangePicker
					label="Date Range"
					startValue={state.dateRangeStart}
					endValue={state.dateRangeEnd}
					onStartChange={e => state.setDateRangeStart(e.target.value)}
					onEndChange={e => state.setDateRangeEnd(e.target.value)}
				/>
				<DateRangePicker
					label="Booking Period"
					startLabel="Check-in"
					endLabel="Check-out"
					startMin="2024-01-01"
					helperText="Select your booking dates"
				/>
			</div>
		</ShowcaseSection>
	);
}
