import SegmentedControl from '@core/ui/forms/segmented-control/SegmentedControl';
import ComponentSearchBar from '@domains/landing/components/shared/ComponentSearchBar';

import { CATEGORIES } from './landing.constants';
import type { CategoryId } from './landing.types';

interface LandingPageHeaderProps {
	readonly activeCategory: CategoryId;
	readonly onCategoryChange: (category: CategoryId) => void;
	readonly searchQuery: string;
	readonly onSearchChange: (query: string) => void;
	readonly selectedTags: readonly string[];
	readonly onTagToggle: (tag: string) => void;
	readonly allAvailableTags: readonly string[];
}

export function LandingPageHeader({
	activeCategory,
	onCategoryChange,
	searchQuery,
	onSearchChange,
	selectedTags,
	onTagToggle,
	allAvailableTags,
}: Readonly<LandingPageHeaderProps>) {
	return (
		<div className="sticky top-0 z-50 glass-sm border-b border-white/10 backdrop-blur-xl">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-white mb-3 leading-tight">Component Library</h1>
					<p className="text-base text-white/80 leading-relaxed max-w-3xl">
						Interactive showcase and manual testing for all implementations
					</p>
				</div>
				<div className="mb-6">
					<SegmentedControl
						items={CATEGORIES}
						value={activeCategory}
						onValueChange={value => onCategoryChange(value as CategoryId)}
						variant="pills"
						size="lg"
						className="w-full glass-sm border border-white/10 rounded-xl p-1"
					/>
				</div>
				<ComponentSearchBar
					searchQuery={searchQuery}
					onSearchChange={onSearchChange}
					selectedTags={selectedTags}
					onTagToggle={onTagToggle}
					availableTags={allAvailableTags}
				/>
			</div>
		</div>
	);
}
