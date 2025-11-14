import type {
	SliderInputAttributes,
	SliderModelArgs,
	SliderViewProps,
} from '@domains/shared/components/slider/types/slider.types';

const MIN_RANGE_DELTA = 0.0001;

export function clampValue(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function getRange(min: number, max: number) {
	return Math.max(max - min, MIN_RANGE_DELTA);
}

export function getPercentage(value: number, min: number, range: number) {
	return ((value - min) / range) * 100;
}

function computeDerivedValues(args: {
	sliderId: string;
	value: number;
	min: number;
	max: number;
	helperText: string | undefined;
	formatValue: ((value: number) => string) | undefined;
	marks: Array<{ readonly value: number; readonly label?: string }> | undefined;
}) {
	const { sliderId, value, min, max, helperText, formatValue, marks } = args;
	const helperId = helperText ? `${sliderId}-helper` : undefined;
	const marksId = marks && marks.length > 0 ? `${sliderId}-marks` : undefined;
	const range = getRange(min, max);
	const boundedValue = clampValue(value, min, max);
	const percentage = getPercentage(boundedValue, min, range);
	const formattedValue = formatValue ? formatValue(boundedValue) : boundedValue.toString();

	return { helperId, marksId, range, boundedValue, percentage, formattedValue };
}

function buildSliderInputProps(args: {
	sliderId: string;
	boundedValue: number;
	min: number;
	max: number;
	step: number;
	disabled: boolean | undefined;
	helperId: string | undefined;
	percentage: number;
	onChange: (value: number) => void;
	inputProps: SliderInputAttributes;
}) {
	const {
		sliderId,
		boundedValue,
		min,
		max,
		step,
		disabled,
		helperId,
		percentage,
		onChange,
		inputProps,
	} = args;
	return {
		id: sliderId,
		value: boundedValue,
		min,
		max,
		step,
		disabled,
		helperId,
		percentage,
		onChange,
		inputProps,
	};
}

function buildSliderMarksProps(args: {
	marks: Array<{ readonly value: number; readonly label?: string }> | undefined;
	min: number;
	range: number;
	marksId: string | undefined;
}) {
	return { marks: args.marks, min: args.min, range: args.range, marksId: args.marksId };
}

function extractBasicViewProps(
	args: SliderModelArgs,
	derived: ReturnType<typeof computeDerivedValues>
) {
	const { sliderId, className, label, showValue, helperText } = args;
	const { helperId, formattedValue } = derived;

	return {
		sliderId,
		className,
		label,
		showValue,
		formattedValue,
		helperId,
		helperText,
	};
}

function extractSliderInputArgs(
	args: SliderModelArgs,
	derived: ReturnType<typeof computeDerivedValues>
) {
	const { sliderId, step, disabled, onChange, inputProps, min, max } = args;
	const { boundedValue, percentage, helperId } = derived;

	return {
		sliderId,
		boundedValue,
		min,
		max,
		step,
		disabled,
		helperId,
		percentage,
		onChange,
		inputProps,
	};
}

function extractSliderMarksArgs(
	args: SliderModelArgs,
	derived: ReturnType<typeof computeDerivedValues>
) {
	const { marks, min } = args;
	const { range, marksId } = derived;

	return { marks, min, range, marksId };
}

function buildSliderViewProps(
	args: SliderModelArgs,
	derived: ReturnType<typeof computeDerivedValues>
): SliderViewProps {
	const basicProps = extractBasicViewProps(args, derived);
	const sliderInputArgs = extractSliderInputArgs(args, derived);
	const sliderMarksArgs = extractSliderMarksArgs(args, derived);

	const sliderInputProps = buildSliderInputProps(sliderInputArgs);
	const sliderMarksProps = buildSliderMarksProps(sliderMarksArgs);

	return {
		...basicProps,
		sliderInputProps,
		sliderMarksProps,
	};
}

export function buildSliderModel(args: SliderModelArgs): SliderViewProps {
	const derived = computeDerivedValues(args);
	return buildSliderViewProps(args, derived);
}
