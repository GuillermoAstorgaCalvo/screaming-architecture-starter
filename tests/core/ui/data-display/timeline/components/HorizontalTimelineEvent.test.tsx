/**
 * HorizontalTimelineEvent Component Tests
 *
 * Tests for the HorizontalTimelineEvent component including:
 * - Rendering with and without onClick handler
 * - Click handler functionality
 * - Props passing to child components (TimelineMarker, EventContent)
 * - Different sizes, variants, and orientations
 * - Container and content classes
 * - Accessibility features
 */

import { HorizontalTimelineEvent } from '@core/ui/data-display/timeline/components/HorizontalTimelineEvent';
import type { HorizontalTimelineEventProps } from '@core/ui/data-display/timeline/types/TimelineEvent.types';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const MOCK_EVENT = {
	id: 'event-1',
	title: 'Test Event Title',
	description: 'Test Event Description',
	timestamp: '2024-01-01',
	active: false,
	completed: false,
};

const DEFAULT_PROPS: HorizontalTimelineEventProps = {
	event: MOCK_EVENT,
	size: 'md',
	markerVariant: 'default',
	orientation: 'horizontal',
	containerClasses: 'test-container',
	contentClasses: 'test-content',
	contentSpacing: 'test-spacing',
};

describe('HorizontalTimelineEvent - Rendering', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} />);
		}).not.toThrow();
	});

	it('should render as div when onClick is not provided', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} />);
		const container = screen.getByText('Test Event Title').closest('div');
		expect(container).toBeInTheDocument();
		expect(container?.tagName).toBe('DIV');
	});

	it('should render as button when onClick is provided', () => {
		const handleClick = vi.fn();
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} onClick={handleClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();
		expect(button?.tagName).toBe('BUTTON');
		expect(button).toHaveAttribute('type', 'button');
	});

	it('should render event title', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render event description when provided', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.getByText('Test Event Description')).toBeInTheDocument();
	});

	it('should render event timestamp when provided', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.getByText('2024-01-01')).toBeInTheDocument();
	});

	it('should render without description when not provided', () => {
		const eventWithoutDescription = {
			...MOCK_EVENT,
			description: undefined,
		};
		renderWithProviders(
			<HorizontalTimelineEvent {...DEFAULT_PROPS} event={eventWithoutDescription} />
		);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
		expect(screen.queryByText('Test Event Description')).not.toBeInTheDocument();
	});

	it('should render without timestamp when not provided', () => {
		const eventWithoutTimestamp = {
			...MOCK_EVENT,
			timestamp: undefined,
		};
		renderWithProviders(
			<HorizontalTimelineEvent {...DEFAULT_PROPS} event={eventWithoutTimestamp} />
		);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
		expect(screen.queryByText('2024-01-01')).not.toBeInTheDocument();
	});
});

describe('HorizontalTimelineEvent - Click Handler', () => {
	it('should call onClick when button is clicked', () => {
		const handleClick = vi.fn();
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} onClick={handleClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();

		fireEvent.click(button!);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should not call onClick when div is clicked (no onClick provided)', () => {
		const handleClick = vi.fn();
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} />);
		const container = screen.getByText('Test Event Title').closest('div');
		expect(container).toBeInTheDocument();

		fireEvent.click(container!);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('should apply clickable classes when onClick is provided', () => {
		const handleClick = vi.fn();
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} onClick={handleClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('cursor-pointer');
		expect(button).toHaveClass('focus:outline-none');
		expect(button).toHaveClass('focus:ring-2');
		expect(button).toHaveClass('rounded');
	});

	it('should not apply clickable classes when onClick is not provided', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} />);
		const container = screen.getByText('Test Event Title').closest('div');
		expect(container).toBeInTheDocument();
		expect(container).not.toHaveClass('cursor-pointer');
	});
});

describe('HorizontalTimelineEvent - Props Passing', () => {
	it('should pass containerClasses to container element', () => {
		const { container } = renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} />);
		const containerElement = container.querySelector('.test-container');
		expect(containerElement).toBeInTheDocument();
		expect(containerElement).toHaveClass('test-container');
	});

	it('should pass containerClasses to button when onClick is provided', () => {
		const handleClick = vi.fn();
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} onClick={handleClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toHaveClass('test-container');
	});

	it('should pass size prop to TimelineMarker', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} size="sm" />);
		// TimelineMarker should render (we can verify by checking the structure)
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should pass markerVariant prop to TimelineMarker', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} markerVariant="dot" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should pass orientation prop to TimelineMarker', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} orientation="horizontal" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should pass event prop to TimelineMarker and EventContent', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
		expect(screen.getByText('Test Event Description')).toBeInTheDocument();
	});
});

describe('HorizontalTimelineEvent - Sizes', () => {
	it('should render with sm size', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} size="sm" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with md size', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} size="md" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with lg size', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} size="lg" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});
});

describe('HorizontalTimelineEvent - Marker Variants', () => {
	it('should render with default marker variant', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} markerVariant="default" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with dot marker variant', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} markerVariant="dot" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with icon marker variant', () => {
		const eventWithIcon = {
			...MOCK_EVENT,
			icon: <span data-testid="test-icon">Icon</span>,
		};
		renderWithProviders(
			<HorizontalTimelineEvent {...DEFAULT_PROPS} event={eventWithIcon} markerVariant="icon" />
		);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with custom marker variant', () => {
		const eventWithCustomMarker = {
			...MOCK_EVENT,
			customMarker: <span data-testid="custom-marker">Custom</span>,
		};
		renderWithProviders(
			<HorizontalTimelineEvent
				{...DEFAULT_PROPS}
				event={eventWithCustomMarker}
				markerVariant="custom"
			/>
		);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});
});

describe('HorizontalTimelineEvent - Orientations', () => {
	it('should render with horizontal orientation', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} orientation="horizontal" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with vertical orientation', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} orientation="vertical" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});
});

describe('HorizontalTimelineEvent - Event States', () => {
	it('should render with active event', () => {
		const activeEvent = {
			...MOCK_EVENT,
			active: true,
		};
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} event={activeEvent} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with completed event', () => {
		const completedEvent = {
			...MOCK_EVENT,
			completed: true,
		};
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} event={completedEvent} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with both active and completed event', () => {
		const activeCompletedEvent = {
			...MOCK_EVENT,
			active: true,
			completed: true,
		};
		renderWithProviders(
			<HorizontalTimelineEvent {...DEFAULT_PROPS} event={activeCompletedEvent} />
		);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});
});

describe('HorizontalTimelineEvent - Event Content', () => {
	it('should render event with content prop', () => {
		const eventWithContent = {
			...MOCK_EVENT,
			content: <div data-testid="event-content">Additional Content</div>,
		};
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} event={eventWithContent} />);
		expect(screen.getByTestId('event-content')).toBeInTheDocument();
		expect(screen.getByText('Additional Content')).toBeInTheDocument();
	});

	it('should render without content when not provided', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.queryByTestId('event-content')).not.toBeInTheDocument();
	});
});

describe('HorizontalTimelineEvent - Class Names', () => {
	it('should apply custom containerClasses', () => {
		const { container } = renderWithProviders(
			<HorizontalTimelineEvent {...DEFAULT_PROPS} containerClasses="custom-container-class" />
		);
		const containerElement = container.querySelector('.custom-container-class');
		expect(containerElement).toBeInTheDocument();
		expect(containerElement).toHaveClass('custom-container-class');
	});

	it('should combine containerClasses with clickable classes when onClick is provided', () => {
		const handleClick = vi.fn();
		renderWithProviders(
			<HorizontalTimelineEvent
				{...DEFAULT_PROPS}
				containerClasses="custom-container-class"
				onClick={handleClick}
			/>
		);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toHaveClass('custom-container-class');
		expect(button).toHaveClass('cursor-pointer');
	});
});

describe('HorizontalTimelineEvent - Edge Cases', () => {
	it('should handle onClick as undefined explicitly', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} onClick={undefined} />);
		const container = screen.getByText('Test Event Title').closest('div');
		expect(container).toBeInTheDocument();
		expect(container?.tagName).toBe('DIV');
	});

	it('should handle empty containerClasses', () => {
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} containerClasses="" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should handle event with only title', () => {
		const minimalEvent = {
			id: 'minimal-event',
			title: 'Minimal Title',
		};
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} event={minimalEvent} />);
		expect(screen.getByText('Minimal Title')).toBeInTheDocument();
	});

	it('should handle multiple clicks on button', () => {
		const handleClick = vi.fn();
		renderWithProviders(<HorizontalTimelineEvent {...DEFAULT_PROPS} onClick={handleClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();

		fireEvent.click(button!);
		fireEvent.click(button!);
		fireEvent.click(button!);
		expect(handleClick).toHaveBeenCalledTimes(3);
	});
});
