import Text from '@core/ui/text/Text';
import { MotionBox } from '@core/ui/utilities/motion/MotionBox';

export function MotionBoxSlideExample() {
	return (
		<div className="space-y-2">
			<Text size="sm" className="font-semibold">
				MotionBox - Slide Animation
			</Text>
			<MotionBox
				variant="slide"
				initial={false}
				className="p-4 bg-secondary-100 dark:bg-secondary-900 rounded-lg"
			>
				<Text>This box slides in from the left</Text>
			</MotionBox>
		</div>
	);
}
