/**
 * Tests for TimelineItem component
 *
 * Tests the timeline item component:
 * - Rendering with different orientations
 * - Rendering with/without connectors
 * - Rendering when isLast is true/false
 * - Click handler functionality
 * - Props passing to child components
 * - Different sizes and marker variants
 * - Previous event handling
 * - CSS classes for different orientations
 */

import { TimelineItem } from '@core/ui/data-display/timeline/components/TimelineItem';
import type { TimelineItemProps } from '@core/ui/data-display/timeline/types/TimelineItem.types';
import type { TimelineEvent } from '@src-types/ui/layout/timeline';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Mock child components
vi.mock('@core/ui/data-display/timeline/components/TimelineEvent', () => ({
	TimelineEvent: vi.fn(({ event, size, markerVariant, orientation, onClick }) => (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			data-testid="timeline-event"
			data-event-id={event.id}
			data-size={size}
			data-marker-variant={markerVariant}
			data-orientation={orientation}
			data-has-onclick={Boolean(onClick)}
			onClick={onClick}
			onKeyDown={
				onClick
					? (e: { key: string; preventDefault: () => void }) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onClick();
							}
						}
					: undefined
			}
		>
			Event: {event.title}
		</div>
	)),
}));

vi.mock('@core/ui/data-display/timeline/components/TimelineConnector', () => ({
	TimelineConnector: vi.fn(({ orientation, size, currentEvent, previousEvent }) => (
		<div
			data-testid="timeline-connector"
			data-orientation={orientation}
			data-size={size}
			data-current-event-id={currentEvent.id}
			data-previous-event-id={previousEvent?.id || 'none'}
		>
			Connector
		</div>
	)),
}));

const createMockEvent = (overrides?: Partial<TimelineEvent>): TimelineEvent => ({
	id: 'event-1',
	title: 'Test Event',
	description: 'Test Description',
	...overrides,
});

const createDefaultProps = (overrides = {}): TimelineItemProps => ({
	event: createMockEvent(),
	index: 0,
	isLast: false,
	size: 'md',
	markerVariant: 'default',
	orientation: 'vertical',
	showConnectors: true,
	...overrides,
});

describe('TimelineItem - Rendering', () => {
	it('renders without crashing', () => {
		expect(() => {
			renderWithProviders(<TimelineItem {...createDefaultProps()} />);
		}).not.toThrow();
	});

	it('renders timeline event component', () => {
		renderWithProviders(<TimelineItem {...createDefaultProps()} />);
		const event = screen.getByTestId('timeline-event');
		expect(event).toBeInTheDocument();
		expect(event).toHaveTextContent('Event: Test Event');
	});

	it('renders connector when showConnectors is true and isLast is false', () => {
		renderWithProviders(
			<TimelineItem {...createDefaultProps({ showConnectors: true, isLast: false })} />
		);
		const connector = screen.getByTestId('timeline-connector');
		expect(connector).toBeInTheDocument();
	});

	it('does not render connector when showConnectors is false', () => {
		renderWithProviders(
			<TimelineItem {...createDefaultProps({ showConnectors: false, isLast: false })} />
		);
		expect(screen.queryByTestId('timeline-connector')).not.toBeInTheDocument();
	});

	it('does not render connector when isLast is true', () => {
		renderWithProviders(
			<TimelineItem {...createDefaultProps({ showConnectors: true, isLast: true })} />
		);
		expect(screen.queryByTestId('timeline-connector')).not.toBeInTheDocument();
	});

	it('does not render connector when both showConnectors is false and isLast is true', () => {
		renderWithProviders(
			<TimelineItem {...createDefaultProps({ showConnectors: false, isLast: true })} />
		);
		expect(screen.queryByTestId('timeline-connector')).not.toBeInTheDocument();
	});
});

describe('TimelineItem - Orientation', () => {
	it('renders with vertical orientation classes', () => {
		const { container } = renderWithProviders(
			<TimelineItem {...createDefaultProps({ orientation: 'vertical' })} />
		);
		const item = container.firstChild as HTMLElement;
		expect(item).toHaveClass('flex', 'items-start');
	});

	it('renders with horizontal orientation classes', () => {
		const { container } = renderWithProviders(
			<TimelineItem {...createDefaultProps({ orientation: 'horizontal' })} />
		);
		const item = container.firstChild as HTMLElement;
		expect(item).toHaveClass('flex', 'flex-col', 'items-center');
	});

	it('passes orientation prop to timeline event', () => {
		renderWithProviders(<TimelineItem {...createDefaultProps({ orientation: 'vertical' })} />);
		const event = screen.getByTestId('timeline-event');
		expect(event).toHaveAttribute('data-orientation', 'vertical');
	});

	it('passes orientation prop to timeline connector', () => {
		renderWithProviders(
			<TimelineItem {...createDefaultProps({ orientation: 'horizontal', isLast: false })} />
		);
		const connector = screen.getByTestId('timeline-connector');
		expect(connector).toHaveAttribute('data-orientation', 'horizontal');
	});

	it('handles both orientations correctly', () => {
		const orientations: Array<'vertical' | 'horizontal'> = ['vertical', 'horizontal'];

		for (const orientation of orientations) {
			const { unmount } = renderWithProviders(
				<TimelineItem {...createDefaultProps({ orientation, isLast: false })} />
			);
			const event = screen.getByTestId('timeline-event');
			expect(event).toHaveAttribute('data-orientation', orientation);
			unmount();
		}
	});
});

describe('TimelineItem - Props Passing', () => {
	it('passes event prop to timeline event', () => {
		const event = createMockEvent({ id: 'custom-event', title: 'Custom Title' });
		renderWithProviders(<TimelineItem {...createDefaultProps({ event })} />);
		const timelineEvent = screen.getByTestId('timeline-event');
		expect(timelineEvent).toHaveAttribute('data-event-id', 'custom-event');
		expect(timelineEvent).toHaveTextContent('Event: Custom Title');
	});

	it('passes size prop to timeline event', () => {
		renderWithProviders(<TimelineItem {...createDefaultProps({ size: 'lg' })} />);
		const event = screen.getByTestId('timeline-event');
		expect(event).toHaveAttribute('data-size', 'lg');
	});

	it('passes size prop to timeline connector', () => {
		renderWithProviders(<TimelineItem {...createDefaultProps({ size: 'sm', isLast: false })} />);
		const connector = screen.getByTestId('timeline-connector');
		expect(connector).toHaveAttribute('data-size', 'sm');
	});

	it('passes markerVariant prop to timeline event', () => {
		renderWithProviders(<TimelineItem {...createDefaultProps({ markerVariant: 'icon' })} />);
		const event = screen.getByTestId('timeline-event');
		expect(event).toHaveAttribute('data-marker-variant', 'icon');
	});

	it('passes previousEvent prop to timeline connector when provided', () => {
		const previousEvent = createMockEvent({ id: 'prev-event' });
		const currentEvent = createMockEvent({ id: 'current-event' });
		renderWithProviders(
			<TimelineItem
				{...createDefaultProps({
					event: currentEvent,
					previousEvent,
					isLast: false,
				})}
			/>
		);
		const connector = screen.getByTestId('timeline-connector');
		expect(connector).toHaveAttribute('data-previous-event-id', 'prev-event');
		expect(connector).toHaveAttribute('data-current-event-id', 'current-event');
	});

	it('passes currentEvent prop to timeline connector', () => {
		const currentEvent = createMockEvent({ id: 'current-event' });
		renderWithProviders(
			<TimelineItem
				{...createDefaultProps({
					event: currentEvent,
					isLast: false,
				})}
			/>
		);
		const connector = screen.getByTestId('timeline-connector');
		expect(connector).toHaveAttribute('data-current-event-id', 'current-event');
		expect(connector).toHaveAttribute('data-previous-event-id', 'none');
	});
});

describe('TimelineItem - Click Handler', () => {
	it('passes onClick handler to timeline event when onEventClick is provided', () => {
		const onEventClick = vi.fn();
		renderWithProviders(<TimelineItem {...createDefaultProps({ onEventClick })} />);
		const event = screen.getByTestId('timeline-event');
		expect(event).toHaveAttribute('data-has-onclick', 'true');
	});

	it('does not pass onClick handler to timeline event when onEventClick is not provided', () => {
		renderWithProviders(<TimelineItem {...createDefaultProps()} />);
		const event = screen.getByTestId('timeline-event');
		expect(event).toHaveAttribute('data-has-onclick', 'false');
	});

	it('calls onEventClick with correct event id and index when event is clicked', () => {
		const onEventClick = vi.fn();
		const event = createMockEvent({ id: 'clickable-event' });
		renderWithProviders(
			<TimelineItem {...createDefaultProps({ event, index: 2, onEventClick })} />
		);
		const timelineEvent = screen.getByTestId('timeline-event');
		fireEvent.click(timelineEvent);
		expect(onEventClick).toHaveBeenCalledTimes(1);
		expect(onEventClick).toHaveBeenCalledWith('clickable-event', 2);
	});

	it('calls onEventClick with correct index for different items', () => {
		const onEventClick = vi.fn();
		const event1 = createMockEvent({ id: 'event-1' });
		const event2 = createMockEvent({ id: 'event-2' });

		const { unmount } = renderWithProviders(
			<TimelineItem {...createDefaultProps({ event: event1, index: 0, onEventClick })} />
		);
		const timelineEvent1 = screen.getByTestId('timeline-event');
		fireEvent.click(timelineEvent1);
		expect(onEventClick).toHaveBeenCalledWith('event-1', 0);
		unmount();

		renderWithProviders(
			<TimelineItem {...createDefaultProps({ event: event2, index: 5, onEventClick })} />
		);
		const timelineEvent2 = screen.getByTestId('timeline-event');
		fireEvent.click(timelineEvent2);
		expect(onEventClick).toHaveBeenCalledWith('event-2', 5);
	});
});

describe('TimelineItem - Size Variants', () => {
	it('handles all size variants', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const { unmount } = renderWithProviders(
				<TimelineItem {...createDefaultProps({ size, isLast: false })} />
			);
			const event = screen.getByTestId('timeline-event');
			const connector = screen.getByTestId('timeline-connector');
			expect(event).toHaveAttribute('data-size', size);
			expect(connector).toHaveAttribute('data-size', size);
			unmount();
		}
	});
});

describe('TimelineItem - Marker Variants', () => {
	it('handles all marker variants', () => {
		const variants: Array<'default' | 'dot' | 'icon' | 'custom'> = [
			'default',
			'dot',
			'icon',
			'custom',
		];

		for (const variant of variants) {
			const { unmount } = renderWithProviders(
				<TimelineItem {...createDefaultProps({ markerVariant: variant })} />
			);
			const event = screen.getByTestId('timeline-event');
			expect(event).toHaveAttribute('data-marker-variant', variant);
			unmount();
		}
	});
});

describe('TimelineItem - isLast Behavior', () => {
	it('renders connector when isLast is false and showConnectors is true', () => {
		renderWithProviders(
			<TimelineItem {...createDefaultProps({ isLast: false, showConnectors: true })} />
		);
		expect(screen.getByTestId('timeline-connector')).toBeInTheDocument();
	});

	it('does not render connector when isLast is true even if showConnectors is true', () => {
		renderWithProviders(
			<TimelineItem {...createDefaultProps({ isLast: true, showConnectors: true })} />
		);
		expect(screen.queryByTestId('timeline-connector')).not.toBeInTheDocument();
	});

	it('renders event even when isLast is true', () => {
		renderWithProviders(<TimelineItem {...createDefaultProps({ isLast: true })} />);
		expect(screen.getByTestId('timeline-event')).toBeInTheDocument();
	});
});

describe('TimelineItem - CSS Classes', () => {
	it('applies correct container classes for vertical orientation', () => {
		const { container } = renderWithProviders(
			<TimelineItem {...createDefaultProps({ orientation: 'vertical' })} />
		);
		const item = container.firstChild as HTMLElement;
		expect(item).toHaveClass('flex', 'items-start');
	});

	it('applies correct container classes for horizontal orientation', () => {
		const { container } = renderWithProviders(
			<TimelineItem {...createDefaultProps({ orientation: 'horizontal' })} />
		);
		const item = container.firstChild as HTMLElement;
		expect(item).toHaveClass('flex', 'flex-col', 'items-center');
	});

	it('applies correct inner classes for vertical orientation', () => {
		const { container } = renderWithProviders(
			<TimelineItem {...createDefaultProps({ orientation: 'vertical' })} />
		);
		const item = container.firstChild as HTMLElement;
		const inner = item.firstChild as HTMLElement;
		expect(inner).toHaveClass('flex', 'flex-col', 'items-center', 'shrink-0');
	});

	it('applies correct inner classes for horizontal orientation', () => {
		const { container } = renderWithProviders(
			<TimelineItem {...createDefaultProps({ orientation: 'horizontal' })} />
		);
		const item = container.firstChild as HTMLElement;
		const inner = item.firstChild as HTMLElement;
		expect(inner).toHaveClass('flex', 'flex-col', 'items-center');
		expect(inner).not.toHaveClass('shrink-0');
	});
});

describe('TimelineItem - Complex Scenarios', () => {
	it('handles all props together correctly', () => {
		const onEventClick = vi.fn();
		const previousEvent = createMockEvent({ id: 'prev-event' });
		const currentEvent = createMockEvent({ id: 'current-event', title: 'Current Event' });

		renderWithProviders(
			<TimelineItem
				{...createDefaultProps({
					event: currentEvent,
					index: 3,
					isLast: false,
					previousEvent,
					size: 'lg',
					markerVariant: 'icon',
					orientation: 'horizontal',
					showConnectors: true,
					onEventClick,
				})}
			/>
		);

		const event = screen.getByTestId('timeline-event');
		expect(event).toHaveAttribute('data-event-id', 'current-event');
		expect(event).toHaveAttribute('data-size', 'lg');
		expect(event).toHaveAttribute('data-marker-variant', 'icon');
		expect(event).toHaveAttribute('data-orientation', 'horizontal');
		expect(event).toHaveAttribute('data-has-onclick', 'true');

		const connector = screen.getByTestId('timeline-connector');
		expect(connector).toHaveAttribute('data-orientation', 'horizontal');
		expect(connector).toHaveAttribute('data-size', 'lg');
		expect(connector).toHaveAttribute('data-current-event-id', 'current-event');
		expect(connector).toHaveAttribute('data-previous-event-id', 'prev-event');

		fireEvent.click(event);
		expect(onEventClick).toHaveBeenCalledWith('current-event', 3);
	});

	it('handles first item (no previousEvent) correctly', () => {
		const currentEvent = createMockEvent({ id: 'first-event' });
		renderWithProviders(
			<TimelineItem
				{...createDefaultProps({
					event: currentEvent,
					isLast: false,
					previousEvent: undefined,
				})}
			/>
		);

		const connector = screen.getByTestId('timeline-connector');
		expect(connector).toHaveAttribute('data-current-event-id', 'first-event');
		expect(connector).toHaveAttribute('data-previous-event-id', 'none');
	});

	it('handles last item correctly', () => {
		const currentEvent = createMockEvent({ id: 'last-event' });
		const previousEvent = createMockEvent({ id: 'prev-event' });
		renderWithProviders(
			<TimelineItem
				{...createDefaultProps({
					event: currentEvent,
					isLast: true,
					previousEvent,
					showConnectors: true,
				})}
			/>
		);

		expect(screen.getByTestId('timeline-event')).toBeInTheDocument();
		expect(screen.queryByTestId('timeline-connector')).not.toBeInTheDocument();
	});
});
