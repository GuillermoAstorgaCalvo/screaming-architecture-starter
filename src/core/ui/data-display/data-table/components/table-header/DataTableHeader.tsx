import i18n from '@core/i18n/i18n';
import type { DataTableHeaderProps } from '@core/ui/data-display/data-table/components/table-header/DataTableHeader.types';
import { HeaderRow } from '@core/ui/data-display/data-table/components/table-header/DataTableHeaderRow';

/**
 * DataTableHeader - Enhanced table header with sorting and selection
 */
export function DataTableHeader<T>(props: Readonly<DataTableHeaderProps<T>>) {
	const { selectAllLabel = i18n.t('common.selectAllRows', { ns: 'common' }), ...rowProps } = props;
	return (
		<thead>
			<HeaderRow {...rowProps} selectAllLabel={selectAllLabel} />
		</thead>
	);
}

export type { DataTableHeaderProps } from '@core/ui/data-display/data-table/components/table-header/DataTableHeader.types';
