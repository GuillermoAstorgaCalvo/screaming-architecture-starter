import type { RatingProps } from '@src-types/ui/forms-advanced';

import { useRatingStateAndHandlers } from './useRatingHandlers';
import { useRatingStylesAndContainer } from './useRatingStyles';

export interface UseRatingConfigParams {
	controlledValue?: number | undefined;
	defaultValue?: number | undefined;
	readOnly: boolean;
	disabled: boolean;
	onChange?: ((value: number) => void) | undefined;
	size: RatingProps['size'];
	className?: string | undefined;
	max: number;
	ariaLabel: string;
}

export const useRatingConfig = (params: UseRatingConfigParams) => {
	const {
		controlledValue,
		defaultValue,
		readOnly,
		disabled,
		onChange,
		size,
		className,
		max,
		ariaLabel,
	} = params;
	const { displayValue, handleStarClick, handleStarHover, handleMouseLeave, currentValue } =
		useRatingStateAndHandlers({
			controlledValue,
			defaultValue,
			readOnly,
			disabled,
			onChange,
		});
	const { starClasses, emptyStarClasses, containerProps } = useRatingStylesAndContainer({
		readOnly,
		disabled,
		currentValue,
		max,
		ariaLabel,
		size,
		className,
		handleMouseLeave,
	});

	return {
		displayValue,
		starClasses,
		emptyStarClasses,
		handleStarClick,
		handleStarHover,
		containerProps,
	};
};
