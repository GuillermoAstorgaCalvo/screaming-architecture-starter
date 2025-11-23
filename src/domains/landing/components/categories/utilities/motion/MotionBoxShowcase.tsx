import { MotionBoxFadeExample } from './examples/MotionBoxFadeExample';
import { MotionBoxScaleExample } from './examples/MotionBoxScaleExample';
import { MotionBoxSlideExample } from './examples/MotionBoxSlideExample';

export function MotionBoxShowcase() {
	return (
		<>
			<MotionBoxFadeExample />
			<MotionBoxSlideExample />
			<MotionBoxScaleExample />
		</>
	);
}
