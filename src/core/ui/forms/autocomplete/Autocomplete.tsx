import { AutocompleteContent } from '@core/ui/forms/autocomplete/components/AutocompleteContent';
import { useAutocomplete } from '@core/ui/forms/autocomplete/hooks/useAutocomplete';
import type { ReactNode } from 'react';

export interface AutocompleteOption {
	readonly value: string;
	readonly label: ReactNode;
	readonly disabled?: boolean;
}

export interface AutocompleteProps {
	/** Label text for the autocomplete */
	label?: string;
	/** Placeholder text */
	placeholder?: string;
	/** Error message to display */
	error?: string;
	/** Helper text to display */
	helperText?: string;
	/** Size of the autocomplete @default 'md' */
	size?: 'sm' | 'md' | 'lg';
	/** Whether the autocomplete takes full width @default false */
	fullWidth?: boolean;
	/** Whether the field is required */
	required?: boolean;
	/** Options to display in the dropdown */
	options: AutocompleteOption[];
	/** Selected value (controlled) */
	value?: string;
	/** Default value (uncontrolled) */
	defaultValue?: string;
	/** Callback when value changes */
	onChange?: (value: string) => void;
	/** Callback when input value changes (for filtering/search) */
	onInputChange?: (inputValue: string) => void;
	/** Whether the autocomplete is disabled */
	disabled?: boolean;
	/** Custom filter function */
	filterFn?: (option: AutocompleteOption, inputValue: string) => boolean;
	/** Maximum height of the dropdown in pixels @default 280 */
	maxHeight?: number;
	/** Empty state message when no options match @default 'No options found' */
	emptyState?: ReactNode;
	/** ID for the autocomplete input */
	autocompleteId?: string;
	/** Additional className */
	className?: string;
	/** Debounce delay in milliseconds for search @default 300 */
	debounceDelay?: number;
	/** Whether to highlight matches in options @default true */
	highlightMatches?: boolean;
}

/**
 * Autocomplete - Search-as-you-type autocomplete component with debounced search and match highlighting
 *
 * Features:
 * - Accessible: proper ARIA attributes and keyboard navigation
 * - Debounced search: optimized for async search scenarios
 * - Match highlighting: visual highlighting of search matches in options
 * - Search-as-you-type: real-time filtering as user types
 * - Keyboard navigation (Arrow keys, Enter, Escape, Home, End)
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Custom filter function support
 *
 * @example
 * ```tsx
 * <Autocomplete
 *   label="Search Countries"
 *   placeholder="Type to search..."
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *   ]}
 *   onChange={(value) => console.log(value)}
 *   onInputChange={(query) => performSearch(query)}
 * />
 * ```
 */
export default function Autocomplete(props: Readonly<AutocompleteProps>) {
	const autocompleteData = useAutocomplete(props);
	return <AutocompleteContent {...autocompleteData} />;
}
