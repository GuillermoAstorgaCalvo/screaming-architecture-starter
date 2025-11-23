/**
 * useRangeSliderState.helpers Tests
 *
 * Tests for RangeSlider state helper functions including:
 * - Change handler creation
 * - Handler composition
 * - State building
 */

import {
	buildRangeSliderStateReturn,
	createMaxChangeHandler,
	createMinChangeHandler,
	useRangeChangeHandlers,
	useRangeHandlers,
} from '@core/ui/forms/range-slider/helpers/useRangeSliderState.helpers';
import type {
	UseRangeCalculationsReturn,
	UseRangeValueReturn,
} from '@core/ui/forms/range-slider/hooks/useRangeSliderState.hooks';
import type { ChangeEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createMockValueState = (overrides?: Partial<UseRangeValueReturn>): UseRangeValueReturn => ({
	isControlled: false,
	safeMinValue: 20,
	safeMaxValue: 80,
	setInternalValue: vi.fn(),
	...overrides,
});

const createMockCalculations = (
	overrides?: Partial<UseRangeCalculationsReturn>
): UseRangeCalculationsReturn => ({
	minPercentage: 20,
	maxPercentage: 80,
	minThumbOffset: '50%',
	maxThumbOffset: '50%',
	activeTrackLeft: 20,
	activeTrackWidth: 60,
	...overrides,
});

describe('createMinChangeHandler', () => {
	it('creates handler that clamps min value', () => {
		const setInternalValue = vi.fn();
		const onChange = vi.fn();
		const handler = createMinChangeHandler({
			isControlled: false,
			safeMaxValue: 80,
			min: 0,
			setInternalValue,
			onChange,
		});

		const event = {
			target: { value: '90' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		// Min should be clamped to max (80)
		expect(setInternalValue).toHaveBeenCalledWith([80, 80]);
		expect(onChange).toHaveBeenCalledWith([80, 80]);
	});

	it('creates handler that clamps to min boundary', () => {
		const setInternalValue = vi.fn();
		const onChange = vi.fn();
		const handler = createMinChangeHandler({
			isControlled: false,
			safeMaxValue: 80,
			min: 10,
			setInternalValue,
			onChange,
		});

		const event = {
			target: { value: '5' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		// Min should be clamped to min boundary (10)
		expect(setInternalValue).toHaveBeenCalledWith([10, 80]);
		expect(onChange).toHaveBeenCalledWith([10, 80]);
	});

	it('calls onChange in controlled mode', () => {
		const onChange = vi.fn();
		const handler = createMinChangeHandler({
			isControlled: true,
			safeMaxValue: 80,
			min: 0,
			setInternalValue: vi.fn(),
			onChange,
		});

		const event = {
			target: { value: '30' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		expect(onChange).toHaveBeenCalledWith([30, 80]);
	});

	it('calls setInternalValue and onChange in uncontrolled mode', () => {
		const setInternalValue = vi.fn();
		const onChange = vi.fn();
		const handler = createMinChangeHandler({
			isControlled: false,
			safeMaxValue: 80,
			min: 0,
			setInternalValue,
			onChange,
		});

		const event = {
			target: { value: '30' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		expect(setInternalValue).toHaveBeenCalledWith([30, 80]);
		expect(onChange).toHaveBeenCalledWith([30, 80]);
	});

	it('handles undefined onChange', () => {
		const setInternalValue = vi.fn();
		const handler = createMinChangeHandler({
			isControlled: false,
			safeMaxValue: 80,
			min: 0,
			setInternalValue,
			onChange: undefined,
		});

		const event = {
			target: { value: '30' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		expect(() => handler(event)).not.toThrow();
		expect(setInternalValue).toHaveBeenCalledWith([30, 80]);
	});
});

describe('createMaxChangeHandler', () => {
	it('creates handler that clamps max value', () => {
		const setInternalValue = vi.fn();
		const onChange = vi.fn();
		const handler = createMaxChangeHandler({
			isControlled: false,
			safeMinValue: 20,
			max: 100,
			setInternalValue,
			onChange,
		});

		const event = {
			target: { value: '10' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		// Max should be clamped to min (20)
		expect(setInternalValue).toHaveBeenCalledWith([20, 20]);
		expect(onChange).toHaveBeenCalledWith([20, 20]);
	});

	it('creates handler that clamps to max boundary', () => {
		const setInternalValue = vi.fn();
		const onChange = vi.fn();
		const handler = createMaxChangeHandler({
			isControlled: false,
			safeMinValue: 20,
			max: 90,
			setInternalValue,
			onChange,
		});

		const event = {
			target: { value: '100' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		// Max should be clamped to max boundary (90)
		expect(setInternalValue).toHaveBeenCalledWith([20, 90]);
		expect(onChange).toHaveBeenCalledWith([20, 90]);
	});

	it('calls onChange in controlled mode', () => {
		const onChange = vi.fn();
		const handler = createMaxChangeHandler({
			isControlled: true,
			safeMinValue: 20,
			max: 100,
			setInternalValue: vi.fn(),
			onChange,
		});

		const event = {
			target: { value: '90' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		expect(onChange).toHaveBeenCalledWith([20, 90]);
	});

	it('calls setInternalValue and onChange in uncontrolled mode', () => {
		const setInternalValue = vi.fn();
		const onChange = vi.fn();
		const handler = createMaxChangeHandler({
			isControlled: false,
			safeMinValue: 20,
			max: 100,
			setInternalValue,
			onChange,
		});

		const event = {
			target: { value: '90' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		handler(event);

		expect(setInternalValue).toHaveBeenCalledWith([20, 90]);
		expect(onChange).toHaveBeenCalledWith([20, 90]);
	});

	it('handles undefined onChange', () => {
		const setInternalValue = vi.fn();
		const handler = createMaxChangeHandler({
			isControlled: false,
			safeMinValue: 20,
			max: 100,
			setInternalValue,
			onChange: undefined,
		});

		const event = {
			target: { value: '90' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		expect(() => handler(event)).not.toThrow();
		expect(setInternalValue).toHaveBeenCalledWith([20, 90]);
	});
});

describe('useRangeChangeHandlers', () => {
	it('returns both min and max change handlers', () => {
		const setInternalValue = vi.fn();
		const onChange = vi.fn();

		const handlers = useRangeChangeHandlers({
			isControlled: false,
			safeMinValue: 20,
			safeMaxValue: 80,
			min: 0,
			max: 100,
			setInternalValue,
			onChange,
		});

		expect(handlers.handleMinChange).toBeDefined();
		expect(handlers.handleMaxChange).toBeDefined();
		expect(typeof handlers.handleMinChange).toBe('function');
		expect(typeof handlers.handleMaxChange).toBe('function');
	});

	it('creates handlers with correct parameters', () => {
		const setInternalValue = vi.fn();
		const onChange = vi.fn();

		const handlers = useRangeChangeHandlers({
			isControlled: false,
			safeMinValue: 20,
			safeMaxValue: 80,
			min: 0,
			max: 100,
			setInternalValue,
			onChange,
		});

		const minEvent = {
			target: { value: '30' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		const maxEvent = {
			target: { value: '90' },
		} as unknown as ChangeEvent<HTMLInputElement>;

		handlers.handleMinChange(minEvent);
		expect(setInternalValue).toHaveBeenCalledWith([30, 80]);
		expect(onChange).toHaveBeenCalledWith([30, 80]);

		handlers.handleMaxChange(maxEvent);
		expect(setInternalValue).toHaveBeenCalledWith([20, 90]);
		expect(onChange).toHaveBeenCalledWith([20, 90]);
	});
});

describe('useRangeHandlers', () => {
	it('returns handlers from useRangeChangeHandlers', () => {
		const setInternalValue = vi.fn();
		const onChange = vi.fn();

		const handlers = useRangeHandlers({
			isControlled: false,
			safeMinValue: 20,
			safeMaxValue: 80,
			min: 0,
			max: 100,
			setInternalValue,
			onChange,
		});

		expect(handlers.handleMinChange).toBeDefined();
		expect(handlers.handleMaxChange).toBeDefined();
	});
});

describe('buildRangeSliderStateReturn', () => {
	it('builds complete state return object', () => {
		const valueState = createMockValueState();
		const calculations = createMockCalculations();
		const handlers = {
			handleMinChange: vi.fn(),
			handleMaxChange: vi.fn(),
		};
		const minInputRef = { current: null };
		const maxInputRef = { current: null };

		const result = buildRangeSliderStateReturn({
			valueState,
			calculations,
			handlers,
			minInputRef,
			maxInputRef,
		});

		expect(result.safeMinValue).toBe(20);
		expect(result.safeMaxValue).toBe(80);
		expect(result.minPercentage).toBe(20);
		expect(result.maxPercentage).toBe(80);
		expect(result.minThumbOffset).toBe('50%');
		expect(result.maxThumbOffset).toBe('50%');
		expect(result.activeTrackLeft).toBe(20);
		expect(result.activeTrackWidth).toBe(60);
		expect(result.handleMinChange).toBe(handlers.handleMinChange);
		expect(result.handleMaxChange).toBe(handlers.handleMaxChange);
		expect(result.minInputRef).toBe(minInputRef);
		expect(result.maxInputRef).toBe(maxInputRef);
	});

	it('includes all required properties', () => {
		const valueState = createMockValueState();
		const calculations = createMockCalculations();
		const handlers = {
			handleMinChange: vi.fn(),
			handleMaxChange: vi.fn(),
		};
		const minInputRef = { current: null };
		const maxInputRef = { current: null };

		const result = buildRangeSliderStateReturn({
			valueState,
			calculations,
			handlers,
			minInputRef,
			maxInputRef,
		});

		expect(result).toHaveProperty('safeMinValue');
		expect(result).toHaveProperty('safeMaxValue');
		expect(result).toHaveProperty('minPercentage');
		expect(result).toHaveProperty('maxPercentage');
		expect(result).toHaveProperty('minThumbOffset');
		expect(result).toHaveProperty('maxThumbOffset');
		expect(result).toHaveProperty('activeTrackLeft');
		expect(result).toHaveProperty('activeTrackWidth');
		expect(result).toHaveProperty('handleMinChange');
		expect(result).toHaveProperty('handleMaxChange');
		expect(result).toHaveProperty('minInputRef');
		expect(result).toHaveProperty('maxInputRef');
	});
});
