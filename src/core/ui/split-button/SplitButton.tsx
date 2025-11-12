import type { ButtonVariant, SplitButtonProps } from '@src-types/ui/buttons';

import { renderSplitButton } from './SplitButtonRenderers';
import { useSplitButton } from './useSplitButton';

type ButtonType = 'button' | 'submit' | 'reset';
type MenuAlign = 'start' | 'center' | 'end';
type ButtonPropsOnly = Omit<
	SplitButtonProps,
	| 'variant'
	| 'size'
	| 'isLoading'
	| 'disabled'
	| 'onClick'
	| 'menuItems'
	| 'onMenuItemSelect'
	| 'menuAlign'
	| 'dropdownAriaLabel'
	| 'className'
	| 'children'
	| 'type'
>;

// ============================================================================
// Default Props
// ============================================================================

/**
 * Default prop values for SplitButton
 *
 * @internal
 */
const DEFAULT_PROPS = {
	variant: 'primary' as const,
	size: 'md' as const,
	isLoading: false,
	menuAlign: 'end' as const,
	dropdownAriaLabel: 'More options',
	type: 'button' as const,
} as const;

// ============================================================================
// Prop Normalization
// ============================================================================

interface NormalizedSplitButtonProps {
	readonly variant: ButtonVariant;
	readonly size: SplitButtonProps['size'];
	readonly isLoading: boolean;
	readonly disabled: boolean | undefined;
	readonly onClick: SplitButtonProps['onClick'];
	readonly menuItems: SplitButtonProps['menuItems'];
	readonly onMenuItemSelect: SplitButtonProps['onMenuItemSelect'];
	readonly menuAlign: MenuAlign;
	readonly dropdownAriaLabel: string;
	readonly className: string | undefined;
	readonly children: SplitButtonProps['children'];
	readonly type: ButtonType;
	readonly buttonProps: ButtonPropsOnly;
}

/**
 * Normalizes SplitButton props by merging with defaults
 *
 * @param props - Raw props from component
 * @returns Normalized props with defaults applied
 *
 * @internal
 */
function normalizeSplitButtonProps(props: Readonly<SplitButtonProps>): NormalizedSplitButtonProps {
	const {
		variant = DEFAULT_PROPS.variant,
		size = DEFAULT_PROPS.size,
		isLoading = DEFAULT_PROPS.isLoading,
		disabled,
		onClick,
		menuItems,
		onMenuItemSelect,
		menuAlign = DEFAULT_PROPS.menuAlign,
		dropdownAriaLabel = DEFAULT_PROPS.dropdownAriaLabel,
		className,
		children,
		type = DEFAULT_PROPS.type,
		...rest
	} = props;

	return {
		variant,
		size,
		isLoading,
		disabled,
		onClick,
		menuItems,
		onMenuItemSelect,
		menuAlign,
		dropdownAriaLabel,
		className,
		children,
		type,
		buttonProps: rest,
	};
}

// ============================================================================
// Component
// ============================================================================

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
