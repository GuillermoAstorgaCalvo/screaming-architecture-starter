import { CalendarNavigation } from '@core/ui/calendar/components/CalendarNavigation';
import { formatMonthYear } from '@core/ui/calendar/helpers/CalendarHelpers';
import type { ReactNode } from 'react';

interface CalendarHeaderProps {
	displayMonth: Date;
	locale: string;
	showNavigation: boolean;
	disabled: boolean;
	headerContent?: ReactNode;
	onPreviousMonth: () => void;
	onNextMonth: () => void;
	onToday: () => void;
}

export function CalendarHeader({
	displayMonth,
	locale,
	showNavigation,
	disabled,
	headerContent,
	onPreviousMonth,
	onNextMonth,
	onToday,
}: Readonly<CalendarHeaderProps>) {
	return (
		<div className="flex items-center justify-between mb-4">
			{headerContent ?? (
				<>
					<div className="flex items-center gap-2">
						{showNavigation ? (
							<CalendarNavigation
								disabled={disabled}
								onPreviousMonth={onPreviousMonth}
								onNextMonth={onNextMonth}
								onToday={onToday}
							/>
						) : null}
					</div>
					<h2 className="text-lg font-semibold">{formatMonthYear(displayMonth, locale)}</h2>
					<div className="w-24" /> {/* Spacer for centering */}
				</>
			)}
		</div>
	);
}
