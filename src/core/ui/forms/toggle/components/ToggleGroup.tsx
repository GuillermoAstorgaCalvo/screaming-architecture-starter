import { ToggleGroupContext } from '@core/ui/forms/toggle/components/ToggleGroupContext';
import { useToggleGroup } from '@core/ui/forms/toggle/hooks/useToggleGroup';
import { useToggleGroupContext } from '@core/ui/forms/toggle/hooks/useToggleGroupContext';
import Toggle from '@core/ui/forms/toggle/Toggle';
import type { ToggleGroupProps } from '@core/ui/forms/toggle/types/ToggleGroupTypes';
import type { ReactNode } from 'react';

/**
 * ToggleGroup - Container for managing multiple Toggle components
 *
 * Features:
 * - Single or multiple selection modes
 * - Shared variant and size across toggles
 * - Accessible: proper ARIA attributes
 * - Controlled and uncontrolled modes
 *
 * @example
 * ```tsx
 * <ToggleGroup type="single" value={value} onValueChange={setValue}>
 *   <Toggle value="a">Option A</Toggle>
 *   <Toggle value="b">Option B</Toggle>
 * </ToggleGroup>
 * ```
 *
 * @example
 * ```tsx
 * <ToggleGroup type="multiple" value={values} onValueChange={setValues}>
 *   <Toggle value="a">Option A</Toggle>
 *   <Toggle value="b">Option B</Toggle>
 * </ToggleGroup>
 * ```
 */
export default function ToggleGroup({
	type = 'single',
	value,
	onValueChange,
	variant = 'default',
	size = 'md',
	disabled = false,
	className,
	children,
}: Readonly<ToggleGroupProps>) {
	const contextValue = useToggleGroup({ type, value, onValueChange, variant, size, disabled });

	return (
		<ToggleGroupContext.Provider value={contextValue}>
			<div className={className}>{children}</div>
		</ToggleGroupContext.Provider>
	);
}

/**
 * ToggleGroupItem - Individual toggle within a ToggleGroup
 */
export interface ToggleGroupItemProps {
	readonly value: string;
	readonly children: ReactNode;
	readonly disabled?: boolean;
	readonly className?: string;
}

export function ToggleGroupItem({
	value,
	children,
	disabled,
	className,
}: Readonly<ToggleGroupItemProps>) {
	const { selectedValues, handleToggle, variant, size, groupDisabled } = useToggleGroupContext();
	const isPressed = selectedValues.includes(value);
	const isDisabled = disabled ?? groupDisabled;

	const handleClick = () => {
		if (!isDisabled) {
			handleToggle(value);
		}
	};

	return (
		<Toggle
			variant={variant}
			size={size}
			pressed={isPressed}
			onPressedChange={handleClick}
			disabled={isDisabled}
			className={className}
		>
			{children}
		</Toggle>
	);
}
