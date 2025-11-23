import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';

import { renderDatePickerSection } from './date-time/date-picker';
import { renderDateRangePickerSection } from './date-time/date-range-picker';
import { renderTimePickerSection } from './date-time/time-picker';

export function renderDateAndTime(state: FormsCategoryState) {
	return (
		<div className="space-y-8">
			{renderDatePickerSection(state)}
			{renderTimePickerSection(state)}
			{renderDateRangePickerSection(state)}
		</div>
	);
}
