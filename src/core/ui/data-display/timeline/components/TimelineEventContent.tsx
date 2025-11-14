import type { EventContentProps } from '@core/ui/data-display/timeline/types/TimelineEvent.types';

export function EventContent({
	event,
	contentClasses,
	contentSpacing,
}: Readonly<EventContentProps>) {
	return (
		<div className={`${contentClasses} ${contentSpacing}`}>
			{event.timestamp ? (
				<span className="text-xs text-text-muted dark:text-text-muted mb-1">{event.timestamp}</span>
			) : null}
			<div className="font-medium text-text-primary dark:text-text-primary">{event.title}</div>
			{event.description ? (
				<div className="text-text-secondary dark:text-text-secondary mt-1">{event.description}</div>
			) : null}
			{event.content ? <div className="mt-2">{event.content}</div> : null}
		</div>
	);
}
