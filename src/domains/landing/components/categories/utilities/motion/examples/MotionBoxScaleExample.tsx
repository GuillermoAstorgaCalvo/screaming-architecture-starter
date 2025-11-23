import Text from '@core/ui/text/Text';
import { MotionBox } from '@core/ui/utilities/motion/MotionBox';

export function MotionBoxScaleExample() {
	return (
		<div className="space-y-2">
			<Text size="sm" className="font-semibold">
				MotionBox - Scale Animation
			</Text>
			<MotionBox
				variant="scale"
				initial={false}
				className="p-4 bg-accent-100 dark:bg-accent-900 rounded-lg"
			>
				<Text>This box scales in on mount</Text>
			</MotionBox>
		</div>
	);
}
