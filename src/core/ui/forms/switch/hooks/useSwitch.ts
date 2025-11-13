import type { StandardSize } from '@src-types/ui/base';
import type { SwitchProps } from '@src-types/ui/forms';
import { useId } from 'react';

import {
	generateSwitchId,
	getAriaDescribedBy,
	getSwitchClasses,
	getSwitchThumbClasses,
} from './SwitchHelpers';
import type { SwitchContentProps, SwitchInputProps } from './SwitchTypes';

export interface UseSwitchPropsOptions {
	readonly props: Readonly<SwitchProps>;
}

export interface UseSwitchPropsReturn {
	readonly contentProps: Readonly<SwitchContentProps>;
}

interface UseSwitchStateOptions {
	readonly switchId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
	readonly checked?: boolean | undefined;
	readonly defaultChecked?: boolean | undefined;
}

interface UseSwitchStateReturn {
	readonly finalId: string | undefined;
	readonly switchClasses: string;
	readonly thumbClasses: string;
	readonly ariaDescribedBy: string | undefined;
}

/**
 * Hook to compute switch state (ID, ARIA attributes, and classes)
 *
 * Generates a unique ID for the switch if not provided, builds ARIA described-by
 * attributes, and computes CSS classes based on size and checked state.
 *
 * @param options - Configuration options for switch state
 * @returns Computed switch state including ID, ARIA attributes, and classes
 */
function useSwitchState({
	switchId,
	label,
	error,
	helperText,
	size,
	className,
	checked,
	defaultChecked,
}: Readonly<UseSwitchStateOptions>): UseSwitchStateReturn {
	const generatedId = useId();
	const finalId = generateSwitchId(generatedId, switchId, label);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;

	const isChecked = checked ?? defaultChecked ?? false;
	const switchClasses = getSwitchClasses({
		size,
		checked: isChecked,
		className,
	});
	const thumbClasses = getSwitchThumbClasses({
		size,
		checked: isChecked,
	});

	return { finalId, switchClasses, thumbClasses, ariaDescribedBy };
}

interface BuildSwitchContentPropsOptions {
	readonly props: Readonly<SwitchProps>;
	readonly state: UseSwitchStateReturn;
	readonly fieldProps: Readonly<SwitchInputProps>;
}

/**
 * Builds content props object for the Switch component
 *
 * Combines computed state with additional props to create the final
 * content props object that will be passed to the Switch component.
 *
 * @param options - Options containing props, state, and field props
 * @returns Complete content props object
 *
 * @internal
 */
function buildSwitchContentProps(
	options: Readonly<BuildSwitchContentPropsOptions>
): SwitchContentProps {
	const { props, state, fieldProps } = options;
	return {
		switchId: state.finalId,
		switchClasses: state.switchClasses,
		thumbClasses: state.thumbClasses,
		ariaDescribedBy: state.ariaDescribedBy,
		label: props.label,
		error: props.error,
		helperText: props.helperText,
		required: props.required,
		fullWidth: props.fullWidth ?? false,
		disabled: props.disabled,
		checked: props.checked,
		defaultChecked: props.defaultChecked,
		fieldProps,
	};
}

/**
 * Hook to process Switch component props and return content props
 *
 * Extracts and processes Switch component props, computes state using
 * useSwitchState, and builds content props. Returns all necessary data
 * for rendering the Switch component including label, error, helper text,
 * and layout options.
 *
 * @example
 * ```tsx
 * function MySwitch() {
 *   const { contentProps } = useSwitchProps({
 *     props: {
 *       label: 'Enable notifications',
 *       checked: true,
 *     },
 *   });
 *   // Use returned values to render Switch component
 * }
 * ```
 *
 * @param options - Options containing Switch component props
 * @returns Processed content props
 */
export function useSwitchProps({ props }: Readonly<UseSwitchPropsOptions>): UseSwitchPropsReturn {
	const {
		label,
		error,
		helperText,
		size = 'md',
		switchId,
		className,
		checked,
		defaultChecked,
		...rest
	} = props;

	const state = useSwitchState({
		switchId,
		label,
		error,
		helperText,
		size,
		className,
		checked,
		defaultChecked,
	});

	const fieldProps: Readonly<SwitchInputProps> = rest;
	const contentProps = buildSwitchContentProps({ props, state, fieldProps });

	return { contentProps };
}
