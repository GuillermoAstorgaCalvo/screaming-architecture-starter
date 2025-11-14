import { useTranslation } from '@core/i18n/useTranslation';
import { TimelineItem } from '@core/ui/data-display/timeline/components/TimelineItem';
import { getTimelineVariantClasses } from '@core/ui/variants/timeline';
import type { TimelineProps } from '@src-types/ui/layout/timeline';
import { useMemo } from 'react';

/**
 * Timeline - Chronological events component (activity feeds, history, process steps)
 *
 * Features:
 * - Vertical and horizontal layouts
 * - Event markers (default, dot, icon, custom)
 * - Connectors between events
 * - Size variants: sm, md, lg
 * - Active and completed states
 * - Clickable events
 * - Accessible: proper ARIA attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Timeline
 *   events={[
 *     {
 *       id: '1',
 *       title: 'Event 1',
 *       description: 'Description',
 *       timestamp: '2024-01-01',
 *       completed: true,
 *     },
 *     {
 *       id: '2',
 *       title: 'Event 2',
 *       description: 'Description',
 *       timestamp: '2024-01-02',
 *       active: true,
 *     },
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Timeline
 *   orientation="horizontal"
 *   markerVariant="icon"
 *   events={events}
 *   onEventClick={(eventId, index) => console.log(eventId, index)}
 * />
 * ```
 */
export default function Timeline({
	events,
	orientation = 'vertical',
	size = 'md',
	markerVariant = 'default',
	showConnectors = true,
	onEventClick,
	className,
	'aria-label': ariaLabel,
	...props
}: Readonly<TimelineProps>) {
	const { t } = useTranslation('common');
	const timelineClasses = useMemo(
		() => getTimelineVariantClasses({ orientation, className }),
		[orientation, className]
	);
	const defaultAriaLabel = ariaLabel ?? t('a11y.timeline');

	return (
		<div className={timelineClasses} aria-label={defaultAriaLabel} {...props}>
			{events.map((event, index) => {
				const previousEvent = index > 0 ? events[index - 1] : undefined;
				return (
					<TimelineItem
						key={event.id}
						event={event}
						index={index}
						isLast={index === events.length - 1}
						{...(previousEvent && { previousEvent })}
						size={size}
						markerVariant={markerVariant}
						orientation={orientation}
						showConnectors={showConnectors}
						onEventClick={onEventClick}
					/>
				);
			})}
		</div>
	);
}
