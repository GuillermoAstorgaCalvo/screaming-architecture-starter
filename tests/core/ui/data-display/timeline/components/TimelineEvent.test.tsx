/**
 * Tests for TimelineEvent component
 *
 * Tests the timeline event component:
 * - Rendering with different orientations
 * - Props passing to child components
 * - Different sizes and marker variants
 * - Click handler functionality
 */

import { TimelineEvent } from '@core/ui/data-display/timeline/components/TimelineEvent';
import type { TimelineEventProps } from '@core/ui/data-display/timeline/types/TimelineEvent.types';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Mock child components
vi.mock('@core/ui/data-display/timeline/components/VerticalTimelineEvent', () => ({
	VerticalTimelineEvent: vi.fn(
		({ event, size, markerVariant, orientation, contentClasses, contentSpacing, onClick }) => (
			<div
				data-testid="vertical-timeline-event"
				data-event-id={event.id}
				data-size={size}
				data-marker-variant={markerVariant}
				data-orientation={orientation}
				data-content-classes={contentClasses}
				data-content-spacing={contentSpacing}
				data-has-onclick={Boolean(onClick)}
			>
				Vertical Event: {event.title}
			</div>
		)
	),
}));

vi.mock('@core/ui/data-display/timeline/components/HorizontalTimelineEvent', () => ({
	HorizontalTimelineEvent: vi.fn(
		({
			event,
			size,
			markerVariant,
			orientation,
			containerClasses,
			contentClasses,
			contentSpacing,
			onClick,
		}) => (
			<div
				data-testid="horizontal-timeline-event"
				data-event-id={event.id}
				data-size={size}
				data-marker-variant={markerVariant}
				data-orientation={orientation}
				data-container-classes={containerClasses}
				data-content-classes={contentClasses}
				data-content-spacing={contentSpacing}
				data-has-onclick={Boolean(onClick)}
			>
				Horizontal Event: {event.title}
			</div>
		)
	),
}));

// Mock helper functions
vi.mock('@core/ui/data-display/timeline/helpers/TimelineEvent.utils', () => ({
	getEventContainerClasses: vi.fn(orientation => `container-${orientation}`),
	getEventContentClasses: vi.fn((orientation, size) => `content-${orientation}-${size}`),
	getContentSpacing: vi.fn(orientation => `spacing-${orientation}`),
}));

const createMockEvent = (overrides = {}) => ({
	id: 'event-1',
	title: 'Test Event',
	description: 'Test Description',
	...overrides,
});

const createDefaultProps = (overrides = {}): TimelineEventProps => ({
	event: createMockEvent(),
	size: 'md',
	markerVariant: 'default',
	orientation: 'vertical',
	...overrides,
});

describe('TimelineEvent - Rendering', () => {
	it('renders without crashing', () => {
		expect(() => {
			renderWithProviders(<TimelineEvent {...createDefaultProps()} />);
		}).not.toThrow();
	});

	it('renders vertical timeline event when orientation is vertical', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'vertical' })} />);

		const verticalEvent = screen.getByTestId('vertical-timeline-event');
		expect(verticalEvent).toBeInTheDocument();
		expect(verticalEvent).toHaveTextContent('Vertical Event: Test Event');
	});

	it('renders horizontal timeline event when orientation is horizontal', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'horizontal' })} />);

		const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
		expect(horizontalEvent).toBeInTheDocument();
		expect(horizontalEvent).toHaveTextContent('Horizontal Event: Test Event');
	});

	it('does not render vertical event when orientation is horizontal', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'horizontal' })} />);

		expect(screen.queryByTestId('vertical-timeline-event')).not.toBeInTheDocument();
	});

	it('does not render horizontal event when orientation is vertical', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'vertical' })} />);

		expect(screen.queryByTestId('horizontal-timeline-event')).not.toBeInTheDocument();
	});
});

describe('TimelineEvent - Props Passing', () => {
	it('passes event prop to vertical timeline event', () => {
		const event = createMockEvent({ id: 'custom-event', title: 'Custom Title' });
		renderWithProviders(
			<TimelineEvent {...createDefaultProps({ event, orientation: 'vertical' })} />
		);

		const verticalEvent = screen.getByTestId('vertical-timeline-event');
		expect(verticalEvent).toHaveAttribute('data-event-id', 'custom-event');
		expect(verticalEvent).toHaveTextContent('Vertical Event: Custom Title');
	});

	it('passes event prop to horizontal timeline event', () => {
		const event = createMockEvent({ id: 'custom-event', title: 'Custom Title' });
		renderWithProviders(
			<TimelineEvent {...createDefaultProps({ event, orientation: 'horizontal' })} />
		);

		const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
		expect(horizontalEvent).toHaveAttribute('data-event-id', 'custom-event');
		expect(horizontalEvent).toHaveTextContent('Horizontal Event: Custom Title');
	});

	it('passes size prop to vertical timeline event', () => {
		renderWithProviders(
			<TimelineEvent {...createDefaultProps({ size: 'lg', orientation: 'vertical' })} />
		);

		const verticalEvent = screen.getByTestId('vertical-timeline-event');
		expect(verticalEvent).toHaveAttribute('data-size', 'lg');
	});

	it('passes size prop to horizontal timeline event', () => {
		renderWithProviders(
			<TimelineEvent {...createDefaultProps({ size: 'sm', orientation: 'horizontal' })} />
		);

		const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
		expect(horizontalEvent).toHaveAttribute('data-size', 'sm');
	});

	it('passes markerVariant prop to vertical timeline event', () => {
		renderWithProviders(
			<TimelineEvent {...createDefaultProps({ markerVariant: 'icon', orientation: 'vertical' })} />
		);

		const verticalEvent = screen.getByTestId('vertical-timeline-event');
		expect(verticalEvent).toHaveAttribute('data-marker-variant', 'icon');
	});

	it('passes markerVariant prop to horizontal timeline event', () => {
		renderWithProviders(
			<TimelineEvent {...createDefaultProps({ markerVariant: 'dot', orientation: 'horizontal' })} />
		);

		const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
		expect(horizontalEvent).toHaveAttribute('data-marker-variant', 'dot');
	});

	it('passes orientation prop to vertical timeline event', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'vertical' })} />);

		const verticalEvent = screen.getByTestId('vertical-timeline-event');
		expect(verticalEvent).toHaveAttribute('data-orientation', 'vertical');
	});

	it('passes orientation prop to horizontal timeline event', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'horizontal' })} />);

		const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
		expect(horizontalEvent).toHaveAttribute('data-orientation', 'horizontal');
	});

	it('passes computed contentClasses to vertical timeline event', () => {
		renderWithProviders(
			<TimelineEvent {...createDefaultProps({ orientation: 'vertical', size: 'md' })} />
		);

		const verticalEvent = screen.getByTestId('vertical-timeline-event');
		expect(verticalEvent).toHaveAttribute('data-content-classes', 'content-vertical-md');
	});

	it('passes computed contentClasses to horizontal timeline event', () => {
		renderWithProviders(
			<TimelineEvent {...createDefaultProps({ orientation: 'horizontal', size: 'lg' })} />
		);

		const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
		expect(horizontalEvent).toHaveAttribute('data-content-classes', 'content-horizontal-lg');
	});

	it('passes computed contentSpacing to vertical timeline event', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'vertical' })} />);

		const verticalEvent = screen.getByTestId('vertical-timeline-event');
		expect(verticalEvent).toHaveAttribute('data-content-spacing', 'spacing-vertical');
	});

	it('passes computed contentSpacing to horizontal timeline event', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'horizontal' })} />);

		const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
		expect(horizontalEvent).toHaveAttribute('data-content-spacing', 'spacing-horizontal');
	});

	it('passes computed containerClasses to horizontal timeline event', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'horizontal' })} />);

		const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
		expect(horizontalEvent).toHaveAttribute('data-container-classes', 'container-horizontal');
	});
});

describe('TimelineEvent - Click Handler', () => {
	it('passes onClick handler to vertical timeline event when provided', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<TimelineEvent {...createDefaultProps({ orientation: 'vertical', onClick })} />
		);

		const verticalEvent = screen.getByTestId('vertical-timeline-event');
		expect(verticalEvent).toHaveAttribute('data-has-onclick', 'true');
	});

	it('does not pass onClick handler to vertical timeline event when not provided', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'vertical' })} />);

		const verticalEvent = screen.getByTestId('vertical-timeline-event');
		expect(verticalEvent).toHaveAttribute('data-has-onclick', 'false');
	});

	it('passes onClick handler to horizontal timeline event when provided', () => {
		const onClick = vi.fn();
		renderWithProviders(
			<TimelineEvent {...createDefaultProps({ orientation: 'horizontal', onClick })} />
		);

		const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
		expect(horizontalEvent).toHaveAttribute('data-has-onclick', 'true');
	});

	it('does not pass onClick handler to horizontal timeline event when not provided', () => {
		renderWithProviders(<TimelineEvent {...createDefaultProps({ orientation: 'horizontal' })} />);

		const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
		expect(horizontalEvent).toHaveAttribute('data-has-onclick', 'false');
	});
});

describe('TimelineEvent - Size Variants', () => {
	it('handles all size variants for vertical orientation', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const { unmount } = renderWithProviders(
				<TimelineEvent {...createDefaultProps({ size, orientation: 'vertical' })} />
			);

			const verticalEvent = screen.getByTestId('vertical-timeline-event');
			expect(verticalEvent).toHaveAttribute('data-size', size);
			unmount();
		}
	});

	it('handles all size variants for horizontal orientation', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const { unmount } = renderWithProviders(
				<TimelineEvent {...createDefaultProps({ size, orientation: 'horizontal' })} />
			);

			const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
			expect(horizontalEvent).toHaveAttribute('data-size', size);
			unmount();
		}
	});
});

describe('TimelineEvent - Marker Variants', () => {
	it('handles all marker variants for vertical orientation', () => {
		const variants: Array<'default' | 'dot' | 'icon' | 'custom'> = [
			'default',
			'dot',
			'icon',
			'custom',
		];

		for (const variant of variants) {
			const { unmount } = renderWithProviders(
				<TimelineEvent
					{...createDefaultProps({ markerVariant: variant, orientation: 'vertical' })}
				/>
			);

			const verticalEvent = screen.getByTestId('vertical-timeline-event');
			expect(verticalEvent).toHaveAttribute('data-marker-variant', variant);
			unmount();
		}
	});

	it('handles all marker variants for horizontal orientation', () => {
		const variants: Array<'default' | 'dot' | 'icon' | 'custom'> = [
			'default',
			'dot',
			'icon',
			'custom',
		];

		for (const variant of variants) {
			const { unmount } = renderWithProviders(
				<TimelineEvent
					{...createDefaultProps({ markerVariant: variant, orientation: 'horizontal' })}
				/>
			);

			const horizontalEvent = screen.getByTestId('horizontal-timeline-event');
			expect(horizontalEvent).toHaveAttribute('data-marker-variant', variant);
			unmount();
		}
	});
});
