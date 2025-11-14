import { useTranslation } from '@core/i18n/useTranslation';
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
	const { t } = useTranslation('common');
	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				onClick={onPreviousMonth}
				disabled={disabled}
				aria-label={t('calendar.previousMonth')}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={onToday}
				disabled={disabled}
				aria-label={t('calendar.goToToday')}
			>
				{t('calendar.today')}
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={onNextMonth}
				disabled={disabled}
				aria-label={t('calendar.nextMonth')}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</>
	);
}
