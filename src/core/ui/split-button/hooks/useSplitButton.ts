import type { DropdownMenuItem } from '@core/ui/dropdown-menu/DropdownMenu.types';
import type { ButtonVariant, SplitButtonProps } from '@src-types/ui/buttons';
import { type ReactElement, useMemo } from 'react';

import {
	createDropdownTrigger,
	getBorderColorClass,
	getDropdownButtonClasses,
	getMainButtonClasses,
	handleMenuItemSelect,
} from './SplitButtonHelpers';

interface UseSplitButtonParams {
	readonly variant: ButtonVariant;
	readonly size: SplitButtonProps['size'];
	readonly className: string | undefined;
	readonly disabled: boolean | undefined;
	readonly isLoading: boolean;
	readonly dropdownAriaLabel: string;
	readonly onMenuItemSelect: SplitButtonProps['onMenuItemSelect'] | undefined;
}

interface UseSplitButtonReturn {
	readonly buttonClasses: string;
	readonly dropdownButtonClasses: string;
	readonly dropdownTrigger: ReactElement;
	readonly handleSelect: (item: DropdownMenuItem) => void;
}

/**
 * Hook to prepare split button state and handlers
 *
 * @param params - Parameters for the split button
 * @returns Prepared state and handlers
 *
 * @internal
 */
export function useSplitButton({
	variant,
	size,
	className,
	disabled,
	isLoading,
	dropdownAriaLabel,
	onMenuItemSelect,
}: Readonly<UseSplitButtonParams>): UseSplitButtonReturn {
	const borderColorClass = useMemo(() => getBorderColorClass(variant), [variant]);
	const buttonClasses = useMemo(
		() => getMainButtonClasses(variant, size, className),
		[variant, size, className]
	);
	const dropdownButtonClasses = useMemo(
		() => getDropdownButtonClasses(variant, size, borderColorClass),
		[variant, size, borderColorClass]
	);
	const dropdownTrigger: ReactElement = useMemo(
		() =>
			createDropdownTrigger({
				disabled,
				isLoading,
				dropdownButtonClasses,
				dropdownAriaLabel,
			}),
		[disabled, isLoading, dropdownButtonClasses, dropdownAriaLabel]
	);
	const handleSelect = useMemo(
		() => (item: DropdownMenuItem) => {
			handleMenuItemSelect({ item, onMenuItemSelect });
		},
		[onMenuItemSelect]
	);

	return { buttonClasses, dropdownButtonClasses, dropdownTrigger, handleSelect };
}
