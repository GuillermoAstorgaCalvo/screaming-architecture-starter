/**
 * CalendarHandlers.single Tests
 *
 * Tests for single date selection handler including:
 * - handleSingleSelection
 * - buildSingleSelectionParams
 * - Selection toggling
 * - Callback invocation
 */

import {
	buildSingleSelectionParams,
	handleSingleSelection,
} from '@core/ui/calendar/handlers/CalendarHandlers.single';
import { describe, expect, it, vi } from 'vitest';

describe('CalendarHandlers.single - handleSingleSelection', () => {
	it('selects date when no date is selected', () => {
		const date = new Date(2024, 0, 15);
		const setInternalSelectedDate = vi.fn();
		const onDateSelect = vi.fn();

		handleSingleSelection({
			date,
			selectedDate: null,
			setInternalSelectedDate,
			onDateSelect,
		});

		expect(setInternalSelectedDate).toHaveBeenCalledWith(date);
		expect(onDateSelect).toHaveBeenCalledWith(date);
	});

	it('deselects date when same date is selected', () => {
		const date = new Date(2024, 0, 15);
		const setInternalSelectedDate = vi.fn();
		const onDateSelect = vi.fn();

		handleSingleSelection({
			date,
			selectedDate: date,
			setInternalSelectedDate,
			onDateSelect,
		});

		expect(setInternalSelectedDate).toHaveBeenCalledWith(null);
		expect(onDateSelect).toHaveBeenCalledWith(null);
	});

	it('selects new date when different date is selected', () => {
		const oldDate = new Date(2024, 0, 10);
		const newDate = new Date(2024, 0, 15);
		const setInternalSelectedDate = vi.fn();
		const onDateSelect = vi.fn();

		handleSingleSelection({
			date: newDate,
			selectedDate: oldDate,
			setInternalSelectedDate,
			onDateSelect,
		});

		expect(setInternalSelectedDate).toHaveBeenCalledWith(newDate);
		expect(onDateSelect).toHaveBeenCalledWith(newDate);
	});

	it('handles selection when onDateSelect is undefined', () => {
		const date = new Date(2024, 0, 15);
		const setInternalSelectedDate = vi.fn();

		expect(() => {
			handleSingleSelection({
				date,
				selectedDate: null,
				setInternalSelectedDate,
			});
		}).not.toThrow();

		expect(setInternalSelectedDate).toHaveBeenCalledWith(date);
	});

	it('compares dates by day, not time', () => {
		const date1 = new Date(2024, 0, 15, 10, 30);
		const date2 = new Date(2024, 0, 15, 14, 45);
		const setInternalSelectedDate = vi.fn();
		const onDateSelect = vi.fn();

		handleSingleSelection({
			date: date1,
			selectedDate: date2,
			setInternalSelectedDate,
			onDateSelect,
		});

		// Should deselect since it's the same day
		expect(setInternalSelectedDate).toHaveBeenCalledWith(null);
		expect(onDateSelect).toHaveBeenCalledWith(null);
	});

	it('handles different days correctly', () => {
		const date1 = new Date(2024, 0, 15);
		const date2 = new Date(2024, 0, 16);
		const setInternalSelectedDate = vi.fn();
		const onDateSelect = vi.fn();

		handleSingleSelection({
			date: date2,
			selectedDate: date1,
			setInternalSelectedDate,
			onDateSelect,
		});

		expect(setInternalSelectedDate).toHaveBeenCalledWith(date2);
		expect(onDateSelect).toHaveBeenCalledWith(date2);
	});

	it('handles different months correctly', () => {
		const date1 = new Date(2024, 0, 15);
		const date2 = new Date(2024, 1, 15);
		const setInternalSelectedDate = vi.fn();
		const onDateSelect = vi.fn();

		handleSingleSelection({
			date: date2,
			selectedDate: date1,
			setInternalSelectedDate,
			onDateSelect,
		});

		expect(setInternalSelectedDate).toHaveBeenCalledWith(date2);
		expect(onDateSelect).toHaveBeenCalledWith(date2);
	});

	it('handles different years correctly', () => {
		const date1 = new Date(2024, 0, 15);
		const date2 = new Date(2025, 0, 15);
		const setInternalSelectedDate = vi.fn();
		const onDateSelect = vi.fn();

		handleSingleSelection({
			date: date2,
			selectedDate: date1,
			setInternalSelectedDate,
			onDateSelect,
		});

		expect(setInternalSelectedDate).toHaveBeenCalledWith(date2);
		expect(onDateSelect).toHaveBeenCalledWith(date2);
	});
});

describe('CalendarHandlers.single - buildSingleSelectionParams', () => {
	it('builds params with all required properties', () => {
		const date = new Date(2024, 0, 15);
		const selectedDate = null;
		const setInternalSelectedDate = vi.fn();
		const onDateSelect = vi.fn();

		const params = buildSingleSelectionParams({
			date,
			selectedDate,
			setInternalSelectedDate,
			onDateSelect,
		});

		expect(params.date).toBe(date);
		expect(params.selectedDate).toBe(selectedDate);
		expect(params.setInternalSelectedDate).toBe(setInternalSelectedDate);
		expect(params.onDateSelect).toBe(onDateSelect);
	});

	it('includes onDateSelect when provided', () => {
		const date = new Date(2024, 0, 15);
		const onDateSelect = vi.fn();

		const params = buildSingleSelectionParams({
			date,
			selectedDate: null,
			setInternalSelectedDate: vi.fn(),
			onDateSelect,
		});

		expect(params.onDateSelect).toBe(onDateSelect);
	});

	it('excludes onDateSelect when undefined', () => {
		const date = new Date(2024, 0, 15);

		const params = buildSingleSelectionParams({
			date,
			selectedDate: null,
			setInternalSelectedDate: vi.fn(),
		});

		expect(params.onDateSelect).toBeUndefined();
	});

	it('preserves all input values', () => {
		const date = new Date(2024, 0, 15);
		const selectedDate = new Date(2024, 0, 10);
		const setInternalSelectedDate = vi.fn();
		const onDateSelect = vi.fn();

		const params = buildSingleSelectionParams({
			date,
			selectedDate,
			setInternalSelectedDate,
			onDateSelect,
		});

		expect(params.date).toBe(date);
		expect(params.selectedDate).toBe(selectedDate);
		expect(params.setInternalSelectedDate).toBe(setInternalSelectedDate);
	});

	it('returns params that can be used with handleSingleSelection', () => {
		const date = new Date(2024, 0, 15);
		const setInternalSelectedDate = vi.fn();
		const onDateSelect = vi.fn();

		const params = buildSingleSelectionParams({
			date,
			selectedDate: null,
			setInternalSelectedDate,
			onDateSelect,
		});

		expect(() => {
			handleSingleSelection(params);
		}).not.toThrow();

		expect(setInternalSelectedDate).toHaveBeenCalledWith(date);
		expect(onDateSelect).toHaveBeenCalledWith(date);
	});

	it('handles null selectedDate', () => {
		const date = new Date(2024, 0, 15);
		const params = buildSingleSelectionParams({
			date,
			selectedDate: null,
			setInternalSelectedDate: vi.fn(),
		});

		expect(params.selectedDate).toBeNull();
	});

	it('handles Date selectedDate', () => {
		const date = new Date(2024, 0, 15);
		const selectedDate = new Date(2024, 0, 10);
		const params = buildSingleSelectionParams({
			date,
			selectedDate,
			setInternalSelectedDate: vi.fn(),
		});

		expect(params.selectedDate).toBe(selectedDate);
	});
});
