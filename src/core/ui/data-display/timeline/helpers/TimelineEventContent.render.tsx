import type { TimelineEvent as TimelineEventType } from '@src-types/ui/layout/timeline';

export function renderEventContent(event: TimelineEventType) {
	return (
		<>
			{event.timestamp ? (
				<span className="text-xs text-text-muted dark:text-text-muted mb-1">{event.timestamp}</span>
			) : null}
			<div className="font-medium text-text-primary dark:text-text-primary">{event.title}</div>
			{event.description ? (
				<div className="text-text-secondary dark:text-text-secondary mt-1">{event.description}</div>
			) : null}
			{event.content ? <div className="mt-2">{event.content}</div> : null}
		</>
	);
}
