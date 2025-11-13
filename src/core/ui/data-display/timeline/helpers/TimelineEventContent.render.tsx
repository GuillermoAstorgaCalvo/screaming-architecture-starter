import type { TimelineEvent as TimelineEventType } from '@src-types/ui/layout/timeline';

export function renderEventContent(event: TimelineEventType) {
	return (
		<>
			{event.timestamp ? (
				<span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{event.timestamp}</span>
			) : null}
			<div className="font-medium text-gray-900 dark:text-gray-100">{event.title}</div>
			{event.description ? (
				<div className="text-gray-600 dark:text-gray-400 mt-1">{event.description}</div>
			) : null}
			{event.content ? <div className="mt-2">{event.content}</div> : null}
		</>
	);
}
