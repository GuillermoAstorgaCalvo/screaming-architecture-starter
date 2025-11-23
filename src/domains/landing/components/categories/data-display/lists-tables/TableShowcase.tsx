import Table from '@core/ui/data-display/table/Table';
import {
	TABLE_COLUMNS,
	TABLE_DATA,
} from '@domains/landing/components/categories/data-display/constants/constants';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function TableShowcase() {
	return (
		<ShowcaseSection
			title="Table"
			description="Table component for displaying tabular data"
			tags={['data', 'table', 'tabular']}
		>
			<Table columns={TABLE_COLUMNS} data={TABLE_DATA} striped hoverable />
		</ShowcaseSection>
	);
}
