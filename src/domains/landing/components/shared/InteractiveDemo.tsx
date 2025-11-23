import Card from '@core/ui/data-display/card/Card';
import Text from '@core/ui/text/Text';
import type { IconColor, IconSize } from '@domains/landing/components/shared/iconShowcase.types';
import {
	getColorClasses,
	getSizeClasses,
} from '@domains/landing/components/shared/iconShowcase.utils';

import { IconColorControl } from './InteractiveDemo/IconColorControl';
import { IconPreview } from './InteractiveDemo/IconPreview';
import { IconSizeControl } from './InteractiveDemo/IconSizeControl';

interface InteractiveDemoProps {
	iconSize: IconSize;
	iconColor: IconColor;
	onSizeChange: (size: IconSize) => void;
	onColorChange: (color: IconColor) => void;
}

export default function InteractiveDemo({
	iconSize,
	iconColor,
	onSizeChange,
	onColorChange,
}: Readonly<InteractiveDemoProps>) {
	const sizeClasses = getSizeClasses();
	const colorClasses = getColorClasses();
	const currentSizeClass = sizeClasses[iconSize];
	const currentColorClass = colorClasses[iconColor];

	return (
		<Card variant="outlined" padding="lg" className="space-y-4">
			<Text size="lg" className="font-semibold">
				Interactive Demo
			</Text>
			<Text size="sm" className="text-muted-foreground">
				Try different sizes and colors to see how icons look
			</Text>

			<div className="space-y-4">
				<IconSizeControl iconSize={iconSize} onSizeChange={onSizeChange} />
				<IconColorControl iconColor={iconColor} onColorChange={onColorChange} />
				<IconPreview sizeClass={currentSizeClass} colorClass={currentColorClass} />
			</div>
		</Card>
	);
}
