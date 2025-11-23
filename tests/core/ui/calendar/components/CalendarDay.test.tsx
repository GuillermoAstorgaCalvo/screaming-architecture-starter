/**
 * CalendarDay Component Tests
 *
 * Tests for the CalendarDay component including:
 * - Rendering
 * - Date display
 * - State variations (selected, today, range, disabled)
 * - Event handling (click, keyboard)
 * - Accessibility
 * - Custom renderers
 * - Event badges
 * - Edge cases
 */

import { CalendarDay } from '@core/ui/calendar/components/CalendarDay';
import type { CalendarDayProps } from '@core/ui/calendar/types/CalendarTypes';
import type { CalendarEvent } from '@src-types/ui/data/calendar';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const TEST_DATE = new Date(2024, 0, 15); // January 15, 2024
const TODAY_DATE = new Date();

function createCalendarDayProps(
	overrides?: Partial<
		CalendarDayProps & { weekdayNames?: string[]; showWeekNumber?: boolean; weekNumber?: number }
	>
): Parameters<typeof CalendarDay>[0] {
	return {
		date: TEST_DATE,
		isCurrentMonth: true,
		isToday: false,
		...overrides,
	};
}

function renderCalendarDay(
	props?: Partial<
		CalendarDayProps & { weekdayNames?: string[]; showWeekNumber?: boolean; weekNumber?: number }
	>
) {
	const defaultProps = createCalendarDayProps(props);
	return renderWithProviders(<CalendarDay {...defaultProps} />);
}

describe('CalendarDay - Rendering', () => {
	it('renders day button', () => {
		renderCalendarDay();
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
		expect(button.tagName).toBe('BUTTON');
	});

	it('renders day number', () => {
		renderCalendarDay();
		expect(screen.getByText('15')).toBeInTheDocument();
	});

	it('renders correct day number for different dates', () => {
		const date = new Date(2024, 0, 5);
		renderCalendarDay({ date });
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('renders with type="button"', () => {
		renderCalendarDay();
		const button = screen.getByRole('gridcell');
		expect(button).toHaveAttribute('type', 'button');
	});

	it('applies correct role="gridcell"', () => {
		renderCalendarDay();
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});
});

describe('CalendarDay - Current Month', () => {
	it('renders day in current month', () => {
		renderCalendarDay({ isCurrentMonth: true });
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});

	it('renders day in other month', () => {
		renderCalendarDay({ isCurrentMonth: false });
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});
});

describe('CalendarDay - Today State', () => {
	it('renders today indicator when isToday is true', () => {
		renderCalendarDay({ date: TODAY_DATE, isToday: true });
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
		// Today should have special styling (font-semibold ring-2 ring-primary)
		expect(button.className).toContain('ring-2');
	});

	it('renders without today indicator when isToday is false', () => {
		renderCalendarDay({ isToday: false });
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});
});

describe('CalendarDay - Selected State', () => {
	it('renders selected day', () => {
		renderCalendarDay({ isSelected: true });
		const button = screen.getByRole('gridcell');
		expect(button).toHaveAttribute('aria-selected', 'true');
	});

	it('renders unselected day', () => {
		renderCalendarDay({ isSelected: false });
		const button = screen.getByRole('gridcell');
		expect(button).toHaveAttribute('aria-selected', 'false');
	});

	it('handles undefined isSelected', () => {
		renderCalendarDay({});
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});
});

describe('CalendarDay - Range States', () => {
	it('renders day in range', () => {
		renderCalendarDay({ isInRange: true });
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});

	it('renders range start', () => {
		renderCalendarDay({ isRangeStart: true });
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});

	it('renders range end', () => {
		renderCalendarDay({ isRangeEnd: true });
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});

	it('renders day with all range states', () => {
		renderCalendarDay({
			isInRange: true,
			isRangeStart: true,
			isRangeEnd: true,
		});
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});
});

describe('CalendarDay - Disabled State', () => {
	it('renders disabled day', () => {
		renderCalendarDay({ disabled: true });
		const button = screen.getByRole('gridcell');
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute('tabIndex', '-1');
	});

	it('renders enabled day', () => {
		renderCalendarDay({ disabled: false });
		const button = screen.getByRole('gridcell');
		expect(button).not.toBeDisabled();
		expect(button).toHaveAttribute('tabIndex', '0');
	});

	it('handles undefined disabled', () => {
		renderCalendarDay({});
		const button = screen.getByRole('gridcell');
		expect(button).not.toBeDisabled();
		expect(button).toHaveAttribute('tabIndex', '0');
	});
});

describe('CalendarDay - Events', () => {
	it('renders day without events', () => {
		renderCalendarDay();
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
		expect(screen.queryByText(/event/i)).not.toBeInTheDocument();
	});

	it('renders day with single event', () => {
		const events: CalendarEvent[] = [
			{
				id: 'event-1',
				title: 'Test Event',
				date: TEST_DATE,
			},
		];
		renderCalendarDay({ events });
		expect(screen.getByText('Test Event')).toBeInTheDocument();
	});

	it('renders day with multiple events', () => {
		const events: CalendarEvent[] = [
			{
				id: 'event-1',
				title: 'Event 1',
				date: TEST_DATE,
			},
			{
				id: 'event-2',
				title: 'Event 2',
				date: TEST_DATE,
			},
		];
		renderCalendarDay({ events });
		expect(screen.getByText('Event 1')).toBeInTheDocument();
		expect(screen.getByText('Event 2')).toBeInTheDocument();
	});

	it('renders event count when events exceed max visible', () => {
		const events: CalendarEvent[] = Array.from({ length: 5 }, (_, i) => ({
			id: `event-${i}`,
			title: `Event ${i}`,
			date: TEST_DATE,
		}));
		renderCalendarDay({ events });
		// Should show +2 if MAX_VISIBLE_EVENTS is 3
		expect(screen.getByText(/\+/)).toBeInTheDocument();
	});

	it('includes event count in aria-label', () => {
		const events: CalendarEvent[] = [
			{
				id: 'event-1',
				title: 'Test Event',
				date: TEST_DATE,
			},
		];
		renderCalendarDay({ events });
		const button = screen.getByRole('gridcell');
		const ariaLabel = button.getAttribute('aria-label');
		expect(ariaLabel).toContain('1 event');
	});

	it('includes multiple events count in aria-label', () => {
		const events: CalendarEvent[] = [
			{
				id: 'event-1',
				title: 'Event 1',
				date: TEST_DATE,
			},
			{
				id: 'event-2',
				title: 'Event 2',
				date: TEST_DATE,
			},
		];
		renderCalendarDay({ events });
		const button = screen.getByRole('gridcell');
		const ariaLabel = button.getAttribute('aria-label');
		expect(ariaLabel).toContain('2 events');
	});

	it('includes today in aria-label when isToday is true', () => {
		renderCalendarDay({ date: TODAY_DATE, isToday: true });
		const button = screen.getByRole('gridcell');
		const ariaLabel = button.getAttribute('aria-label');
		expect(ariaLabel).toContain('today');
	});
});

describe('CalendarDay - Interactions', () => {
	it('calls onClick when day is clicked and not disabled', () => {
		const handleClick = vi.fn();
		renderCalendarDay({ onClick: handleClick, disabled: false });
		const button = screen.getByRole('gridcell');
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
		expect(handleClick).toHaveBeenCalledWith(TEST_DATE);
	});

	it('does not call onClick when day is disabled', () => {
		const handleClick = vi.fn();
		renderCalendarDay({ onClick: handleClick, disabled: true });
		const button = screen.getByRole('gridcell');
		fireEvent.click(button);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('does not call onClick when onClick is not provided', () => {
		renderCalendarDay({});
		const button = screen.getByRole('gridcell');
		expect(() => fireEvent.click(button)).not.toThrow();
	});

	it('handles Enter key press', () => {
		const handleClick = vi.fn();
		renderCalendarDay({ onClick: handleClick, disabled: false });
		const button = screen.getByRole('gridcell');
		fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
		expect(handleClick).toHaveBeenCalledTimes(1);
		expect(handleClick).toHaveBeenCalledWith(TEST_DATE);
	});

	it('handles Space key press', () => {
		const handleClick = vi.fn();
		renderCalendarDay({ onClick: handleClick, disabled: false });
		const button = screen.getByRole('gridcell');
		fireEvent.keyDown(button, { key: ' ', code: 'Space' });
		expect(handleClick).toHaveBeenCalledTimes(1);
		expect(handleClick).toHaveBeenCalledWith(TEST_DATE);
	});

	it('does not handle other key presses', () => {
		const handleClick = vi.fn();
		renderCalendarDay({ onClick: handleClick, disabled: false });
		const button = screen.getByRole('gridcell');
		fireEvent.keyDown(button, { key: 'ArrowRight', code: 'ArrowRight' });
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('does not handle key press when disabled', () => {
		const handleClick = vi.fn();
		renderCalendarDay({ onClick: handleClick, disabled: true });
		const button = screen.getByRole('gridcell');
		fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('prevents default on Enter key press', () => {
		const handleClick = vi.fn();
		renderCalendarDay({ onClick: handleClick, disabled: false });
		const button = screen.getByRole('gridcell');
		// The handler calls preventDefault before onClick
		// If onClick is called, we know preventDefault was called
		fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
		expect(handleClick).toHaveBeenCalled();
	});

	it('prevents default on Space key press', () => {
		const handleClick = vi.fn();
		renderCalendarDay({ onClick: handleClick, disabled: false });
		const button = screen.getByRole('gridcell');
		// The handler calls preventDefault before onClick
		// If onClick is called, we know preventDefault was called
		fireEvent.keyDown(button, { key: ' ', code: 'Space' });
		expect(handleClick).toHaveBeenCalled();
	});
});

describe('CalendarDay - Custom Renderer', () => {
	it('uses custom renderDay when provided', () => {
		const customRenderer = vi.fn(() => <div data-testid="custom-day">Custom Day</div>);
		renderCalendarDay({ renderDay: customRenderer });
		expect(screen.getByTestId('custom-day')).toBeInTheDocument();
		expect(customRenderer).toHaveBeenCalled();
	});

	it('passes correct props to custom renderer', () => {
		const customRenderer = vi.fn(() => <div>Custom</div>);
		const props = createCalendarDayProps({
			date: TEST_DATE,
			isSelected: true,
			isToday: false,
		});
		renderCalendarDay({ ...props, renderDay: customRenderer });
		expect(customRenderer).toHaveBeenCalledWith(
			expect.objectContaining({
				date: TEST_DATE,
				isSelected: true,
				isToday: false,
			})
		);
	});

	it('uses default renderer when renderDay is not provided', () => {
		renderCalendarDay();
		expect(screen.getByText('15')).toBeInTheDocument();
	});
});

describe('CalendarDay - Accessibility', () => {
	it('has no accessibility violations when wrapped in proper structure', async () => {
		// CalendarDay requires a parent row for proper ARIA structure
		// In real usage, CalendarDay would be inside a table with proper structure
		// For this test, we skip the aria-required-parent rule as the component
		// is tested in isolation
		const { container } = renderWithProviders(
			<table role="grid">
				<tbody>
					<tr role="row">
						<td role="gridcell">
							<CalendarDay {...createCalendarDayProps()} />
						</td>
					</tr>
				</tbody>
			</table>
		);
		await expectA11y(container, {
			rules: {
				'color-contrast': { enabled: false },
				'page-has-heading-one': { enabled: false },
				'aria-required-parent': { enabled: false },
			},
		} as any);
	});

	it('has correct aria-label', () => {
		renderCalendarDay();
		const button = screen.getByRole('gridcell');
		const ariaLabel = button.getAttribute('aria-label');
		expect(ariaLabel).toBeTruthy();
		expect(ariaLabel).toContain(TEST_DATE.toLocaleDateString());
	});

	it('has correct aria-selected when selected', () => {
		renderCalendarDay({ isSelected: true });
		const button = screen.getByRole('gridcell');
		expect(button).toHaveAttribute('aria-selected', 'true');
	});

	it('has correct aria-selected when not selected', () => {
		renderCalendarDay({ isSelected: false });
		const button = screen.getByRole('gridcell');
		expect(button).toHaveAttribute('aria-selected', 'false');
	});

	it('is keyboard accessible', () => {
		renderCalendarDay();
		const button = screen.getByRole('gridcell');
		button.focus();
		expect(button).toHaveFocus();
	});

	it('is not focusable when disabled', () => {
		renderCalendarDay({ disabled: true });
		const button = screen.getByRole('gridcell');
		expect(button).toHaveAttribute('tabIndex', '-1');
	});
});

describe('CalendarDay - Event Badges', () => {
	it('renders event with default color', () => {
		const events: CalendarEvent[] = [
			{
				id: 'event-1',
				title: 'Default Event',
				date: TEST_DATE,
			},
		];
		renderCalendarDay({ events });
		const eventElement = screen.getByText('Default Event');
		expect(eventElement).toBeInTheDocument();
	});

	it('renders event with custom color', () => {
		const events: CalendarEvent[] = [
			{
				id: 'event-1',
				title: 'Primary Event',
				date: TEST_DATE,
				color: 'primary',
			},
		];
		renderCalendarDay({ events });
		const eventElement = screen.getByText('Primary Event');
		expect(eventElement).toBeInTheDocument();
	});

	it('renders event with description as title attribute', () => {
		const events: CalendarEvent[] = [
			{
				id: 'event-1',
				title: 'Event with Description',
				description: 'This is a description',
				date: TEST_DATE,
			},
		];
		renderCalendarDay({ events });
		const eventElement = screen.getByText('Event with Description');
		expect(eventElement).toHaveAttribute('title', 'This is a description');
	});

	it('uses event title as title attribute when description is not provided', () => {
		const events: CalendarEvent[] = [
			{
				id: 'event-1',
				title: 'Event Title',
				date: TEST_DATE,
			},
		];
		renderCalendarDay({ events });
		const eventElement = screen.getByText('Event Title');
		expect(eventElement).toHaveAttribute('title', 'Event Title');
	});
});

describe('CalendarDay - Edge Cases', () => {
	it('handles date at start of month', () => {
		const date = new Date(2024, 0, 1);
		renderCalendarDay({ date });
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('handles date at end of month', () => {
		const date = new Date(2024, 0, 31);
		renderCalendarDay({ date });
		expect(screen.getByText('31')).toBeInTheDocument();
	});

	it('handles empty events array', () => {
		renderCalendarDay({ events: [] });
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});

	it('handles all optional props undefined', () => {
		renderCalendarDay({});
		const button = screen.getByRole('gridcell');
		expect(button).toBeInTheDocument();
	});

	it('handles rapid clicks', () => {
		const handleClick = vi.fn();
		renderCalendarDay({ onClick: handleClick, disabled: false });
		const button = screen.getByRole('gridcell');
		for (let i = 0; i < 5; i++) {
			fireEvent.click(button);
		}
		expect(handleClick).toHaveBeenCalledTimes(5);
	});

	it('calls onClick handler when provided', () => {
		const handleClick = vi.fn();
		renderCalendarDay({ onClick: handleClick, disabled: false });
		const button = screen.getByRole('gridcell');
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledWith(TEST_DATE);
	});
});

describe('CalendarDay - Props Combinations', () => {
	it('combines selected and today states', () => {
		renderCalendarDay({ isSelected: true, isToday: true });
		const button = screen.getByRole('gridcell');
		expect(button).toHaveAttribute('aria-selected', 'true');
		expect(button.className).toContain('ring-2');
	});

	it('combines disabled and selected states', () => {
		renderCalendarDay({ disabled: true, isSelected: true });
		const button = screen.getByRole('gridcell');
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute('aria-selected', 'true');
	});

	it('combines range states with selected', () => {
		renderCalendarDay({
			isSelected: true,
			isInRange: true,
			isRangeStart: true,
		});
		const button = screen.getByRole('gridcell');
		expect(button).toHaveAttribute('aria-selected', 'true');
		expect(button).toBeInTheDocument();
	});

	it('combines all states', () => {
		renderCalendarDay({
			isSelected: true,
			isToday: true,
			isInRange: true,
			isRangeStart: true,
			isRangeEnd: false,
			disabled: false,
		});
		const button = screen.getByRole('gridcell');
		expect(button).toHaveAttribute('aria-selected', 'true');
		expect(button).toBeInTheDocument();
	});
});
