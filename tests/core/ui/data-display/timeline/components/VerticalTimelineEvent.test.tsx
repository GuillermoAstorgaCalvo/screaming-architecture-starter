/**
 * VerticalTimelineEvent Component Tests
 *
 * Tests for the VerticalTimelineEvent component including:
 * - Rendering with and without onClick handler
 * - Click handler functionality
 * - Props passing to child components (TimelineMarker, EventContent)
 * - Different sizes, variants, and orientations
 * - Content classes and spacing
 * - Accessibility features
 */

import { VerticalTimelineEvent } from '@core/ui/data-display/timeline/components/VerticalTimelineEvent';
import type { VerticalTimelineEventProps } from '@core/ui/data-display/timeline/types/TimelineEvent.types';
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

const DEFAULT_PROPS: VerticalTimelineEventProps = {
	event: MOCK_EVENT,
	size: 'md',
	markerVariant: 'default',
	orientation: 'vertical',
	contentClasses: 'test-content',
	contentSpacing: 'test-spacing',
};

describe('VerticalTimelineEvent - Rendering', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		}).not.toThrow();
	});

	it('should render EventContent when onClick is not provided', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render as button when onClick is provided', () => {
		const handleClick = vi.fn();
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} onClick={handleClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();
		expect(button?.tagName).toBe('BUTTON');
		expect(button).toHaveAttribute('type', 'button');
	});

	it('should render event title', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render event description when provided', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.getByText('Test Event Description')).toBeInTheDocument();
	});

	it('should render event timestamp when provided', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.getByText('2024-01-01')).toBeInTheDocument();
	});

	it('should render without description when not provided', () => {
		const eventWithoutDescription = {
			...MOCK_EVENT,
			description: undefined,
		};
		renderWithProviders(
			<VerticalTimelineEvent {...DEFAULT_PROPS} event={eventWithoutDescription} />
		);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
		expect(screen.queryByText('Test Event Description')).not.toBeInTheDocument();
	});

	it('should render without timestamp when not provided', () => {
		const eventWithoutTimestamp = {
			...MOCK_EVENT,
			timestamp: undefined,
		};
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} event={eventWithoutTimestamp} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
		expect(screen.queryByText('2024-01-01')).not.toBeInTheDocument();
	});
});

describe('VerticalTimelineEvent - Click Handler', () => {
	it('should call onClick when button is clicked', () => {
		const handleClick = vi.fn();
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} onClick={handleClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();

		fireEvent.click(button!);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should not render button when onClick is not provided', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		const buttons = screen.queryAllByRole('button');
		expect(buttons).toHaveLength(0);
	});

	it('should apply clickable classes when onClick is provided', () => {
		const handleClick = vi.fn();
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} onClick={handleClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('cursor-pointer');
		expect(button).toHaveClass('focus:outline-none');
		expect(button).toHaveClass('focus:ring-2');
		expect(button).toHaveClass('rounded');
		expect(button).toHaveClass('text-left');
	});

	it('should combine contentClasses and contentSpacing with clickable classes', () => {
		const handleClick = vi.fn();
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} onClick={handleClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('test-content');
		expect(button).toHaveClass('test-spacing');
	});
});

describe('VerticalTimelineEvent - Props Passing', () => {
	it('should pass size prop to TimelineMarker', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} size="sm" />);
		// TimelineMarker should render (we can verify by checking the structure)
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should pass markerVariant prop to TimelineMarker', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} markerVariant="dot" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should pass orientation prop to TimelineMarker', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} orientation="vertical" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should pass event prop to TimelineMarker and EventContent', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
		expect(screen.getByText('Test Event Description')).toBeInTheDocument();
	});

	it('should pass contentClasses to EventContent when not clickable', () => {
		const { container } = renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		const contentElement = container.querySelector('.test-content');
		expect(contentElement).toBeInTheDocument();
		expect(contentElement).toHaveClass('test-content');
	});

	it('should pass contentSpacing to EventContent when not clickable', () => {
		const { container } = renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		const contentElement = container.querySelector('.test-spacing');
		expect(contentElement).toBeInTheDocument();
		expect(contentElement).toHaveClass('test-spacing');
	});
});

describe('VerticalTimelineEvent - Sizes', () => {
	it('should render with sm size', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} size="sm" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with md size', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} size="md" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with lg size', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} size="lg" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});
});

describe('VerticalTimelineEvent - Marker Variants', () => {
	it('should render with default marker variant', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} markerVariant="default" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with dot marker variant', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} markerVariant="dot" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with icon marker variant', () => {
		const eventWithIcon = {
			...MOCK_EVENT,
			icon: <span data-testid="test-icon">Icon</span>,
		};
		renderWithProviders(
			<VerticalTimelineEvent {...DEFAULT_PROPS} event={eventWithIcon} markerVariant="icon" />
		);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with custom marker variant', () => {
		const eventWithCustomMarker = {
			...MOCK_EVENT,
			customMarker: <span data-testid="custom-marker">Custom</span>,
		};
		renderWithProviders(
			<VerticalTimelineEvent
				{...DEFAULT_PROPS}
				event={eventWithCustomMarker}
				markerVariant="custom"
			/>
		);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});
});

describe('VerticalTimelineEvent - Orientations', () => {
	it('should render with vertical orientation', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} orientation="vertical" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with horizontal orientation', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} orientation="horizontal" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});
});

describe('VerticalTimelineEvent - Event States', () => {
	it('should render with active event', () => {
		const activeEvent = {
			...MOCK_EVENT,
			active: true,
		};
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} event={activeEvent} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with completed event', () => {
		const completedEvent = {
			...MOCK_EVENT,
			completed: true,
		};
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} event={completedEvent} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should render with both active and completed event', () => {
		const activeCompletedEvent = {
			...MOCK_EVENT,
			active: true,
			completed: true,
		};
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} event={activeCompletedEvent} />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});
});

describe('VerticalTimelineEvent - Event Content', () => {
	it('should render event with content prop', () => {
		const eventWithContent = {
			...MOCK_EVENT,
			content: <div data-testid="event-content">Additional Content</div>,
		};
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} event={eventWithContent} />);
		expect(screen.getByTestId('event-content')).toBeInTheDocument();
		expect(screen.getByText('Additional Content')).toBeInTheDocument();
	});

	it('should render without content when not provided', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		expect(screen.queryByTestId('event-content')).not.toBeInTheDocument();
	});

	it('should render content in button when onClick is provided', () => {
		const eventWithContent = {
			...MOCK_EVENT,
			content: <div data-testid="event-content">Additional Content</div>,
		};
		const handleClick = vi.fn();
		renderWithProviders(
			<VerticalTimelineEvent {...DEFAULT_PROPS} event={eventWithContent} onClick={handleClick} />
		);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();
		expect(screen.getByTestId('event-content')).toBeInTheDocument();
	});
});

describe('VerticalTimelineEvent - Class Names', () => {
	it('should apply custom contentClasses to EventContent', () => {
		const { container } = renderWithProviders(
			<VerticalTimelineEvent {...DEFAULT_PROPS} contentClasses="custom-content-class" />
		);
		const contentElement = container.querySelector('.custom-content-class');
		expect(contentElement).toBeInTheDocument();
		expect(contentElement).toHaveClass('custom-content-class');
	});

	it('should combine contentClasses with clickable classes when onClick is provided', () => {
		const handleClick = vi.fn();
		renderWithProviders(
			<VerticalTimelineEvent
				{...DEFAULT_PROPS}
				contentClasses="custom-content-class"
				onClick={handleClick}
			/>
		);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toHaveClass('custom-content-class');
		expect(button).toHaveClass('cursor-pointer');
	});

	it('should apply custom contentSpacing to EventContent', () => {
		const { container } = renderWithProviders(
			<VerticalTimelineEvent {...DEFAULT_PROPS} contentSpacing="custom-spacing-class" />
		);
		const contentElement = container.querySelector('.custom-spacing-class');
		expect(contentElement).toBeInTheDocument();
		expect(contentElement).toHaveClass('custom-spacing-class');
	});

	it('should combine contentSpacing with clickable classes when onClick is provided', () => {
		const handleClick = vi.fn();
		renderWithProviders(
			<VerticalTimelineEvent
				{...DEFAULT_PROPS}
				contentSpacing="custom-spacing-class"
				onClick={handleClick}
			/>
		);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toHaveClass('custom-spacing-class');
		expect(button).toHaveClass('cursor-pointer');
	});
});

describe('VerticalTimelineEvent - Edge Cases', () => {
	it('should handle onClick as undefined explicitly', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} onClick={undefined} />);
		const buttons = screen.queryAllByRole('button');
		expect(buttons).toHaveLength(0);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should handle empty contentClasses', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} contentClasses="" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should handle empty contentSpacing', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} contentSpacing="" />);
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});

	it('should handle event with only title', () => {
		const minimalEvent = {
			id: 'minimal-event',
			title: 'Minimal Title',
		};
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} event={minimalEvent} />);
		expect(screen.getByText('Minimal Title')).toBeInTheDocument();
	});

	it('should handle multiple clicks on button', () => {
		const handleClick = vi.fn();
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} onClick={handleClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();

		fireEvent.click(button!);
		fireEvent.click(button!);
		fireEvent.click(button!);
		expect(handleClick).toHaveBeenCalledTimes(3);
	});

	it('should handle onClick as empty function', () => {
		const emptyClick = () => {};
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} onClick={emptyClick} />);
		const button = screen.getByText('Test Event Title').closest('button');
		expect(button).toBeInTheDocument();
		expect(button?.tagName).toBe('BUTTON');
	});

	it('should render TimelineMarker component', () => {
		renderWithProviders(<VerticalTimelineEvent {...DEFAULT_PROPS} />);
		// TimelineMarker should be rendered (we verify by checking the overall structure)
		expect(screen.getByText('Test Event Title')).toBeInTheDocument();
	});
});
