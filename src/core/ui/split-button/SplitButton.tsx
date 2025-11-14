import { renderSplitButton } from '@core/ui/split-button/helpers/SplitButtonRenderers';
import { useSplitButton } from '@core/ui/split-button/hooks/useSplitButton';
import { normalizeSplitButtonProps } from '@core/ui/split-button/utils/normalizeSplitButtonProps';
import type { SplitButtonProps } from '@src-types/ui/buttons';

/**
 * SplitButton - Button with primary action and dropdown menu
 *
 * Features:
 * - Accessible: proper semantic HTML, keyboard navigation, focus states
 * - Variants: primary, secondary, ghost
 * - Sizes: sm, md, lg
 * - Loading state support
 * - Dropdown menu with items and separators
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <SplitButton
 *   variant="primary"
 *   size="md"
 *   onClick={handleSave}
 *   menuItems={[
 *     { id: '1', label: 'Save As...', onSelect: handleSaveAs },
 *     { id: '2', label: 'Export', onSelect: handleExport },
 *   ]}
 * >
 *   Save
 * </SplitButton>
 * ```
 *
 * @example
 * ```tsx
 * <SplitButton
 *   variant="primary"
 *   isLoading
 *   onClick={handleSubmit}
 *   menuItems={[
 *     { id: '1', label: 'Save Draft' },
 *     { id: '2', type: 'separator' },
 *     { id: '3', label: 'Cancel' },
 *   ]}
 * >
 *   Submit
 * </SplitButton>
 * ```
 */
export default function SplitButton(props: Readonly<SplitButtonProps>) {
	const normalizedProps = normalizeSplitButtonProps(props);
	const { buttonClasses, dropdownTrigger, handleSelect } = useSplitButton({
		variant: normalizedProps.variant,
		size: normalizedProps.size,
		className: normalizedProps.className,
		disabled: normalizedProps.disabled,
		isLoading: normalizedProps.isLoading,
		dropdownAriaLabel: normalizedProps.dropdownAriaLabel,
		onMenuItemSelect: normalizedProps.onMenuItemSelect,
	});
	return renderSplitButton({
		variant: normalizedProps.variant,
		size: normalizedProps.size,
		isLoading: normalizedProps.isLoading,
		disabled: normalizedProps.disabled,
		onClick: normalizedProps.onClick,
		type: normalizedProps.type,
		buttonClasses,
		dropdownTrigger,
		menuItems: normalizedProps.menuItems,
		handleSelect,
		menuAlign: normalizedProps.menuAlign,
		dropdownAriaLabel: normalizedProps.dropdownAriaLabel,
		children: normalizedProps.children,
		buttonProps: normalizedProps.buttonProps,
	});
}
