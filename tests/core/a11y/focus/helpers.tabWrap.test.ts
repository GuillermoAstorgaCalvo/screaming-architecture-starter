/**
 * Tab Wrap Tests
 *
 * Tests for handleTabWrap and handleShiftTabWrap functions
 */

import { handleShiftTabWrap, handleTabWrap } from '@core/a11y/focus/helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('handleShiftTabWrap - focus wrapping behavior', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should wrap focus to last element when on first element', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		first.textContent = 'First';
		last.textContent = 'Last';
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: true,
		});

		const focusSpy = vi.spyOn(last, 'focus');

		handleShiftTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: first,
			event,
		});

		expect(focusSpy).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});

	it('should not wrap focus when not on first element', () => {
		const first = document.createElement('button');
		const middle = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(middle);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: true,
		});

		const focusSpy = vi.spyOn(last, 'focus');

		handleShiftTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: middle,
			event,
		});

		expect(focusSpy).not.toHaveBeenCalled();
	});
});

describe('handleShiftTabWrap - event cancellation', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should prevent default when event is cancelable', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: true,
		});

		handleShiftTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: first,
			event,
		});

		expect(event.defaultPrevented).toBe(true);
	});

	it('should handle non-cancelable event gracefully', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: false,
		});

		const focusSpy = vi.spyOn(last, 'focus');

		handleShiftTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: first,
			event,
		});

		expect(focusSpy).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});
});

describe('handleShiftTabWrap - active element position', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should not wrap when active element is last element', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: true,
		});

		const focusSpy = vi.spyOn(last, 'focus');

		handleShiftTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: last,
			event,
		});

		expect(focusSpy).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(false);
	});

	it('should handle same element for first and last', () => {
		const element = document.createElement('button');
		document.body.append(element);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			shiftKey: true,
			cancelable: true,
		});

		const focusSpy = vi.spyOn(element, 'focus');

		handleShiftTabWrap({
			firstElement: element,
			lastElement: element,
			activeElement: element,
			event,
		});

		// When first and last are the same, and active is that element,
		// it should wrap (focus itself)
		expect(focusSpy).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});
});

describe('handleTabWrap - focus wrapping behavior', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should wrap focus to first element when on last element', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		first.textContent = 'First';
		last.textContent = 'Last';
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			cancelable: true,
		});

		const focusSpy = vi.spyOn(first, 'focus');

		handleTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: last,
			event,
		});

		expect(focusSpy).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});

	it('should not wrap focus when not on last element', () => {
		const first = document.createElement('button');
		const middle = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(middle);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			cancelable: true,
		});

		const focusSpy = vi.spyOn(first, 'focus');

		handleTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: middle,
			event,
		});

		expect(focusSpy).not.toHaveBeenCalled();
	});
});

describe('handleTabWrap - event cancellation', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should prevent default when event is cancelable', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			cancelable: true,
		});

		handleTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: last,
			event,
		});

		expect(event.defaultPrevented).toBe(true);
	});

	it('should handle non-cancelable event gracefully', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			cancelable: false,
		});

		const focusSpy = vi.spyOn(first, 'focus');

		handleTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: last,
			event,
		});

		expect(focusSpy).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});
});

describe('handleTabWrap - active element position', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should not wrap when active element is first element', () => {
		const first = document.createElement('button');
		const last = document.createElement('button');
		document.body.append(first);
		document.body.append(last);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			cancelable: true,
		});

		const focusSpy = vi.spyOn(first, 'focus');

		handleTabWrap({
			firstElement: first,
			lastElement: last,
			activeElement: first,
			event,
		});

		expect(focusSpy).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(false);
	});

	it('should handle same element for first and last', () => {
		const element = document.createElement('button');
		document.body.append(element);

		const event = new KeyboardEvent('keydown', {
			key: 'Tab',
			cancelable: true,
		});

		const focusSpy = vi.spyOn(element, 'focus');

		handleTabWrap({
			firstElement: element,
			lastElement: element,
			activeElement: element,
			event,
		});

		expect(focusSpy).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});
});
