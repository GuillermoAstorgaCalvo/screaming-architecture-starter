import Calendar from '@core/ui/calendar/Calendar';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function CalendarShowcase() {
	return (
		<ShowcaseSection
			title="Calendar"
			description="Calendar component"
			tags={['calendar', 'date', 'picker']}
		>
			<Calendar
				month={new Date()}
				selectable
				onDateSelect={() => {
					// Date selection handler
				}}
			/>
		</ShowcaseSection>
	);
}
