/**
 * CalendarGridHelpers Tests
 *
 * Tests for calendar grid helper functions including:
 * - Weekday headers rendering
 * - Calendar weeks rendering
 */

import {
	renderCalendarWeeks,
	renderWeekdayHeaders,
} from '@core/ui/calendar/helpers/CalendarGridHelpers';
import type { WeekRowOptions } from '@core/ui/calendar/types/CalendarGridTypes';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('CalendarGridHelpers - renderWeekdayHeaders', () => {
	it('renders weekday headers', () => {
		const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const { container } = render(renderWeekdayHeaders(weekdayNames, false));

		for (const name of weekdayNames) {
			expect(screen.getByText(name)).toBeInTheDocument();
		}
	});

	it('renders with role="row"', () => {
		const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const { container } = render(renderWeekdayHeaders(weekdayNames, false));

		const row = container.querySelector('[role="row"]');
		expect(row).toBeInTheDocument();
	});

	it('renders column headers with role="columnheader"', () => {
		const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		render(renderWeekdayHeaders(weekdayNames, false));

		const headers = screen.getAllByRole('columnheader');
		expect(headers).toHaveLength(7);
	});

	it('renders week number placeholder when showWeekNumbers is true', () => {
		const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const { container } = render(renderWeekdayHeaders(weekdayNames, true));

		// Should have 8 children (1 for week number + 7 for weekdays)
		const row = container.querySelector('[role="row"]');
		expect(row?.children.length).toBe(8);
	});

	it('does not render week number placeholder when showWeekNumbers is false', () => {
		const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const { container } = render(renderWeekdayHeaders(weekdayNames, false));

		// Should have 7 children (only weekdays)
		const row = container.querySelector('[role="row"]');
		expect(row?.children.length).toBe(7);
	});

	it('applies correct CSS classes', () => {
		const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const { container } = render(renderWeekdayHeaders(weekdayNames, false));

		const row = container.querySelector('[role="row"]');
		expect(row).toHaveClass('grid', 'grid-cols-7', 'border-b', 'bg-muted/50');
	});

	it('handles different weekday name arrays', () => {
		const weekdayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
		render(renderWeekdayHeaders(weekdayNames, false));

		// Use getAllByText since some names appear multiple times
		for (const name of weekdayNames) {
			const elements = screen.getAllByText(name);
			expect(elements.length).toBeGreaterThan(0);
			expect(elements[0]).toBeInTheDocument();
		}
	});

	it('handles localized weekday names', () => {
		const weekdayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
		render(renderWeekdayHeaders(weekdayNames, false));

		for (const name of weekdayNames) {
			expect(screen.getByText(name)).toBeInTheDocument();
		}
	});
});

describe('CalendarGridHelpers - renderCalendarWeeks', () => {
	const createMockWeek = (startDate: Date): Date[] => {
		const week: Date[] = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
			week.push(date);
		}
		return week;
	};

	const createMockWeeks = (): Date[][] => {
		const weeks: Date[][] = [];
		const startDate = new Date(2024, 0, 1);
		for (let i = 0; i < 6; i++) {
			const weekStart = new Date(startDate);
			weekStart.setDate(startDate.getDate() + i * 7);
			weeks.push(createMockWeek(weekStart));
		}
		return weeks;
	};

	const createWeekRowOptions = (): Omit<WeekRowOptions, 'week' | 'weekIndex'> => {
		return {
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
		};
	};

	it('renders calendar weeks', () => {
		const weeks = createMockWeeks();
		const weekRowOptions = createWeekRowOptions();
		const { container } = render(renderCalendarWeeks(weeks, weekRowOptions));

		const rowgroup = container.querySelector('[role="rowgroup"]');
		expect(rowgroup).toBeInTheDocument();
	});

	it('renders correct number of week rows', () => {
		const weeks = createMockWeeks();
		const weekRowOptions = createWeekRowOptions();
		const { container } = render(renderCalendarWeeks(weeks, weekRowOptions));

		const rows = container.querySelectorAll('[role="row"]');
		expect(rows.length).toBe(weeks.length);
	});

	it('renders with role="rowgroup"', () => {
		const weeks = createMockWeeks();
		const weekRowOptions = createWeekRowOptions();
		const { container } = render(renderCalendarWeeks(weeks, weekRowOptions));

		const rowgroup = container.querySelector('[role="rowgroup"]');
		expect(rowgroup).toBeInTheDocument();
	});

	it('passes week and weekIndex to renderWeekRow', () => {
		const weeks = createMockWeeks();
		const weekRowOptions = createWeekRowOptions();
		const { container } = render(renderCalendarWeeks(weeks, weekRowOptions));

		// Each week should render day cells
		const rows = container.querySelectorAll('[role="row"]');
		expect(rows.length).toBe(weeks.length);
	});

	it('handles empty weeks array', () => {
		const weeks: Date[][] = [];
		const weekRowOptions = createWeekRowOptions();
		const { container } = render(renderCalendarWeeks(weeks, weekRowOptions));

		const rowgroup = container.querySelector('[role="rowgroup"]');
		expect(rowgroup).toBeInTheDocument();
		const rows = container.querySelectorAll('[role="row"]');
		expect(rows.length).toBe(0);
	});

	it('passes all weekRowOptions to each week', () => {
		const weeks = createMockWeeks();
		const onDayClick = vi.fn();
		const weekRowOptions: Omit<WeekRowOptions, 'week' | 'weekIndex'> = {
			...createWeekRowOptions(),
			onDayClick,
			selectable: true,
			selectedDate: new Date(2024, 0, 15),
		};
		render(renderCalendarWeeks(weeks, weekRowOptions));

		// Verify structure is rendered (actual click handling tested in CalendarWeekRow tests)
		const rowgroup = screen.getByRole('rowgroup');
		expect(rowgroup).toBeInTheDocument();
	});

	it('handles showWeekNumbers option', () => {
		const weeks = createMockWeeks();
		const weekRowOptions = {
			...createWeekRowOptions(),
			showWeekNumbers: true,
		};
		const { container } = render(renderCalendarWeeks(weeks, weekRowOptions));

		// Each row should have week number cell
		const rows = container.querySelectorAll('[role="row"]');
		for (const row of rows) {
			// Week number cell should be present (first child)
			expect(row.children.length).toBeGreaterThan(7);
		}
	});

	it('handles events in weekRowOptions', () => {
		const weeks = createMockWeeks();
		const events = [
			{ id: '1', date: new Date(2024, 0, 15), title: 'Meeting' },
			{ id: '2', date: new Date(2024, 0, 20), title: 'Conference' },
		];
		const weekRowOptions = {
			...createWeekRowOptions(),
			events,
		};
		render(renderCalendarWeeks(weeks, weekRowOptions));

		const rowgroup = screen.getByRole('rowgroup');
		expect(rowgroup).toBeInTheDocument();
	});

	it('handles range selection options', () => {
		const weeks = createMockWeeks();
		const weekRowOptions = {
			...createWeekRowOptions(),
			rangeSelectable: true,
			rangeStart: new Date(2024, 0, 10),
			rangeEnd: new Date(2024, 0, 20),
		};
		render(renderCalendarWeeks(weeks, weekRowOptions));

		const rowgroup = screen.getByRole('rowgroup');
		expect(rowgroup).toBeInTheDocument();
	});
});
