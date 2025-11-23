/**
 * SwitchHandlers Tests
 *
 * Tests for switch handler helper functions:
 * - lockInputCheckedProperty
 * - createDisabledChangeHandler
 * - createDisabledMouseHandler
 * - createDisabledLabelHandlers
 * - buildSwitchHandlers
 */

import {
	buildSwitchHandlers,
	createDisabledChangeHandler,
	createDisabledLabelHandlers,
	createDisabledMouseHandler,
	lockInputCheckedProperty,
} from '@core/ui/forms/switch/helpers/SwitchHandlers';
import type { ChangeEvent, MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('lockInputCheckedProperty', () => {
	it('should be a function', () => {
		expect(typeof lockInputCheckedProperty).toBe('function');
	});

	it('should lock the checked property to the value returned by getLockedValue', () => {
		const input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = false;

		const getLockedValue = vi.fn(() => true);
		lockInputCheckedProperty(input, getLockedValue);

		// Try to set checked to false
		input.checked = false;
		expect(input.checked).toBe(true);
		expect(getLockedValue).toHaveBeenCalled();
	});

	it('should lock the checked property to false when getLockedValue returns false', () => {
		const input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = true;

		const getLockedValue = vi.fn(() => false);
		lockInputCheckedProperty(input, getLockedValue);

		// Try to set checked to true
		input.checked = true;
		expect(input.checked).toBe(false);
	});

	it('should call getLockedValue when checked property is accessed', () => {
		const input = document.createElement('input');
		input.type = 'checkbox';

		const getLockedValue = vi.fn(() => true);
		lockInputCheckedProperty(input, getLockedValue);

		// Access the checked property
		const { checked } = input;
		expect(checked).toBe(true);
		expect(getLockedValue).toHaveBeenCalled();
	});

	it('should handle elements without setter descriptor gracefully', () => {
		const input = document.createElement('input');
		input.type = 'checkbox';

		// Create a mock element without a setter
		const mockElement = Object.create(null);
		Object.defineProperty(mockElement, 'checked', {
			get: () => false,
			configurable: true,
		});

		// Should not throw
		expect(() => {
			lockInputCheckedProperty(mockElement as HTMLInputElement, () => true);
		}).not.toThrow();
	});
});

describe('createDisabledChangeHandler', () => {
	it('should be a function', () => {
		expect(typeof createDisabledChangeHandler).toBe('function');
	});

	it('should prevent default and stop propagation', () => {
		const getLockedChecked = vi.fn(() => false);
		const handler = createDisabledChangeHandler(getLockedChecked);

		const input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = false;

		const event = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			currentTarget: input,
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(event.stopPropagation).toHaveBeenCalled();
	});

	it('should reset checked to locked value when different', () => {
		const getLockedChecked = vi.fn(() => true);
		const handler = createDisabledChangeHandler(getLockedChecked);

		const input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = false;

		const event = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			currentTarget: input,
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		expect(input.checked).toBe(true);
		expect(getLockedChecked).toHaveBeenCalled();
	});

	it('should not change checked when already matches locked value', () => {
		const getLockedChecked = vi.fn(() => false);
		const handler = createDisabledChangeHandler(getLockedChecked);

		const input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = false;

		const event = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			currentTarget: input,
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		expect(input.checked).toBe(false);
		expect(getLockedChecked).toHaveBeenCalled();
	});
});

describe('createDisabledMouseHandler', () => {
	it('should be a function', () => {
		expect(typeof createDisabledMouseHandler).toBe('function');
	});

	it('should prevent default and stop propagation', () => {
		const getLockedChecked = vi.fn(() => false);
		const handler = createDisabledMouseHandler(getLockedChecked);

		const input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = false;

		const event = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			currentTarget: input,
		} as unknown as MouseEvent<HTMLInputElement>;

		handler(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(event.stopPropagation).toHaveBeenCalled();
	});

	it('should reset checked to locked value when different', () => {
		const getLockedChecked = vi.fn(() => true);
		const handler = createDisabledMouseHandler(getLockedChecked);

		const input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = false;

		const event = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			currentTarget: input,
		} as unknown as MouseEvent<HTMLInputElement>;

		handler(event);

		expect(input.checked).toBe(true);
		expect(getLockedChecked).toHaveBeenCalled();
	});

	it('should not change checked when already matches locked value', () => {
		const getLockedChecked = vi.fn(() => false);
		const handler = createDisabledMouseHandler(getLockedChecked);

		const input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = false;

		const event = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			currentTarget: input,
		} as unknown as MouseEvent<HTMLInputElement>;

		handler(event);

		expect(input.checked).toBe(false);
		expect(getLockedChecked).toHaveBeenCalled();
	});
});

describe('createDisabledLabelHandlers', () => {
	it('should be a function', () => {
		expect(typeof createDisabledLabelHandlers).toBe('function');
	});

	it('should return handlers object with onMouseDown and onClick', () => {
		const handlers = createDisabledLabelHandlers();

		expect(handlers).toHaveProperty('onMouseDown');
		expect(handlers).toHaveProperty('onClick');
		expect(typeof handlers.onMouseDown).toBe('function');
		expect(typeof handlers.onClick).toBe('function');
	});

	it('should prevent default and stop propagation on onMouseDown', () => {
		const handlers = createDisabledLabelHandlers();

		const event = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as MouseEvent<HTMLLabelElement>;

		handlers.onMouseDown(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(event.stopPropagation).toHaveBeenCalled();
	});

	it('should prevent default and stop propagation on onClick', () => {
		const handlers = createDisabledLabelHandlers();

		const event = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
		} as unknown as MouseEvent<HTMLLabelElement>;

		handlers.onClick(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(event.stopPropagation).toHaveBeenCalled();
	});
});

describe('buildSwitchHandlers', () => {
	it('should be a function', () => {
		expect(typeof buildSwitchHandlers).toBe('function');
	});

	it('should return disabled handlers when disabled is true', () => {
		const getLockedChecked = vi.fn(() => false);
		const inputProps = {
			onChange: vi.fn(),
			onClick: vi.fn(),
			onMouseDown: vi.fn(),
		};

		const handlers = buildSwitchHandlers({
			disabled: true,
			getLockedChecked,
			inputProps,
		});

		expect(handlers.onChange).toBeDefined();
		expect(handlers.onClick).toBeDefined();
		expect(handlers.onMouseDown).toBeDefined();
		expect(handlers.labelProps).toHaveProperty('onMouseDown');
		expect(handlers.labelProps).toHaveProperty('onClick');

		// Verify disabled handlers are different from input props
		expect(handlers.onChange).not.toBe(inputProps.onChange);
		expect(handlers.onClick).not.toBe(inputProps.onClick);
		expect(handlers.onMouseDown).not.toBe(inputProps.onMouseDown);
	});

	it('should return input props handlers when disabled is false', () => {
		const getLockedChecked = vi.fn(() => false);
		const inputProps = {
			onChange: vi.fn(),
			onClick: vi.fn(),
			onMouseDown: vi.fn(),
		};

		const handlers = buildSwitchHandlers({
			disabled: false,
			getLockedChecked,
			inputProps,
		});

		expect(handlers.onChange).toBe(inputProps.onChange);
		expect(handlers.onClick).toBe(inputProps.onClick);
		expect(handlers.onMouseDown).toBe(inputProps.onMouseDown);
		expect(handlers.labelProps).toEqual({});
	});

	it('should return input props handlers when disabled is undefined', () => {
		const getLockedChecked = vi.fn(() => false);
		const inputProps = {
			onChange: vi.fn(),
			onClick: vi.fn(),
			onMouseDown: vi.fn(),
		};

		const handlers = buildSwitchHandlers({
			disabled: undefined,
			getLockedChecked,
			inputProps,
		});

		expect(handlers.onChange).toBe(inputProps.onChange);
		expect(handlers.onClick).toBe(inputProps.onClick);
		expect(handlers.onMouseDown).toBe(inputProps.onMouseDown);
		expect(handlers.labelProps).toEqual({});
	});

	it('should create working disabled change handler', () => {
		const getLockedChecked = vi.fn(() => true);
		const inputProps = {
			onChange: vi.fn(),
			onClick: vi.fn(),
			onMouseDown: vi.fn(),
		};

		const handlers = buildSwitchHandlers({
			disabled: true,
			getLockedChecked,
			inputProps,
		});

		const input = document.createElement('input');
		input.type = 'checkbox';
		input.checked = false;

		const event = {
			preventDefault: vi.fn(),
			stopPropagation: vi.fn(),
			currentTarget: input,
		} as unknown as ChangeEvent<HTMLInputElement>;

		handlers.onChange?.(event);

		expect(event.preventDefault).toHaveBeenCalled();
		expect(input.checked).toBe(true);
	});
});
