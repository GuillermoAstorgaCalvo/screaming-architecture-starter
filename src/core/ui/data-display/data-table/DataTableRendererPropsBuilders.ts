import {
	extractColumnParams,
	extractFilterParams,
	extractPaginationParams,
	extractSortSelectionParams,
} from './DataTableParamExtractors';
import {
	buildBaseProps,
	buildColumnProps,
	buildFilterProps,
	buildPaginationProps,
	buildSortAndSelectionProps,
	buildStyleProps,
} from './DataTablePropBuilders';
import type { RendererPropsParams } from './DataTableTypes';

/**
 * Builds feature props (filter, column, sort/selection, pagination) from renderer params
 */
export function buildFeatureProps<T>(params: RendererPropsParams<T>) {
	const filterParams = extractFilterParams(params);
	const columnParams = extractColumnParams(params);
	const sortSelectionParams = extractSortSelectionParams(params);
	const paginationParams = extractPaginationParams(params);

	const filterProps = buildFilterProps(filterParams);
	const columnProps = buildColumnProps<T>(columnParams);
	const sortAndSelectionProps = buildSortAndSelectionProps<T>(sortSelectionParams);
	const paginationProps = buildPaginationProps(paginationParams);

	return {
		...filterProps,
		...columnProps,
		...sortAndSelectionProps,
		...paginationProps,
	};
}

/**
 * Builds all renderer props from renderer params
 */
export function buildRendererProps<T>(params: RendererPropsParams<T>) {
	const {
		displayData,
		initialData,
		emptyMessage,
		dataTableId,
		className,
		size,
		striped,
		hoverable,
		rowClassName,
		tableProps,
	} = params;

	const baseProps = buildBaseProps({
		displayData,
		initialData,
		emptyMessage,
		dataTableId,
		className,
		size,
	});

	const styleProps = buildStyleProps({
		striped,
		hoverable,
		rowClassName,
	});

	const featureProps = buildFeatureProps(params);

	return {
		...baseProps,
		...featureProps,
		...styleProps,
		tableProps,
	};
}
