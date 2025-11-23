/**
 * CalendarDayHelpers Tests
 *
 * Tests for calendar day helper functions including:
 * - Aria label generation
 * - Button props creation
 * - Event handlers creation
 * - Day props creation
 */

import {
	createDayButtonProps,
	createDayHandlers,
	createDayProps,
	getDayAriaLabel,
} from '@core/ui/calendar/helpers/CalendarDayHelpers';
import type { CalendarEvent } from '@src-types/ui/data/calendar';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('CalendarDayHelpers - getDayAriaLabel', () => {
	it('returns formatted date string', () => {
		const date = new Date(2024, 0, 15);
		const label = getDayAriaLabel(date, false);
		expect(label).toContain('2024');
	});

	it('includes "today" when isToday is true', () => {
		const date = new Date(2024, 0, 15);
		const label = getDayAriaLabel(date, true);
		expect(label.toLowerCase()).toContain('today');
	});

	it('does not include "today" when isToday is false', () => {
		const date = new Date(2024, 0, 15);
		const label = getDayAriaLabel(date, false);
		expect(label.toLowerCase()).not.toContain('today');
	});

	it('includes event count for single event', () => {
		const date = new Date(2024, 0, 15);
		const events: CalendarEvent[] = [{ id: '1', date, title: 'Meeting' }];
		const label = getDayAriaLabel(date, false, events);
		expect(label).toContain('1');
		expect(label).toContain('event');
	});

	it('includes event count for multiple events', () => {
		const date = new Date(2024, 0, 15);
		const events: CalendarEvent[] = [
			{ id: '1', date, title: 'Meeting 1' },
			{ id: '2', date, title: 'Meeting 2' },
			{ id: '3', date, title: 'Meeting 3' },
		];
		const label = getDayAriaLabel(date, false, events);
		expect(label).toContain('3');
		expect(label).toContain('events');
	});

	it('handles empty events array', () => {
		const date = new Date(2024, 0, 15);
		const label = getDayAriaLabel(date, false, []);
		expect(label).not.toContain('event');
	});

	it('handles undefined events', () => {
		const date = new Date(2024, 0, 15);
		const label = getDayAriaLabel(date, false);
		expect(label).not.toContain('event');
	});

	it('combines all information correctly', () => {
		const date = new Date(2024, 0, 15);
		const events: CalendarEvent[] = [
			{ id: '1', date, title: 'Meeting' },
			{ id: '2', date, title: 'Conference' },
		];
		const label = getDayAriaLabel(date, true, events);
		expect(label.toLowerCase()).toContain('today');
		expect(label).toContain('2');
		expect(label).toContain('events');
	});
});

describe('CalendarDayHelpers - createDayButtonProps', () => {
	it('creates button props with all required properties', () => {
		const props = createDayButtonProps({
			dayClasses: 'day-class',
			ariaLabel: 'January 15, 2024',
			isSelected: false,
			disabled: false,
			onClick: vi.fn(),
			onKeyDown: vi.fn(),
		});

		expect(props.type).toBe('button');
		expect(props.className).toBe('day-class');
		expect(props['aria-label']).toBe('January 15, 2024');
		expect(props['aria-selected']).toBe(false);
		expect(props.disabled).toBe(false);
		expect(props.tabIndex).toBe(0);
		expect(props.role).toBe('gridcell');
		expect(typeof props.onClick).toBe('function');
		expect(typeof props.onKeyDown).toBe('function');
	});

	it('sets aria-selected to true when isSelected is true', () => {
		const props = createDayButtonProps({
			dayClasses: 'day-class',
			ariaLabel: 'January 15, 2024',
			isSelected: true,
			disabled: false,
			onClick: vi.fn(),
			onKeyDown: vi.fn(),
		});

		expect(props['aria-selected']).toBe(true);
	});

	it('sets disabled to true and tabIndex to -1 when disabled is true', () => {
		const props = createDayButtonProps({
			dayClasses: 'day-class',
			ariaLabel: 'January 15, 2024',
			isSelected: false,
			disabled: true,
			onClick: vi.fn(),
			onKeyDown: vi.fn(),
		});

		expect(props.disabled).toBe(true);
		expect(props.tabIndex).toBe(-1);
	});

	it('sets tabIndex to 0 when disabled is false', () => {
		const props = createDayButtonProps({
			dayClasses: 'day-class',
			ariaLabel: 'January 15, 2024',
			isSelected: false,
			disabled: false,
			onClick: vi.fn(),
			onKeyDown: vi.fn(),
		});

		expect(props.tabIndex).toBe(0);
	});
});

describe('CalendarDayHelpers - createDayHandlers', () => {
	it('creates handlers object with handleClick and handleKeyDown', () => {
		const date = new Date(2024, 0, 15);
		const handlers = createDayHandlers(date, false);

		expect(handlers).toHaveProperty('handleClick');
		expect(handlers).toHaveProperty('handleKeyDown');
		expect(typeof handlers.handleClick).toBe('function');
		expect(typeof handlers.handleKeyDown).toBe('function');
	});

	it('calls onClick when handleClick is called and not disabled', () => {
		const date = new Date(2024, 0, 15);
		const onClick = vi.fn();
		const handlers = createDayHandlers(date, false, onClick);

		handlers.handleClick();

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(date);
	});

	it('does not call onClick when disabled', () => {
		const date = new Date(2024, 0, 15);
		const onClick = vi.fn();
		const handlers = createDayHandlers(date, true, onClick);

		handlers.handleClick();

		expect(onClick).not.toHaveBeenCalled();
	});

	it('does not call onClick when onClick is undefined', () => {
		const date = new Date(2024, 0, 15);
		const handlers = createDayHandlers(date, false);

		expect(() => handlers.handleClick()).not.toThrow();
	});

	it('calls onClick when Enter key is pressed', () => {
		const date = new Date(2024, 0, 15);
		const onClick = vi.fn();
		const handlers = createDayHandlers(date, false, onClick);
		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<Element>;

		handlers.handleKeyDown(event);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(date);
		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('calls onClick when Space key is pressed', () => {
		const date = new Date(2024, 0, 15);
		const onClick = vi.fn();
		const handlers = createDayHandlers(date, false, onClick);
		const event = {
			key: ' ',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<Element>;

		handlers.handleKeyDown(event);

		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith(date);
		expect(event.preventDefault).toHaveBeenCalled();
	});

	it('does not call onClick for other keys', () => {
		const date = new Date(2024, 0, 15);
		const onClick = vi.fn();
		const handlers = createDayHandlers(date, false, onClick);
		const event = {
			key: 'ArrowRight',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<Element>;

		handlers.handleKeyDown(event);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('does not call onClick when disabled and Enter is pressed', () => {
		const date = new Date(2024, 0, 15);
		const onClick = vi.fn();
		const handlers = createDayHandlers(date, true, onClick);
		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<Element>;

		handlers.handleKeyDown(event);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('does not call onClick when disabled and Space is pressed', () => {
		const date = new Date(2024, 0, 15);
		const onClick = vi.fn();
		const handlers = createDayHandlers(date, true, onClick);
		const event = {
			key: ' ',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<Element>;

		handlers.handleKeyDown(event);

		expect(onClick).not.toHaveBeenCalled();
	});

	it('does not prevent default for non-action keys', () => {
		const date = new Date(2024, 0, 15);
		const onClick = vi.fn();
		const handlers = createDayHandlers(date, false, onClick);
		const event = {
			key: 'ArrowRight',
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent<Element>;

		handlers.handleKeyDown(event);

		expect(event.preventDefault).not.toHaveBeenCalled();
	});
});

describe('CalendarDayHelpers - createDayProps', () => {
	it('creates day props with required properties', () => {
		const date = new Date(2024, 0, 15);
		const props = createDayProps({
			date,
			isCurrentMonth: true,
			isToday: false,
		});

		expect(props.date).toBe(date);
		expect(props.isCurrentMonth).toBe(true);
		expect(props.isToday).toBe(false);
	});

	it('includes optional properties when provided', () => {
		const date = new Date(2024, 0, 15);
		const events: CalendarEvent[] = [{ id: '1', date, title: 'Meeting' }];
		const onClick = vi.fn();
		const props = createDayProps({
			date,
			isCurrentMonth: true,
			isToday: false,
			isSelected: true,
			isInRange: true,
			isRangeStart: true,
			isRangeEnd: false,
			events,
			disabled: false,
			onClick,
		});

		expect(props.isSelected).toBe(true);
		expect(props.isInRange).toBe(true);
		expect(props.isRangeStart).toBe(true);
		expect(props.isRangeEnd).toBe(false);
		expect(props.events).toBe(events);
		expect(props.disabled).toBe(false);
		expect(props.onClick).toBe(onClick);
	});

	it('excludes optional properties when undefined', () => {
		const date = new Date(2024, 0, 15);
		const props = createDayProps({
			date,
			isCurrentMonth: true,
			isToday: false,
		});

		expect(props).not.toHaveProperty('isSelected');
		expect(props).not.toHaveProperty('events');
		expect(props).not.toHaveProperty('disabled');
		expect(props).not.toHaveProperty('onClick');
	});

	it('handles renderDay function', () => {
		const date = new Date(2024, 0, 15);
		const renderDay = vi.fn();
		const props = createDayProps({
			date,
			isCurrentMonth: true,
			isToday: false,
			renderDay,
		});

		expect(props.renderDay).toBe(renderDay);
	});

	it('handles weekdayNames and showWeekNumber (ignored in output)', () => {
		const date = new Date(2024, 0, 15);
		const props = createDayProps({
			date,
			isCurrentMonth: true,
			isToday: false,
			weekdayNames: ['Sun', 'Mon', 'Tue'],
			showWeekNumber: true,
			weekNumber: 5,
		});

		expect(props.date).toBe(date);
		expect(props.isCurrentMonth).toBe(true);
		expect(props.isToday).toBe(false);
		// These properties should not be in the output
		expect(props).not.toHaveProperty('weekdayNames');
		expect(props).not.toHaveProperty('showWeekNumber');
		expect(props).not.toHaveProperty('weekNumber');
	});

	it('handles partial optional properties', () => {
		const date = new Date(2024, 0, 15);
		const props = createDayProps({
			date,
			isCurrentMonth: true,
			isToday: false,
			isSelected: true,
		});

		expect(props.isSelected).toBe(true);
		expect(props).not.toHaveProperty('isInRange');
		expect(props).not.toHaveProperty('events');
	});
});
