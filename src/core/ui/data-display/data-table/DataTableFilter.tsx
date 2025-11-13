import Input from '@core/ui/input/Input';

export interface DataTableFilterProps {
	globalSearch: string;
	onGlobalSearchChange: (value: string) => void;
	placeholder?: string;
	className?: string;
}

/**
 * DataTableFilter - Global search filter component for DataTable
 */
export function DataTableFilter({
	globalSearch,
	onGlobalSearchChange,
	placeholder = 'Search...',
	className,
}: Readonly<DataTableFilterProps>) {
	return (
		<div className={className}>
			<Input
				type="text"
				value={globalSearch}
				onChange={e => onGlobalSearchChange(e.target.value)}
				placeholder={placeholder}
				className="w-full"
			/>
		</div>
	);
}
