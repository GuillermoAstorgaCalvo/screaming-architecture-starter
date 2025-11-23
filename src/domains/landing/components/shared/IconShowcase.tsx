import Text from '@core/ui/text/Text';
import { actionsIcons } from '@domains/landing/components/shared/icons/actions';
import { businessIcons } from '@domains/landing/components/shared/icons/business';
import { communicationIcons } from '@domains/landing/components/shared/icons/communication';
import { filesIcons } from '@domains/landing/components/shared/icons/files';
import { mediaIcons } from '@domains/landing/components/shared/icons/media';
import { navigationIcons } from '@domains/landing/components/shared/icons/navigation';
import { statusIcons } from '@domains/landing/components/shared/icons/status';
import { systemIcons } from '@domains/landing/components/shared/icons/system';
import { timeIcons } from '@domains/landing/components/shared/icons/time';
import { userIcons } from '@domains/landing/components/shared/icons/user';
import IconsGrid from '@domains/landing/components/shared/IconsGrid';
import type { IconColor, IconSize } from '@domains/landing/components/shared/iconShowcase.types';
import {
	filterIcons,
	getColorClasses,
	getSizeClasses,
	groupIconsByCategory,
} from '@domains/landing/components/shared/iconShowcase.utils';
import InteractiveDemo from '@domains/landing/components/shared/InteractiveDemo';
import SearchAndFilters from '@domains/landing/components/shared/SearchAndFilters';
import { useMemo, useState } from 'react';

interface IconShowcaseProps {
	description?: string;
}

const ALL_ICONS = [
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

/**
 * IconShowcase - Comprehensive icon gallery with search and filtering
 */
export default function IconShowcase({ description }: Readonly<IconShowcaseProps>) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [iconSize, setIconSize] = useState<IconSize>('md');
	const [iconColor, setIconColor] = useState<IconColor>('default');

	const filteredIcons = useMemo(
		() => filterIcons(searchQuery, selectedCategory, ALL_ICONS),
		[searchQuery, selectedCategory]
	);

	const groupedIcons = useMemo(() => groupIconsByCategory(filteredIcons), [filteredIcons]);
	const sizeClasses = getSizeClasses();
	const colorClasses = getColorClasses();
	const currentSizeClass = sizeClasses[iconSize];
	const currentColorClass = colorClasses[iconColor];

	return (
		<div className="space-y-6">
			{description ? <Text className="text-muted-foreground">{description}</Text> : null}

			<InteractiveDemo
				iconSize={iconSize}
				iconColor={iconColor}
				onSizeChange={setIconSize}
				onColorChange={setIconColor}
			/>

			<SearchAndFilters
				searchQuery={searchQuery}
				selectedCategory={selectedCategory}
				onSearchChange={setSearchQuery}
				onCategoryChange={setSelectedCategory}
			/>

			<Text size="sm" className="text-muted-foreground">
				Showing {filteredIcons.length} of {ALL_ICONS.length} icons
			</Text>

			<IconsGrid
				groupedIcons={groupedIcons}
				iconSize={currentSizeClass}
				iconColor={currentColorClass}
			/>
		</div>
	);
}
