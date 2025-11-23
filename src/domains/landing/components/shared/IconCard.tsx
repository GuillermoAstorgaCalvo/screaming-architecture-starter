import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import CopyButton from '@core/ui/utilities/copy-button/CopyButton';
import type { IconItem } from '@domains/landing/components/shared/icons/types';
import { memo } from 'react';

interface IconCardProps {
	name: string;
	IconComponent: IconItem['icon'];
	iconSize: string;
	iconColor: string;
}

// Memoized icon card component for performance
const IconCard = memo(({ name, IconComponent, iconSize, iconColor }: IconCardProps) => {
	return (
		<Card
			variant="outlined"
			padding="md"
			className="group flex flex-col items-center justify-center gap-2 transition-all hover:border-primary hover:shadow-md"
		>
			<IconComponent className={`${iconSize} ${iconColor}`} />
			<div className="flex w-full items-center justify-between gap-2">
				<Text size="sm" className="font-mono text-xs">
					{name}
				</Text>
				<CopyButton text={name} size="sm" />
			</div>
		</Card>
	);
});

IconCard.displayName = 'IconCard';

export default IconCard;
