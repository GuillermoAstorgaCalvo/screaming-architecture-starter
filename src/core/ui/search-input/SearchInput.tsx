import type { SearchInputProps } from '@src-types/ui/forms-inputs';

import { SearchInputContent } from './SearchInputContent';
import { useSearchInputProps } from './useSearchInput';

/**
 * SearchInput - Search input with search icon and clear button
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Search icon on the left
 * - Clear button on the right (shown when value is present)
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Optional clear button (can be disabled)
 *
 * @example
 * ```tsx
 * <SearchInput
 *   label="Search"
 *   placeholder="Search for items..."
 *   value={searchQuery}
 *   onChange={(e) => setSearchQuery(e.target.value)}
 *   error={errors.search}
 *   helperText="Enter keywords to search"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <SearchInput
 *   placeholder="Search..."
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   size="lg"
 *   fullWidth
 *   showClearButton={false}
 * />
 * ```
 */
export default function SearchInput(props: Readonly<SearchInputProps>) {
	const { state, fieldProps, label, error, helperText, required, fullWidth } = useSearchInputProps({
		props,
	});
	return (
		<SearchInputContent
			state={state}
			fieldProps={fieldProps}
			label={label}
			error={error}
			helperText={helperText}
			required={required}
			fullWidth={fullWidth}
		/>
	);
}
