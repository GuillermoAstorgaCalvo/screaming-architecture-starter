import type { RatingProps } from '@src-types/ui/forms-advanced';
import type { ReactNode } from 'react';

export interface StarFillParams {
	displayValue: number;
	starIndex: number;
	allowHalf: boolean;
}

export interface StarClassesParams {
	readOnly: boolean;
	disabled: boolean;
}

export interface StarButtonPropsParams {
	starIndex: number;
	fill: number;
	readOnly: boolean;
	disabled: boolean;
}

export interface RatingContainerPropsParams {
	readOnly: boolean;
	currentValue: number;
	max: number;
	ariaLabel: string;
	classes: string;
	handleMouseLeave?: () => void;
}

export interface RatingStylesParams {
	size: RatingProps['size'];
	className?: string | undefined;
	readOnly: boolean;
	disabled: boolean;
}

export interface NormalizedRatingProps {
	controlledValue?: number | undefined;
	defaultValue?: number | undefined;
	max: number;
	size: RatingProps['size'];
	readOnly: boolean;
	disabled: boolean;
	onChange?: ((value: number) => void) | undefined;
	ariaLabel: string;
	allowHalf: boolean;
	emptyIcon?: ReactNode | undefined;
	filledIcon?: ReactNode | undefined;
	className?: string | undefined;
	restProps: Record<string, unknown>;
}
