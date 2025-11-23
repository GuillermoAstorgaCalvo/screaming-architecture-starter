import SegmentedControl from '@core/ui/forms/segmented-control/SegmentedControl';
import Text from '@core/ui/text/Text';
import type { IconColor } from '@domains/landing/components/shared/iconShowcase.types';

interface IconColorControlProps {
	iconColor: IconColor;
	onColorChange: (color: IconColor) => void;
}

export function IconColorControl({ iconColor, onColorChange }: Readonly<IconColorControlProps>) {
	return (
		<div>
			<Text size="sm" className="mb-2 font-medium">
				Icon Color
			</Text>
			<SegmentedControl
				items={[
					{ id: 'default', label: 'Default' },
					{ id: 'primary', label: 'Primary' },
					{ id: 'muted', label: 'Muted' },
				]}
				value={iconColor}
				onValueChange={value => onColorChange(value as IconColor)}
				variant="pills"
				size="sm"
			/>
		</div>
	);
}
