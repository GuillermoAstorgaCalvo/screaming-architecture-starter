import Button from '@core/ui/button/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarNavigationProps {
	disabled: boolean;
	onPreviousMonth: () => void;
	onNextMonth: () => void;
	onToday: () => void;
}

export function CalendarNavigation({
	disabled,
	onPreviousMonth,
	onNextMonth,
	onToday,
}: Readonly<CalendarNavigationProps>) {
	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				onClick={onPreviousMonth}
				disabled={disabled}
				aria-label="Previous month"
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={onToday}
				disabled={disabled}
				aria-label="Go to today"
			>
				Today
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={onNextMonth}
				disabled={disabled}
				aria-label="Next month"
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</>
	);
}
