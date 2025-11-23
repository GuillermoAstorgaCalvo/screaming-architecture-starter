import { useState } from 'react';

/**
 * State hook for date and time form controls
 */
export function useDateTimeState() {
	const [dateValue, setDateValue] = useState('');
	const [dateRangeStart, setDateRangeStart] = useState('');
	const [dateRangeEnd, setDateRangeEnd] = useState('');
	const [timeValue, setTimeValue] = useState('');

	return {
		dateValue,
		setDateValue,
		dateRangeStart,
		setDateRangeStart,
		dateRangeEnd,
		setDateRangeEnd,
		timeValue,
		setTimeValue,
	};
}
