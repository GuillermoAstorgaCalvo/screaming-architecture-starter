import SegmentedControl from '@core/ui/forms/segmented-control/SegmentedControl';
import Text from '@core/ui/text/Text';
import type { IconSize } from '@domains/landing/components/shared/iconShowcase.types';

interface IconSizeControlProps {
	iconSize: IconSize;
	onSizeChange: (size: IconSize) => void;
}

export function IconSizeControl({ iconSize, onSizeChange }: Readonly<IconSizeControlProps>) {
	return (
		<div>
			<Text size="sm" className="mb-2 font-medium">
				Icon Size
			</Text>
			<SegmentedControl
				items={[
					{ id: 'sm', label: 'Small' },
					{ id: 'md', label: 'Medium' },
					{ id: 'lg', label: 'Large' },
				]}
				value={iconSize}
				onValueChange={value => onSizeChange(value as IconSize)}
				variant="pills"
				size="sm"
			/>
		</div>
	);
}
