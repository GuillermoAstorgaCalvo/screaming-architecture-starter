import type { ReactNode } from 'react';

import { ComboboxContent } from './ComboboxContent';
import { useCombobox } from './useCombobox';

export interface ComboboxOption {
	readonly value: string;
	readonly label: ReactNode;
	readonly disabled?: boolean;
}

export interface ComboboxProps {
	/** Label text for the combobox */
	label?: string;
	/** Placeholder text */
	placeholder?: string;
	/** Error message to display */
	error?: string;
	/** Helper text to display */
	helperText?: string;
	/** Size of the combobox @default 'md' */
	size?: 'sm' | 'md' | 'lg';
	/** Whether the combobox takes full width @default false */
	fullWidth?: boolean;
	/** Whether the field is required */
	required?: boolean;
	/** Options to display in the dropdown */
	options: ComboboxOption[];
	/** Selected value (controlled) */
	value?: string;
	/** Default value (uncontrolled) */
	defaultValue?: string;
	/** Callback when value changes */
	onChange?: (value: string) => void;
	/** Callback when input value changes (for filtering) */
	onInputChange?: (inputValue: string) => void;
	/** Whether the combobox is disabled */
	disabled?: boolean;
	/** Custom filter function */
	filterFn?: (option: ComboboxOption, inputValue: string) => boolean;
	/** Maximum height of the dropdown in pixels @default 280 */
	maxHeight?: number;
	/** Empty state message when no options match @default 'No options found' */
	emptyState?: ReactNode;
	/** ID for the combobox input */
	comboboxId?: string;
	/** Additional className */
	className?: string;
}

/**
 * Combobox - Autocomplete/combobox component with search and filtering
 *
 * Features:
 * - Accessible: proper ARIA attributes and keyboard navigation
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
 * <Combobox
 *   label="Country"
 *   placeholder="Search countries..."
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *   ]}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
export default function Combobox(props: Readonly<ComboboxProps>) {
	const comboboxData = useCombobox(props);
	return <ComboboxContent {...comboboxData} />;
}
