import i18n from '@core/i18n/i18n';
import Input from '@core/ui/forms/input/Input';

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
	placeholder = i18n.t('common.searchPlaceholder', { ns: 'common' }),
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
