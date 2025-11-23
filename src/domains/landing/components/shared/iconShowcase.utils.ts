import { actionsIcons } from '@domains/landing/components/shared/icons/actions';
import { businessIcons } from '@domains/landing/components/shared/icons/business';
import { communicationIcons } from '@domains/landing/components/shared/icons/communication';
import { filesIcons } from '@domains/landing/components/shared/icons/files';
import { mediaIcons } from '@domains/landing/components/shared/icons/media';
import { navigationIcons } from '@domains/landing/components/shared/icons/navigation';
import { statusIcons } from '@domains/landing/components/shared/icons/status';
import { systemIcons } from '@domains/landing/components/shared/icons/system';
import { timeIcons } from '@domains/landing/components/shared/icons/time';
import type { IconItem } from '@domains/landing/components/shared/icons/types';
import { userIcons } from '@domains/landing/components/shared/icons/user';

export function filterIcons(
	searchQuery: string,
	selectedCategory: string,
	icons: IconItem[]
): IconItem[] {
	let filtered = icons;

	// Filter by category
	if (selectedCategory !== 'All') {
		filtered = filtered.filter(icon => icon.category === selectedCategory);
	}

	// Filter by search query
	if (searchQuery.trim()) {
		const query = searchQuery.toLowerCase();
		filtered = filtered.filter(
			icon =>
				icon.name.toLowerCase().includes(query) ||
				icon.keywords.some(keyword => keyword.toLowerCase().includes(query))
		);
	}

	return filtered;
}

export function groupIconsByCategory(icons: IconItem[]): Record<string, IconItem[]> {
	const groups: Record<string, IconItem[]> = {};
	for (const icon of icons) {
		const { category } = icon;
		groups[category] ??= [];
		groups[category].push(icon);
	}
	return groups;
}

export function getSizeClasses() {
	return {
		sm: 'h-6 w-6',
		md: 'h-8 w-8',
		lg: 'h-12 w-12',
	};
}

export function getColorClasses() {
	return {
		default: 'text-foreground',
		primary: 'text-primary',
		muted: 'text-muted-foreground',
	};
}

export function getDemoIcons(): Array<{ name: string; IconComponent: IconItem['icon'] }> {
	const allIcons = [
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

	return [
		{ name: 'Search', IconComponent: allIcons.find(i => i.name === 'Search')?.icon },
		{ name: 'Settings', IconComponent: allIcons.find(i => i.name === 'Settings')?.icon },
		{ name: 'Heart', IconComponent: allIcons.find(i => i.name === 'Heart')?.icon },
		{ name: 'Star', IconComponent: allIcons.find(i => i.name === 'Star')?.icon },
	].filter(icon => icon.IconComponent !== undefined) as Array<{
		name: string;
		IconComponent: IconItem['icon'];
	}>;
}
