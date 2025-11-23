/**
 * Timeline Component Tests
 *
 * Tests for Timeline component:
 * - Rendering with events
 * - Orientations (vertical, horizontal)
 * - Sizes (sm, md, lg)
 * - Marker variants (default, dot, icon, custom)
 * - showConnectors prop
 * - onEventClick handler
 * - Custom className
 * - aria-label (default and custom)
 * - Previous event passing
 * - isLast prop
 * - useMemo dependencies
 */

import Timeline from '@core/ui/data-display/timeline/Timeline';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock useTranslation
vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			if (key === 'a11y.timeline') {
				return 'Timeline';
			}
			return key;
		},
	}),
}));

// Mock TimelineItem to avoid deep component testing
vi.mock('@core/ui/data-display/timeline/components/TimelineItem', () => ({
	TimelineItem: ({
		event,
		index,
		isLast,
		previousEvent,
		size,
		markerVariant,
		orientation,
		showConnectors,
		onEventClick,
	}: {
		event: { id: string; title: string };
		index: number;
		isLast: boolean;
		previousEvent?: unknown;
		size: string;
		markerVariant: string;
		orientation: string;
		showConnectors: boolean;
		onEventClick?: (eventId: string, eventIndex: number) => void;
	}) => (
		<div
			data-testid={`timeline-item-${event.id}`}
			data-index={index}
			data-is-last={isLast}
			data-size={size}
			data-marker-variant={markerVariant}
			data-orientation={orientation}
			data-show-connectors={showConnectors}
			data-has-previous={Boolean(previousEvent)}
			onClick={() => onEventClick?.(event.id, index)}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
					onEventClick?.(event.id, index);
				}
			}}
			role={onEventClick ? 'button' : undefined}
			tabIndex={onEventClick ? 0 : undefined}
		>
			{event.title}
		</div>
	),
}));

const mockEvents = [
	{
		id: '1',
		title: 'Event 1',
		description: 'Description 1',
		timestamp: '2024-01-01',
		completed: true,
	},
	{
		id: '2',
		title: 'Event 2',
		description: 'Description 2',
		timestamp: '2024-01-02',
		active: true,
	},
	{
		id: '3',
		title: 'Event 3',
		description: 'Description 3',
		timestamp: '2024-01-03',
	},
] as const;

beforeEach(() => {
	vi.clearAllMocks();
});

describe('Timeline - Rendering', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<Timeline events={mockEvents} />);
		}).not.toThrow();
	});

	it('should render timeline container', () => {
		renderWithProviders(<Timeline events={mockEvents} data-testid="timeline" />);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toBeInTheDocument();
		expect(timeline.tagName).toBe('DIV');
	});

	it('should render all events', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		expect(screen.getByTestId('timeline-item-1')).toBeInTheDocument();
		expect(screen.getByTestId('timeline-item-2')).toBeInTheDocument();
		expect(screen.getByTestId('timeline-item-3')).toBeInTheDocument();
	});

	it('should render event titles', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		expect(screen.getByText('Event 1')).toBeInTheDocument();
		expect(screen.getByText('Event 2')).toBeInTheDocument();
		expect(screen.getByText('Event 3')).toBeInTheDocument();
	});

	it('should render with empty events array', () => {
		renderWithProviders(<Timeline events={[]} data-testid="timeline" />);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toBeInTheDocument();
	});
});

describe('Timeline - Orientations', () => {
	it('should render with default vertical orientation', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-orientation', 'vertical');
	});

	it('should render with vertical orientation', () => {
		renderWithProviders(<Timeline events={mockEvents} orientation="vertical" />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-orientation', 'vertical');
	});

	it('should render with horizontal orientation', () => {
		renderWithProviders(<Timeline events={mockEvents} orientation="horizontal" />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-orientation', 'horizontal');
	});

	it('should pass orientation to all items', () => {
		renderWithProviders(<Timeline events={mockEvents} orientation="horizontal" />);
		const items = screen.getAllByTestId(/timeline-item-/);
		for (const item of items) {
			expect(item).toHaveAttribute('data-orientation', 'horizontal');
		}
	});
});

describe('Timeline - Sizes', () => {
	it('should render with default md size', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-size', 'md');
	});

	it('should render with sm size', () => {
		renderWithProviders(<Timeline events={mockEvents} size="sm" />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-size', 'sm');
	});

	it('should render with md size', () => {
		renderWithProviders(<Timeline events={mockEvents} size="md" />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-size', 'md');
	});

	it('should render with lg size', () => {
		renderWithProviders(<Timeline events={mockEvents} size="lg" />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-size', 'lg');
	});

	it('should pass size to all items', () => {
		renderWithProviders(<Timeline events={mockEvents} size="sm" />);
		const items = screen.getAllByTestId(/timeline-item-/);
		for (const item of items) {
			expect(item).toHaveAttribute('data-size', 'sm');
		}
	});
});

describe('Timeline - Marker Variants', () => {
	it('should render with default marker variant', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-marker-variant', 'default');
	});

	it('should render with default marker variant', () => {
		renderWithProviders(<Timeline events={mockEvents} markerVariant="default" />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-marker-variant', 'default');
	});

	it('should render with dot marker variant', () => {
		renderWithProviders(<Timeline events={mockEvents} markerVariant="dot" />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-marker-variant', 'dot');
	});

	it('should render with icon marker variant', () => {
		renderWithProviders(<Timeline events={mockEvents} markerVariant="icon" />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-marker-variant', 'icon');
	});

	it('should render with custom marker variant', () => {
		renderWithProviders(<Timeline events={mockEvents} markerVariant="custom" />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-marker-variant', 'custom');
	});

	it('should pass marker variant to all items', () => {
		renderWithProviders(<Timeline events={mockEvents} markerVariant="icon" />);
		const items = screen.getAllByTestId(/timeline-item-/);
		for (const item of items) {
			expect(item).toHaveAttribute('data-marker-variant', 'icon');
		}
	});
});

describe('Timeline - Connectors', () => {
	it('should show connectors by default', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-show-connectors', 'true');
	});

	it('should show connectors when showConnectors is true', () => {
		renderWithProviders(<Timeline events={mockEvents} showConnectors={true} />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-show-connectors', 'true');
	});

	it('should hide connectors when showConnectors is false', () => {
		renderWithProviders(<Timeline events={mockEvents} showConnectors={false} />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-show-connectors', 'false');
	});

	it('should pass showConnectors to all items', () => {
		renderWithProviders(<Timeline events={mockEvents} showConnectors={false} />);
		const items = screen.getAllByTestId(/timeline-item-/);
		for (const item of items) {
			expect(item).toHaveAttribute('data-show-connectors', 'false');
		}
	});
});

describe('Timeline - Event Click Handler', () => {
	it('should call onEventClick when event is clicked', () => {
		const handleEventClick = vi.fn();
		renderWithProviders(<Timeline events={mockEvents} onEventClick={handleEventClick} />);
		const item = screen.getByTestId('timeline-item-1');
		fireEvent.click(item);
		expect(handleEventClick).toHaveBeenCalledTimes(1);
		expect(handleEventClick).toHaveBeenCalledWith('1', 0);
	});

	it('should call onEventClick with correct event id and index', () => {
		const handleEventClick = vi.fn();
		renderWithProviders(<Timeline events={mockEvents} onEventClick={handleEventClick} />);
		const item2 = screen.getByTestId('timeline-item-2');
		fireEvent.click(item2);
		expect(handleEventClick).toHaveBeenCalledWith('2', 1);
	});

	it('should not call onEventClick when handler is not provided', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const item = screen.getByTestId('timeline-item-1');
		expect(() => fireEvent.click(item)).not.toThrow();
	});

	it('should call onEventClick for multiple events', () => {
		const handleEventClick = vi.fn();
		renderWithProviders(<Timeline events={mockEvents} onEventClick={handleEventClick} />);
		const item1 = screen.getByTestId('timeline-item-1');
		const item2 = screen.getByTestId('timeline-item-2');
		fireEvent.click(item1);
		fireEvent.click(item2);
		expect(handleEventClick).toHaveBeenCalledTimes(2);
		expect(handleEventClick).toHaveBeenNthCalledWith(1, '1', 0);
		expect(handleEventClick).toHaveBeenNthCalledWith(2, '2', 1);
	});
});

describe('Timeline - Previous Event', () => {
	it('should not pass previousEvent to first item', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const firstItem = screen.getByTestId('timeline-item-1');
		expect(firstItem).toHaveAttribute('data-has-previous', 'false');
	});

	it('should pass previousEvent to second item', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const secondItem = screen.getByTestId('timeline-item-2');
		expect(secondItem).toHaveAttribute('data-has-previous', 'true');
	});

	it('should pass previousEvent to third item', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const thirdItem = screen.getByTestId('timeline-item-3');
		expect(thirdItem).toHaveAttribute('data-has-previous', 'true');
	});

	it('should pass correct previous event data', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const secondItem = screen.getByTestId('timeline-item-2');
		expect(secondItem).toHaveAttribute('data-has-previous', 'true');
	});
});

describe('Timeline - isLast Prop', () => {
	it('should mark first item as not last', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const firstItem = screen.getByTestId('timeline-item-1');
		expect(firstItem).toHaveAttribute('data-is-last', 'false');
	});

	it('should mark middle item as not last', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const secondItem = screen.getByTestId('timeline-item-2');
		expect(secondItem).toHaveAttribute('data-is-last', 'false');
	});

	it('should mark last item as last', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		const lastItem = screen.getByTestId('timeline-item-3');
		expect(lastItem).toHaveAttribute('data-is-last', 'true');
	});

	it('should mark single item as last', () => {
		renderWithProviders(<Timeline events={[mockEvents[0]]} />);
		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-is-last', 'true');
	});
});

describe('Timeline - Index Prop', () => {
	it('should pass correct index to items', () => {
		renderWithProviders(<Timeline events={mockEvents} />);
		expect(screen.getByTestId('timeline-item-1')).toHaveAttribute('data-index', '0');
		expect(screen.getByTestId('timeline-item-2')).toHaveAttribute('data-index', '1');
		expect(screen.getByTestId('timeline-item-3')).toHaveAttribute('data-index', '2');
	});
});

describe('Timeline - Custom className', () => {
	it('should apply custom className', () => {
		renderWithProviders(
			<Timeline events={mockEvents} className="custom-timeline" data-testid="timeline" />
		);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toHaveClass('custom-timeline');
	});

	it('should merge custom className with variant classes', () => {
		renderWithProviders(
			<Timeline
				events={mockEvents}
				className="custom-timeline"
				orientation="horizontal"
				data-testid="timeline"
			/>
		);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toHaveClass('custom-timeline');
	});
});

describe('Timeline - aria-label', () => {
	it('should use default aria-label from translation', () => {
		renderWithProviders(<Timeline events={mockEvents} data-testid="timeline" />);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toHaveAttribute('aria-label', 'Timeline');
	});

	it('should use custom aria-label when provided', () => {
		renderWithProviders(
			<Timeline events={mockEvents} aria-label="Custom Timeline" data-testid="timeline" />
		);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toHaveAttribute('aria-label', 'Custom Timeline');
	});
});

describe('Timeline - HTML Attributes', () => {
	it('should preserve HTML attributes', () => {
		renderWithProviders(
			<Timeline events={mockEvents} data-testid="timeline" id="timeline-id" role="group" />
		);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toHaveAttribute('id', 'timeline-id');
		expect(timeline).toHaveAttribute('role', 'group');
	});

	it('should support data attributes', () => {
		renderWithProviders(
			<Timeline events={mockEvents} data-testid="timeline" data-custom="value" />
		);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toHaveAttribute('data-custom', 'value');
	});
});

describe('Timeline - useMemo Dependencies', () => {
	it('should update classes when orientation changes', () => {
		const { rerender } = renderWithProviders(
			<Timeline events={mockEvents} orientation="vertical" data-testid="timeline" />
		);
		const timeline = screen.getByTestId('timeline');
		const initialClasses = timeline.className;

		rerender(<Timeline events={mockEvents} orientation="horizontal" data-testid="timeline" />);
		const updatedTimeline = screen.getByTestId('timeline');
		expect(updatedTimeline.className).not.toBe(initialClasses);
	});

	it('should update classes when className changes', () => {
		const { rerender } = renderWithProviders(
			<Timeline events={mockEvents} className="class1" data-testid="timeline" />
		);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toHaveClass('class1');

		rerender(<Timeline events={mockEvents} className="class2" data-testid="timeline" />);
		const updatedTimeline = screen.getByTestId('timeline');
		expect(updatedTimeline).toHaveClass('class2');
		expect(updatedTimeline).not.toHaveClass('class1');
	});
});

describe('Timeline - Complex Scenarios', () => {
	it('should handle all props together', () => {
		const handleEventClick = vi.fn();
		renderWithProviders(
			<Timeline
				events={mockEvents}
				orientation="horizontal"
				size="lg"
				markerVariant="icon"
				showConnectors={false}
				onEventClick={handleEventClick}
				className="custom-timeline"
				aria-label="Custom Timeline"
				data-testid="timeline"
			/>
		);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toBeInTheDocument();
		expect(timeline).toHaveClass('custom-timeline');
		expect(timeline).toHaveAttribute('aria-label', 'Custom Timeline');

		const item = screen.getByTestId('timeline-item-1');
		expect(item).toHaveAttribute('data-orientation', 'horizontal');
		expect(item).toHaveAttribute('data-size', 'lg');
		expect(item).toHaveAttribute('data-marker-variant', 'icon');
		expect(item).toHaveAttribute('data-show-connectors', 'false');

		fireEvent.click(item);
		expect(handleEventClick).toHaveBeenCalledWith('1', 0);
	});

	it('should handle single event', () => {
		renderWithProviders(<Timeline events={[mockEvents[0]]} />);
		expect(screen.getByTestId('timeline-item-1')).toBeInTheDocument();
		expect(screen.queryByTestId('timeline-item-2')).not.toBeInTheDocument();
	});

	it('should handle many events', () => {
		const manyEvents = Array.from({ length: 10 }, (_, i) => ({
			id: `event-${i}`,
			title: `Event ${i}`,
		}));
		renderWithProviders(<Timeline events={manyEvents} />);
		expect(screen.getByTestId('timeline-item-event-0')).toBeInTheDocument();
		expect(screen.getByTestId('timeline-item-event-9')).toBeInTheDocument();
		expect(screen.getByTestId('timeline-item-event-9')).toHaveAttribute('data-is-last', 'true');
	});
});

describe('Timeline - Accessibility', () => {
	it('should have no accessibility violations', async () => {
		const { container } = renderWithProviders(<Timeline events={mockEvents} />);
		await expectA11y(container);
	});

	it('should support semantic HTML', () => {
		renderWithProviders(<Timeline events={mockEvents} data-testid="timeline" />);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toBeInTheDocument();
	});

	it('should support custom ARIA attributes', () => {
		renderWithProviders(
			<Timeline
				events={mockEvents}
				aria-label="Timeline"
				aria-describedby="timeline-description"
				data-testid="timeline"
			/>
		);
		const timeline = screen.getByTestId('timeline');
		expect(timeline).toHaveAttribute('aria-label', 'Timeline');
		expect(timeline).toHaveAttribute('aria-describedby', 'timeline-description');
	});
});
