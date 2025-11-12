/**
 * Build aria label props
 */
export function buildAriaLabelProps({
	ariaLabel,
	label,
	value,
	max,
	unit,
}: {
	ariaLabel: string | undefined;
	label: string | undefined;
	value: number;
	max: number;
	unit: string | undefined;
}) {
	const props: { ariaLabel?: string; label?: string; value: number; max: number; unit?: string } = {
		value,
		max,
	};
	if (ariaLabel !== undefined) props.ariaLabel = ariaLabel;
	if (label !== undefined) props.label = label;
	if (unit !== undefined) props.unit = unit;
	return props;
}

/**
 * Build meter value props
 */
export function buildMeterValueProps({
	value,
	max,
	unit,
	customFormatValue,
}: {
	value: number;
	max: number;
	unit: string | undefined;
	customFormatValue: ((value: number, max: number, unit?: string) => string) | undefined;
}) {
	const props: {
		value: number;
		max: number;
		unit?: string;
		formatValue?: (value: number, max: number, unit?: string) => string;
	} = { value, max };
	if (unit !== undefined) props.unit = unit;
	if (customFormatValue !== undefined) props.formatValue = customFormatValue;
	return props;
}
