import type { AdvancedFilter } from '@src-types/ui/advancedFilter';

const EMPTY_STRING = '';
const DEFAULT_FILTER_TYPE: AdvancedFilter['type'] = 'text';
const BASE_36_RADIX = 36;
const RANDOM_ID_START_INDEX = 2;
const RANDOM_ID_LENGTH = 7;

/**
 * Helper function for exhaustive type checking
 * This ensures all cases are handled in switch statements
 */
function assertNever(value: never): never {
	throw new Error(`Unhandled case: ${String(value)}`);
}

/**
 * Creates default properties for a filter based on its type
 */
export function createFilterPropsByType(type: AdvancedFilter['type']): Partial<AdvancedFilter> {
	switch (type) {
		case 'select':
		case 'multi-select': {
			return { options: [] };
		}
		case 'text':
		case 'date': {
			return { value: EMPTY_STRING };
		}
		case 'date-range': {
			return { startValue: EMPTY_STRING, endValue: EMPTY_STRING };
		}
		default: {
			// Exhaustive check - TypeScript will error if a new type is added and not handled
			return assertNever(type);
		}
	}
}

/**
 * Creates a new filter object with default properties
 */
export function createNewFilter(label: string, type: AdvancedFilter['type']): AdvancedFilter {
	const trimmedLabel = label.trim();
	if (!trimmedLabel) {
		throw new Error('Filter label cannot be empty');
	}

	const filterProps = createFilterPropsByType(type);
	const randomSuffix = Math.random()
		.toString(BASE_36_RADIX)
		.slice(RANDOM_ID_START_INDEX, RANDOM_ID_START_INDEX + RANDOM_ID_LENGTH);
	return {
		id: `filter-${Date.now()}-${randomSuffix}`,
		label: trimmedLabel,
		type,
		...filterProps,
	} as AdvancedFilter;
}

/**
 * Gets the default filter type
 */
export function getDefaultFilterType(): AdvancedFilter['type'] {
	return DEFAULT_FILTER_TYPE;
}
