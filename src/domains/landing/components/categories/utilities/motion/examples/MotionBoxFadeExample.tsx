import Text from '@core/ui/text/Text';
import { MotionBox } from '@core/ui/utilities/motion/MotionBox';

export function MotionBoxFadeExample() {
	return (
		<div className="space-y-2">
			<Text size="sm" className="font-semibold">
				MotionBox - Fade Animation
			</Text>
			<MotionBox
				variant="fade"
				initial={false}
				className="p-4 bg-primary-100 dark:bg-primary-900 rounded-lg"
			>
				<Text>This box fades in on mount</Text>
			</MotionBox>
		</div>
	);
}
