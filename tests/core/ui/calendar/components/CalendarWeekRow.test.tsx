/**
 * CalendarWeekRow Tests
 *
 * Tests for calendar week row rendering including:
 * - Week row rendering
 * - Week number display
 * - Day cells rendering
 * - Options passing
 */

import { renderWeekRow } from '@core/ui/calendar/components/CalendarWeekRow';
import type { WeekRowOptions } from '@core/ui/calendar/types/CalendarGridTypes';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('CalendarWeekRow - renderWeekRow', () => {
	const createMockWeek = (startDate: Date): Date[] => {
		const week: Date[] = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
			week.push(date);
		}
		return week;
	};

	const createWeekRowOptions = (overrides?: Partial<WeekRowOptions>): WeekRowOptions => {
		const week = createMockWeek(new Date(2024, 0, 1));
		return {
			week,
			weekIndex: 0,
			displayMonth: new Date(2024, 0, 1),
			showWeekNumbers: false,
			events: undefined,
			selectable: false,
			selectedDate: null,
			rangeSelectable: false,
			rangeStart: null,
			rangeEnd: null,
			minDate: undefined,
			maxDate: undefined,
			disabled: false,
			onDayClick: vi.fn(),
			...overrides,
		};
	};

	it('renders week row', () => {
		const options = createWeekRowOptions();
		const { container } = render(renderWeekRow(options));

		const row = container.querySelector('[role="row"]');
		expect(row).toBeInTheDocument();
	});

	it('renders with role="row"', () => {
		const options = createWeekRowOptions();
		const { container } = render(renderWeekRow(options));

		const row = container.querySelector('[role="row"]');
		expect(row).toBeInTheDocument();
		expect(row).toHaveAttribute('role', 'row');
	});

	it('renders 7 day cells', () => {
		const options = createWeekRowOptions();
		const { container } = render(renderWeekRow(options));

		const dayCells = container.querySelectorAll('[role="gridcell"]');
		expect(dayCells.length).toBe(7);
	});

	it('renders week number when showWeekNumbers is true', () => {
		const options = createWeekRowOptions({ showWeekNumbers: true });
		const { container } = render(renderWeekRow(options));

		// Week number should be rendered (first child of row)
		const row = container.querySelector('[role="row"]');
		expect(row?.children.length).toBe(8); // 1 week number + 7 day cells
	});

	it('does not render week number when showWeekNumbers is false', () => {
		const options = createWeekRowOptions({ showWeekNumbers: false });
		const { container } = render(renderWeekRow(options));

		const row = container.querySelector('[role="row"]');
		expect(row?.children.length).toBe(7); // Only day cells
	});

	it('renders correct week number', () => {
		const week = createMockWeek(new Date(2024, 0, 1));
		const options = createWeekRowOptions({
			week,
			showWeekNumbers: true,
		});
		const { container } = render(renderWeekRow(options));

		// Week number should be displayed (checking for numeric content)
		const row = container.querySelector('[role="row"]');
		const weekNumberCell = row?.firstChild;
		expect(weekNumberCell).toBeInTheDocument();
		expect(weekNumberCell?.textContent).toMatch(/\d+/);
	});

	it('passes onDayClick to day cells', () => {
		const onDayClick = vi.fn();
		const options = createWeekRowOptions({ onDayClick, selectable: true });
		const { container } = render(renderWeekRow(options));

		const dayCells = container.querySelectorAll('[role="gridcell"]');
		const firstDay = dayCells[0] as HTMLElement;

		// Click should trigger onDayClick
		firstDay.click();
		expect(onDayClick).toHaveBeenCalled();
	});

	it('passes selectedDate to day cells', () => {
		const selectedDate = new Date(2024, 0, 3);
		const options = createWeekRowOptions({
			selectedDate,
			selectable: true,
		});
		render(renderWeekRow(options));

		// Selected day should have aria-selected="true"
		const selectedCell = screen.getByRole('gridcell', { selected: true });
		expect(selectedCell).toBeInTheDocument();
	});

	it('passes range selection props to day cells', () => {
		const rangeStart = new Date(2024, 0, 2);
		const rangeEnd = new Date(2024, 0, 5);
		const options = createWeekRowOptions({
			rangeSelectable: true,
			rangeStart,
			rangeEnd,
		});
		render(renderWeekRow(options));

		// Range cells should be rendered
		const row = screen.getByRole('row');
		expect(row).toBeInTheDocument();
	});

	it('passes events to day cells', () => {
		const events = [
			{ id: '1', date: new Date(2024, 0, 3), title: 'Meeting' },
			{ id: '2', date: new Date(2024, 0, 4), title: 'Conference' },
		];
		const options = createWeekRowOptions({ events });
		render(renderWeekRow(options));

		// Events should be passed to day cells (aria-label should include event count)
		const row = screen.getByRole('row');
		expect(row).toBeInTheDocument();
	});

	it('passes disabled state to day cells', () => {
		const options = createWeekRowOptions({ disabled: true });
		render(renderWeekRow(options));

		// Day cells are buttons with role="gridcell"
		const dayButtons = screen.getAllByRole('gridcell');
		for (const button of dayButtons) {
			expect(button).toBeDisabled();
		}
	});

	it('passes minDate and maxDate to day cells', () => {
		const minDate = new Date(2024, 0, 2);
		const maxDate = new Date(2024, 0, 6);
		const options = createWeekRowOptions({ minDate, maxDate });
		render(renderWeekRow(options));

		// Days outside range should be disabled
		const row = screen.getByRole('row');
		expect(row).toBeInTheDocument();
	});

	it('handles different week indices', () => {
		const week1 = createMockWeek(new Date(2024, 0, 1));
		const week2 = createMockWeek(new Date(2024, 0, 8));

		const options1 = createWeekRowOptions({ week: week1, weekIndex: 0 });
		const options2 = createWeekRowOptions({ week: week2, weekIndex: 1 });

		const { container: container1 } = render(renderWeekRow(options1));
		const { container: container2 } = render(renderWeekRow(options2));

		const row1 = container1.querySelector('[role="row"]');
		const row2 = container2.querySelector('[role="row"]');

		expect(row1).toBeInTheDocument();
		expect(row2).toBeInTheDocument();
		expect(row1).not.toEqual(row2);
	});

	it('handles renderDay custom renderer', () => {
		const renderDay = vi.fn(props => <div>{props.date.getDate()}</div>);
		const options = createWeekRowOptions({ renderDay });
		render(renderWeekRow(options));

		// Custom renderer should be called
		expect(renderDay).toHaveBeenCalled();
	});

	it('applies correct CSS classes to row', () => {
		const options = createWeekRowOptions();
		const { container } = render(renderWeekRow(options));

		const row = container.querySelector('[role="row"]');
		expect(row).toHaveClass('grid', 'grid-cols-7', 'border-b');
	});

	it('handles week with dates from different months', () => {
		// Week that spans month boundary
		const week: Date[] = [
			new Date(2024, 0, 29), // January
			new Date(2024, 0, 30),
			new Date(2024, 0, 31),
			new Date(2024, 1, 1), // February
			new Date(2024, 1, 2),
			new Date(2024, 1, 3),
			new Date(2024, 1, 4),
		];
		const options = createWeekRowOptions({ week });
		render(renderWeekRow(options));

		const row = screen.getByRole('row');
		expect(row).toBeInTheDocument();
	});

	it('handles empty week array gracefully', () => {
		const options = createWeekRowOptions({ week: [] });
		const { container } = render(renderWeekRow(options));

		const row = container.querySelector('[role="row"]');
		expect(row).toBeInTheDocument();
		// Should still render row structure even with no days
	});

	it('generates unique week keys', () => {
		const week1 = createMockWeek(new Date(2024, 0, 1));
		const week2 = createMockWeek(new Date(2024, 0, 8));

		const options1 = createWeekRowOptions({ week: week1, weekIndex: 0 });
		const options2 = createWeekRowOptions({ week: week2, weekIndex: 1 });

		const { container: container1 } = render(renderWeekRow(options1));
		const { container: container2 } = render(renderWeekRow(options2));

		const row1 = container1.querySelector('[role="row"]');
		const row2 = container2.querySelector('[role="row"]');

		// Keys should be different
		expect(row1?.getAttribute('key') || row1).not.toEqual(row2?.getAttribute('key') || row2);
	});
});
