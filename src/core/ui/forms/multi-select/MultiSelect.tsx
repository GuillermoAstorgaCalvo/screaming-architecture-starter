import { MultiSelectContent } from '@core/ui/forms/multi-select/components/MultiSelectContent';
import { useMultiSelect } from '@core/ui/forms/multi-select/hooks/useMultiSelect';
import type { ReactNode } from 'react';

export interface MultiSelectOption {
	readonly value: string;
	readonly label: ReactNode;
	readonly disabled?: boolean;
}

export interface MultiSelectProps {
	/** Label text for the multiselect */
	label?: string;
	/** Placeholder text */
	placeholder?: string;
	/** Error message to display */
	error?: string;
	/** Helper text to display */
	helperText?: string;
	/** Size of the multiselect @default 'md' */
	size?: 'sm' | 'md' | 'lg';
	/** Whether the multiselect takes full width @default false */
	fullWidth?: boolean;
	/** Whether the field is required */
	required?: boolean;
	/** Options to display in the dropdown */
	options: MultiSelectOption[];
	/** Selected values (controlled) */
	value?: string[];
	/** Default values (uncontrolled) */
	defaultValue?: string[];
	/** Callback when values change */
	onChange?: (values: string[]) => void;
	/** Callback when input value changes (for filtering) */
	onInputChange?: (inputValue: string) => void;
	/** Whether the multiselect is disabled */
	disabled?: boolean;
	/** Custom filter function */
	filterFn?: (option: MultiSelectOption, inputValue: string) => boolean;
	/** Maximum height of the dropdown in pixels @default 280 */
	maxHeight?: number;
	/** Empty state message when no options match @default 'No options found' */
	emptyState?: ReactNode;
	/** ID for the multiselect input */
	multiSelectId?: string;
	/** Additional className */
	className?: string;
}

/**
 * MultiSelect - Multi-select dropdown component with search and filtering
 *
 * Features:
 * - Accessible: proper ARIA attributes and keyboard navigation
 * - Multiple selection support
 * - Selected items displayed as removable chips
 * - Search/filter functionality
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Custom filter function support
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   label="Countries"
 *   placeholder="Search countries..."
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *   ]}
 *   onChange={(values) => console.log(values)}
 * />
 * ```
 */
export default function MultiSelect(props: Readonly<MultiSelectProps>) {
	const multiSelectData = useMultiSelect(props);
	return <MultiSelectContent {...multiSelectData} />;
}
