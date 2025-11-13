import type { RatingProps } from '@src-types/ui/forms-advanced';
import type { ReactNode } from 'react';

import { normalizeRatingProps } from './Rating.helpers';
import { useRatingConfig, type UseRatingConfigParams } from './useRatingConfig';
import { useRatingContent, type UseRatingContentParams } from './useRatingContent';

export interface UseRatingPropsParams {
	props: Readonly<RatingProps>;
}

export interface UseRatingPropsReturn {
	controlledValue?: number | undefined;
	defaultValue?: number | undefined;
	readOnly: boolean;
	disabled: boolean;
	onChange?: ((value: number) => void) | undefined;
	size: RatingProps['size'];
	className?: string | undefined;
	max: number;
	ariaLabel: string;
	allowHalf: boolean;
	emptyIcon?: ReactNode;
	filledIcon?: ReactNode;
	restProps: Record<string, unknown>;
}

export const useRatingProps = ({ props }: UseRatingPropsParams): UseRatingPropsReturn => {
	const normalizedProps = normalizeRatingProps(props);
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
		allowHalf,
		emptyIcon,
		filledIcon,
		restProps,
	} = normalizedProps;

	return {
		controlledValue,
		defaultValue,
		readOnly,
		disabled,
		onChange,
		size,
		className,
		max,
		ariaLabel,
		allowHalf,
		emptyIcon,
		filledIcon,
		restProps,
	};
};

export interface UseRatingConfigDataParams extends UseRatingConfigParams {}

export interface UseRatingConfigDataReturn {
	displayValue: number;
	starClasses: string;
	emptyStarClasses: string;
	handleStarClick: (index: number) => void;
	handleStarHover: (index: number) => void;
	containerProps: Record<string, unknown>;
}

export const useRatingConfigData = (
	params: UseRatingConfigDataParams
): UseRatingConfigDataReturn => {
	const configData = useRatingConfig(params);
	const {
		displayValue,
		starClasses,
		emptyStarClasses,
		handleStarClick,
		handleStarHover,
		containerProps,
	} = configData;

	return {
		displayValue,
		starClasses,
		emptyStarClasses,
		handleStarClick,
		handleStarHover,
		containerProps,
	};
};

export interface UseRatingContentPropsParams extends UseRatingContentParams {}

export interface UseRatingContentPropsReturn {
	max: number;
	displayValue: number;
	allowHalf: boolean;
	size: RatingProps['size'];
	readOnly: boolean;
	disabled: boolean;
	starClasses: string;
	emptyStarClasses: string;
	emptyIcon?: ReactNode | undefined;
	filledIcon?: ReactNode | undefined;
	onClick: (index: number) => void;
	onMouseEnter: (index: number) => void;
}

export const useRatingContentProps = (
	params: UseRatingContentPropsParams
): UseRatingContentPropsReturn => {
	return useRatingContent(params);
};

export interface UseRatingReturn {
	containerProps: Record<string, unknown>;
	contentProps: {
		max: number;
		displayValue: number;
		allowHalf: boolean;
		size: RatingProps['size'];
		readOnly: boolean;
		disabled: boolean;
		starClasses: string;
		emptyStarClasses: string;
		emptyIcon?: ReactNode | undefined;
		filledIcon?: ReactNode | undefined;
		onClick: (index: number) => void;
		onMouseEnter: (index: number) => void;
	};
	restProps: Record<string, unknown>;
}

export const useRating = (props: Readonly<RatingProps>): UseRatingReturn => {
	const ratingProps = useRatingProps({ props });
	const configData = useRatingConfigData({
		controlledValue: ratingProps.controlledValue,
		defaultValue: ratingProps.defaultValue,
		readOnly: ratingProps.readOnly,
		disabled: ratingProps.disabled,
		onChange: ratingProps.onChange,
		size: ratingProps.size,
		className: ratingProps.className,
		max: ratingProps.max,
		ariaLabel: ratingProps.ariaLabel,
	});
	const contentProps = useRatingContentProps({
		max: ratingProps.max,
		allowHalf: ratingProps.allowHalf,
		size: ratingProps.size,
		readOnly: ratingProps.readOnly,
		disabled: ratingProps.disabled,
		starClasses: configData.starClasses,
		emptyStarClasses: configData.emptyStarClasses,
		emptyIcon: ratingProps.emptyIcon,
		filledIcon: ratingProps.filledIcon,
		displayValue: configData.displayValue,
		handleStarClick: configData.handleStarClick,
		handleStarHover: configData.handleStarHover,
	});

	return {
		containerProps: configData.containerProps,
		contentProps,
		restProps: ratingProps.restProps,
	};
};
