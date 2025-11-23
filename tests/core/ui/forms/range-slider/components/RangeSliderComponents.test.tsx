/**
 * RangeSliderComponents Tests
 *
 * Tests for RangeSlider component elements including:
 * - ActiveTrack rendering
 * - RangeThumb rendering
 * - RangeInputElement rendering
 * - RangeSliderElements composition
 */

import {
	ActiveTrack,
	RangeInputElement,
	RangeSliderElements,
	RangeThumb,
} from '@core/ui/forms/range-slider/components/RangeSliderComponents';
import type { UseRangeSliderStateReturn } from '@core/ui/forms/range-slider/hooks/useRangeSliderState';
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createMockState = (
	overrides?: Partial<UseRangeSliderStateReturn>
): UseRangeSliderStateReturn => ({
	safeMinValue: 20,
	safeMaxValue: 80,
	minPercentage: 20,
	maxPercentage: 80,
	minThumbOffset: '50%',
	maxThumbOffset: '50%',
	activeTrackLeft: 20,
	activeTrackWidth: 60,
	handleMinChange: vi.fn(),
	handleMaxChange: vi.fn(),
	minInputRef: createRef<HTMLInputElement | null>(),
	maxInputRef: createRef<HTMLInputElement | null>(),
	...overrides,
});

describe('ActiveTrack', () => {
	it('renders active track with correct styles', () => {
		render(<ActiveTrack left={20} width={60} />);

		const track = document.querySelector('.bg-primary');
		expect(track).toBeInTheDocument();
		expect(track).toHaveStyle({ left: '20%', width: '60%' });
	});

	it('has aria-hidden attribute', () => {
		render(<ActiveTrack left={0} width={100} />);

		const track = document.querySelector('.bg-primary');
		expect(track).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders with different positions', () => {
		const { rerender } = render(<ActiveTrack left={10} width={30} />);

		let track = document.querySelector('.bg-primary');
		expect(track).toHaveStyle({ left: '10%', width: '30%' });

		rerender(<ActiveTrack left={50} width={25} />);
		track = document.querySelector('.bg-primary');
		expect(track).toHaveStyle({ left: '50%', width: '25%' });
	});
});

describe('RangeThumb', () => {
	it('renders thumb with correct position', () => {
		render(<RangeThumb percentage={50} offset="50%" thumbClasses="test-thumb" />);

		const thumb = document.querySelector('.test-thumb');
		expect(thumb).toBeInTheDocument();
		expect(thumb).toHaveStyle({ left: 'calc(50% - 50%)' });
	});

	it('has aria-hidden attribute', () => {
		render(<RangeThumb percentage={25} offset="50%" thumbClasses="test-thumb" />);

		const thumb = document.querySelector('.test-thumb');
		expect(thumb).toHaveAttribute('aria-hidden', 'true');
	});

	it('renders with different percentages', () => {
		const { rerender } = render(
			<RangeThumb percentage={0} offset="0px" thumbClasses="test-thumb" />
		);

		let thumb = document.querySelector('.test-thumb');
		expect(thumb).toHaveStyle({ left: 'calc(0% - 0px)' });

		rerender(<RangeThumb percentage={100} offset="100%" thumbClasses="test-thumb" />);
		thumb = document.querySelector('.test-thumb');
		expect(thumb).toHaveStyle({ left: 'calc(100% - 100%)' });
	});
});

describe('RangeInputElement', () => {
	it('renders input element with correct attributes', () => {
		const inputRef = createRef<HTMLInputElement | null>();
		const onChange = vi.fn();

		render(
			<RangeInputElement
				inputRef={inputRef}
				id="test-input"
				value={50}
				min={0}
				max={100}
				step={1}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				onChange={onChange}
				zIndex={20}
				inputProps={{}}
			/>
		);

		const input = screen.getByRole('slider');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'range');
		expect(input).toHaveAttribute('id', 'test-input');
		expect(input).toHaveAttribute('min', '0');
		expect(input).toHaveAttribute('max', '100');
		expect(input).toHaveAttribute('step', '1');
		expect(input).toHaveValue('50');
	});

	it('applies z-index style', () => {
		const inputRef = createRef<HTMLInputElement | null>();

		render(
			<RangeInputElement
				inputRef={inputRef}
				id="test-input"
				value={50}
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				onChange={vi.fn()}
				zIndex={30}
				inputProps={{}}
			/>
		);

		const input = screen.getByRole('slider');
		expect(input).toHaveStyle({ zIndex: 30 });
	});

	it('applies disabled attribute', () => {
		const inputRef = createRef<HTMLInputElement | null>();

		render(
			<RangeInputElement
				inputRef={inputRef}
				id="test-input"
				value={50}
				min={0}
				max={100}
				disabled={true}
				required={false}
				ariaDescribedBy={undefined}
				onChange={vi.fn()}
				zIndex={20}
				inputProps={{}}
			/>
		);

		const input = screen.getByRole('slider');
		expect(input).toBeDisabled();
	});

	it('applies required attribute', () => {
		const inputRef = createRef<HTMLInputElement | null>();

		render(
			<RangeInputElement
				inputRef={inputRef}
				id="test-input"
				value={50}
				min={0}
				max={100}
				disabled={false}
				required={true}
				ariaDescribedBy={undefined}
				onChange={vi.fn()}
				zIndex={20}
				inputProps={{}}
			/>
		);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('required');
	});

	it('applies aria-describedby', () => {
		const inputRef = createRef<HTMLInputElement | null>();

		render(
			<RangeInputElement
				inputRef={inputRef}
				id="test-input"
				value={50}
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy="test-error test-helper"
				onChange={vi.fn()}
				zIndex={20}
				inputProps={{}}
			/>
		);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('aria-describedby', 'test-error test-helper');
	});

	it('applies ARIA value attributes', () => {
		const inputRef = createRef<HTMLInputElement | null>();

		render(
			<RangeInputElement
				inputRef={inputRef}
				id="test-input"
				value={50}
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				onChange={vi.fn()}
				zIndex={20}
				inputProps={{}}
			/>
		);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('aria-valuemin', '0');
		expect(input).toHaveAttribute('aria-valuemax', '100');
		expect(input).toHaveAttribute('aria-valuenow', '50');
	});

	it('calls onChange when value changes', () => {
		const inputRef = createRef<HTMLInputElement | null>();
		const onChange = vi.fn();

		render(
			<RangeInputElement
				inputRef={inputRef}
				id="test-input"
				value={50}
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				onChange={onChange}
				zIndex={20}
				inputProps={{}}
			/>
		);

		const input = screen.getByRole('slider');
		fireEvent.change(input, { target: { value: '60' } });

		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('forwards additional input props', () => {
		const inputRef = createRef<HTMLInputElement | null>();

		render(
			<RangeInputElement
				inputRef={inputRef}
				id="test-input"
				value={50}
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				onChange={vi.fn()}
				zIndex={20}
				inputProps={
					{
						'data-testid': 'range-input',
						className: 'custom-input',
					} as any
				}
			/>
		);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('data-testid', 'range-input');
		expect(input).toHaveClass('custom-input');
	});
});

describe('RangeSliderElements', () => {
	it('renders all elements', () => {
		const state = createMockState();

		render(
			<RangeSliderElements
				state={state}
				minId="test-min"
				maxId="test-max"
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				thumbClasses="test-thumb"
				inputProps={{}}
			/>
		);

		const inputs = screen.getAllByRole('slider');
		expect(inputs).toHaveLength(2);
		expect(inputs[0]).toHaveAttribute('id', 'test-min');
		expect(inputs[1]).toHaveAttribute('id', 'test-max');

		// Check for active track and thumbs
		const activeTrack = document.querySelector('.bg-primary');
		expect(activeTrack).toBeInTheDocument();
		const thumbs = document.querySelectorAll('.test-thumb');
		expect(thumbs).toHaveLength(2);
	});

	it('renders with correct z-index values', () => {
		const state = createMockState();

		render(
			<RangeSliderElements
				state={state}
				minId="test-min"
				maxId="test-max"
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				thumbClasses="test-thumb"
				inputProps={{}}
			/>
		);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveStyle({ zIndex: 20 });
		expect(inputs[1]).toHaveStyle({ zIndex: 30 });
	});

	it('calls handleMinChange when min input changes', () => {
		const handleMinChange = vi.fn();
		const state = createMockState({ handleMinChange });

		render(
			<RangeSliderElements
				state={state}
				minId="test-min"
				maxId="test-max"
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				thumbClasses="test-thumb"
				inputProps={{}}
			/>
		);

		const inputs = screen.getAllByRole('slider');
		const minInput = inputs[0];
		expect(minInput).toBeDefined();
		if (minInput) {
			fireEvent.change(minInput, { target: { value: '30' } });
		}

		expect(handleMinChange).toHaveBeenCalledTimes(1);
	});

	it('calls handleMaxChange when max input changes', () => {
		const handleMaxChange = vi.fn();
		const state = createMockState({ handleMaxChange });

		render(
			<RangeSliderElements
				state={state}
				minId="test-min"
				maxId="test-max"
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				thumbClasses="test-thumb"
				inputProps={{}}
			/>
		);

		const inputs = screen.getAllByRole('slider');
		const maxInput = inputs[1];
		expect(maxInput).toBeDefined();
		if (maxInput) {
			fireEvent.change(maxInput, { target: { value: '90' } });
		}

		expect(handleMaxChange).toHaveBeenCalledTimes(1);
	});

	it('renders active track with correct dimensions', () => {
		const state = createMockState({
			activeTrackLeft: 25,
			activeTrackWidth: 50,
		});

		render(
			<RangeSliderElements
				state={state}
				minId="test-min"
				maxId="test-max"
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				thumbClasses="test-thumb"
				inputProps={{}}
			/>
		);

		const activeTrack = document.querySelector('.bg-primary');
		expect(activeTrack).toHaveStyle({ left: '25%', width: '50%' });
	});

	it('renders thumbs at correct positions', () => {
		const state = createMockState({
			minPercentage: 30,
			maxPercentage: 70,
			minThumbOffset: '50%',
			maxThumbOffset: '50%',
		});

		render(
			<RangeSliderElements
				state={state}
				minId="test-min"
				maxId="test-max"
				min={0}
				max={100}
				disabled={false}
				required={false}
				ariaDescribedBy={undefined}
				thumbClasses="test-thumb"
				inputProps={{}}
			/>
		);

		const thumbs = document.querySelectorAll('.test-thumb');
		expect(thumbs[0]).toHaveStyle({ left: 'calc(30% - 50%)' });
		expect(thumbs[1]).toHaveStyle({ left: 'calc(70% - 50%)' });
	});
});
