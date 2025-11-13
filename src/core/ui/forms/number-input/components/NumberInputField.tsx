import { NumberInputButton } from '@core/ui/forms/number-input/components/NumberInputButton';
import type { NumberInputFieldProps } from '@core/ui/forms/number-input/types/NumberInputTypes';
import Icon from '@core/ui/icons/Icon';
import type { InputHTMLAttributes } from 'react';

interface NumberInputProps {
	readonly id: string | undefined;
	readonly className: string;
	readonly hasError: boolean;
	readonly ariaDescribedBy: string | undefined;
	readonly disabled?: boolean | undefined;
	readonly required?: boolean | undefined;
	readonly min?: number | undefined;
	readonly max?: number | undefined;
	readonly step?: number | undefined;
	readonly inputProps: Readonly<
		Omit<
			InputHTMLAttributes<HTMLInputElement>,
			| 'size'
			| 'id'
			| 'className'
			| 'disabled'
			| 'required'
			| 'aria-invalid'
			| 'aria-describedby'
			| 'type'
			| 'min'
			| 'max'
			| 'step'
		>
	>;
}

function NumberInput({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	min,
	max,
	step,
	inputProps,
}: NumberInputProps) {
	return (
		<input
			id={id}
			type="number"
			className={className}
			disabled={disabled}
			required={required}
			min={min}
			max={max}
			step={step}
			aria-invalid={hasError}
			aria-describedby={ariaDescribedBy}
			{...inputProps}
		/>
	);
}

interface NumberInputControlsProps {
	readonly disabled?: boolean | undefined;
	readonly canIncrement: boolean;
	readonly canDecrement: boolean;
	readonly onIncrement: () => void;
	readonly onDecrement: () => void;
}

function NumberInputControls({
	disabled,
	canIncrement,
	canDecrement,
	onIncrement,
	onDecrement,
}: NumberInputControlsProps) {
	const isIncrementDisabled = (disabled ?? false) || !canIncrement;
	const isDecrementDisabled = (disabled ?? false) || !canDecrement;

	return (
		<div className="absolute inset-y-0 right-0 flex flex-col border-l border-border divide-y divide-border">
			<NumberInputButton
				onClick={onIncrement}
				disabled={isIncrementDisabled}
				aria-label="Increment"
			>
				<Icon name="arrow-up" size="sm" className="p-1" />
			</NumberInputButton>
			<NumberInputButton
				onClick={onDecrement}
				disabled={isDecrementDisabled}
				aria-label="Decrement"
			>
				<Icon name="arrow-down" size="sm" className="p-1" />
			</NumberInputButton>
		</div>
	);
}

export function NumberInputField({
	id,
	className,
	hasError,
	ariaDescribedBy,
	disabled,
	required,
	min,
	max,
	step,
	onIncrement,
	onDecrement,
	canIncrement,
	canDecrement,
	props: inputProps,
}: Readonly<NumberInputFieldProps>) {
	return (
		<div className="relative">
			<NumberInput
				id={id}
				className={className}
				hasError={hasError}
				ariaDescribedBy={ariaDescribedBy}
				disabled={disabled}
				required={required}
				min={min}
				max={max}
				step={step}
				inputProps={inputProps}
			/>
			<NumberInputControls
				disabled={disabled}
				canIncrement={canIncrement}
				canDecrement={canDecrement}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
			/>
		</div>
	);
}
