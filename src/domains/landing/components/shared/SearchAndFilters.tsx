import Input from '@core/ui/forms/input/Input';
import { actionsIcons } from '@domains/landing/components/shared/icons/actions';
import { businessIcons } from '@domains/landing/components/shared/icons/business';
import { CATEGORIES } from '@domains/landing/components/shared/icons/categories';
import { communicationIcons } from '@domains/landing/components/shared/icons/communication';
import { filesIcons } from '@domains/landing/components/shared/icons/files';
import { mediaIcons } from '@domains/landing/components/shared/icons/media';
import { navigationIcons } from '@domains/landing/components/shared/icons/navigation';
import { statusIcons } from '@domains/landing/components/shared/icons/status';
import { systemIcons } from '@domains/landing/components/shared/icons/system';
import { timeIcons } from '@domains/landing/components/shared/icons/time';
import { userIcons } from '@domains/landing/components/shared/icons/user';

const ICONS = [
	...actionsIcons,
	...businessIcons,
	...communicationIcons,
	...filesIcons,
	...mediaIcons,
	...navigationIcons,
	...statusIcons,
	...systemIcons,
	...timeIcons,
	...userIcons,
];

interface SearchAndFiltersProps {
	searchQuery: string;
	selectedCategory: string;
	onSearchChange: (query: string) => void;
	onCategoryChange: (category: string) => void;
}

export default function SearchAndFilters({
	searchQuery,
	selectedCategory,
	onSearchChange,
	onCategoryChange,
}: Readonly<SearchAndFiltersProps>) {
	return (
		<div className="space-y-4">
			<Input
				label="Search Icons"
				placeholder="Search by name or keyword..."
				value={searchQuery}
				onChange={e => onSearchChange(e.target.value)}
			/>

			<div className="flex flex-wrap gap-2">
				{CATEGORIES.map(category => (
					<button
						key={category}
						type="button"
						onClick={() => onCategoryChange(category)}
						className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
							selectedCategory === category
								? 'bg-primary text-primary-foreground'
								: 'bg-surface text-foreground hover:bg-surface-hover border border-border'
						}`}
					>
						{category}
						{category === 'All' ? null : ` (${ICONS.filter(i => i.category === category).length})`}
					</button>
				))}
			</div>
		</div>
	);
}
