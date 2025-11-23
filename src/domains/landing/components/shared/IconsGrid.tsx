import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import IconCard from '@domains/landing/components/shared/IconCard';
import type { IconItem } from '@domains/landing/components/shared/icons/types';

interface IconsGridProps {
	groupedIcons: Record<string, IconItem[]>;
	iconSize: string;
	iconColor: string;
}

export default function IconsGrid({ groupedIcons, iconSize, iconColor }: Readonly<IconsGridProps>) {
	if (Object.keys(groupedIcons).length === 0) {
		return (
			<Card variant="outlined" padding="lg" className="text-center">
				<Text className="text-muted-foreground">No icons found matching your search.</Text>
			</Card>
		);
	}

	return (
		<div className="space-y-8">
			{Object.entries(groupedIcons).map(([category, icons]) => (
				<div key={category} className="space-y-4">
					<Text size="lg" className="font-semibold">
						{category}
					</Text>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
						{icons.map(({ name, icon: IconComponent }) => (
							<IconCard
								key={name}
								name={name}
								IconComponent={IconComponent}
								iconSize={iconSize}
								iconColor={iconColor}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
