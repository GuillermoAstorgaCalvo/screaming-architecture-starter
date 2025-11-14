import HelperText from '@core/ui/helper-text/HelperText';
import Label from '@core/ui/label/Label';
import Text from '@core/ui/text/Text';
import { classNames } from '@core/utils/classNames';
import { getPercentage } from '@domains/shared/components/slider/helpers/sliderModel';
import type {
	OptionalString,
	SliderInputProps,
	SliderMarksProps,
	SliderViewProps,
} from '@domains/shared/components/slider/types/slider.types';

interface SliderHeaderProps {
	readonly htmlFor: string;
	readonly showValue: boolean;
	readonly formattedValue: string;
	readonly label: OptionalString;
}

function SliderHeader({ htmlFor, label, showValue, formattedValue }: Readonly<SliderHeaderProps>) {
	if (!label) {
		return null;
	}

	return (
		<div className="flex items-center justify-between">
			<Label htmlFor={htmlFor} size="sm">
				{label}
			</Label>
			{showValue ? (
				<Text size="sm" className="text-muted-foreground">
					{formattedValue}
				</Text>
			) : null}
		</div>
	);
}

function SliderMarks({ marks, min, range, marksId }: Readonly<SliderMarksProps>) {
	if (!marks || marks.length === 0) {
		return null;
	}

	return (
		<div id={marksId} className="relative mt-1 h-8 text-xs text-muted-foreground">
			{marks.map(mark => {
				const position = getPercentage(mark.value, min, range);
				return (
					<div
						key={mark.value}
						className="pointer-events-none absolute flex -translate-x-1/2 flex-col items-center"
						style={{ left: `${position}%` }}
						aria-hidden
					>
						<span className="h-2 w-px bg-border" />
						{mark.label ? <span className="mt-1 whitespace-nowrap">{mark.label}</span> : null}
					</div>
				);
			})}
		</div>
	);
}

interface SliderHelperTextProps {
	readonly helperText: OptionalString;
	readonly helperId: OptionalString;
}

function SliderHelper({ helperText, helperId }: Readonly<SliderHelperTextProps>) {
	if (!helperText || !helperId) {
		return null;
	}

	return (
		<HelperText id={helperId} size="sm">
			{helperText}
		</HelperText>
	);
}

function SliderInput({
	id,
	value,
	min,
	max,
	step,
	disabled,
	helperId,
	percentage,
	onChange,
	inputProps,
}: Readonly<SliderInputProps>) {
	return (
		<input
			{...inputProps}
			id={id}
			type="range"
			className="slider-thumb h-2 w-full appearance-none rounded-full bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed"
			value={value}
			min={min}
			max={max}
			step={step}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			aria-describedby={helperId}
			aria-disabled={disabled}
			disabled={disabled}
			style={{
				background: `linear-gradient(to right, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%)`,
			}}
			onChange={event => onChange(Number(event.target.value))}
		/>
	);
}

export function SliderView({
	sliderId,
	className,
	label,
	showValue,
	formattedValue,
	sliderInputProps,
	sliderMarksProps,
	helperText,
	helperId,
}: Readonly<SliderViewProps>) {
	return (
		<div className={classNames('w-full space-y-2', className)}>
			<SliderHeader
				htmlFor={sliderId}
				label={label}
				showValue={showValue}
				formattedValue={formattedValue}
			/>
			<div className="flex flex-col gap-3">
				<SliderInput {...sliderInputProps} />
				<SliderMarks {...sliderMarksProps} />
			</div>
			<SliderHelper helperText={helperText} helperId={helperId} />
		</div>
	);
}
