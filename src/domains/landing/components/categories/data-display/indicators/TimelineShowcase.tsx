import Timeline from '@core/ui/data-display/timeline/Timeline';
import { TIMELINE_EVENTS } from '@domains/landing/components/categories/data-display/constants/constants';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function TimelineShowcase() {
	return (
		<ShowcaseSection
			title="Timeline"
			description="Timeline component"
			tags={['data', 'timeline', 'event', 'chronological']}
		>
			<Timeline events={TIMELINE_EVENTS} />
		</ShowcaseSection>
	);
}
