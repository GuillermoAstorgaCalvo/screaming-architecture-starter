import { ColorPickerContainer } from './ColorPickerContainer';
import { ColorPickerField } from './ColorPickerField';
import { ColorPickerLabel } from './ColorPickerLabel';
import { ColorPickerMessages } from './ColorPickerMessages';
import { ColorPickerSwatches } from './ColorPickerSwatches';
import type { ColorPickerContentProps } from './ColorPickerTypes';
import { ColorPickerWrapper } from './ColorPickerWrapper';

function buildColorPickerFieldPropsFromLabelProps(props: Readonly<ColorPickerContentProps>) {
	const {
		colorPickerId,
		colorPickerClasses,
		ariaDescribedBy,
		disabled,
		required,
		value,
		defaultValue,
		onChange,
		fieldProps,
	} = props;
	return {
		id: colorPickerId,
		colorPickerClasses,
		ariaDescribedBy,
		disabled,
		required,
		value,
		defaultValue,
		onChange,
		props: fieldProps,
	};
}

function ColorPickerFieldWithLabel(props: Readonly<ColorPickerContentProps>) {
	const { colorPickerId, label, required } = props;
	const fieldProps = buildColorPickerFieldPropsFromLabelProps(props);
	return (
		<ColorPickerContainer>
			<ColorPickerField {...fieldProps} />
			{label && colorPickerId ? (
				<ColorPickerLabel id={colorPickerId} label={label} required={required} size="sm" />
			) : null}
		</ColorPickerContainer>
	);
}

export function ColorPickerContent(props: Readonly<ColorPickerContentProps>) {
	const {
		colorPickerId,
		error,
		helperText,
		fullWidth,
		swatches,
		showSwatches,
		value,
		onChange,
		disabled,
	} = props;

	const handleSwatchSelect = (color: string) => {
		onChange?.(color);
	};

	return (
		<ColorPickerWrapper fullWidth={fullWidth}>
			<ColorPickerFieldWithLabel {...props} />
			{showSwatches && swatches && swatches.length > 0 ? (
				<ColorPickerSwatches
					swatches={swatches}
					currentColor={value}
					onColorSelect={handleSwatchSelect}
					disabled={disabled}
				/>
			) : null}
			{colorPickerId ? (
				<ColorPickerMessages colorPickerId={colorPickerId} error={error} helperText={helperText} />
			) : null}
		</ColorPickerWrapper>
	);
}
