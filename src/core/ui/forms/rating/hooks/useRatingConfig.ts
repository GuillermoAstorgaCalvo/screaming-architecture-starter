import { useRatingStateAndHandlers } from '@core/ui/forms/rating/hooks/useRatingHandlers';
import { useRatingStylesAndContainer } from '@core/ui/forms/rating/hooks/useRatingStyles';
import type { RatingProps } from '@src-types/ui/forms-advanced';

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
