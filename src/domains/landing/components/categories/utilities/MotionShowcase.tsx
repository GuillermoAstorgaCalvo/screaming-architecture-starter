import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

import { MOTION_LIST_ITEMS } from './constants/constants';
import { AnimatePresenceShowcase } from './motion/AnimatePresenceShowcase';
import { LayoutGroupInfo } from './motion/LayoutGroupInfo';
import { MotionAccordionShowcase } from './motion/MotionAccordionShowcase';
import { MotionBoxShowcase } from './motion/MotionBoxShowcase';
import { MotionFadeShowcase } from './motion/MotionFadeShowcase';
import { MotionPresenceShowcase } from './motion/MotionPresenceShowcase';
import { MotionScaleShowcase } from './motion/MotionScaleShowcase';
import { MotionSlideShowcase } from './motion/MotionSlideShowcase';
import { MotionStaggerShowcase } from './motion/MotionStaggerShowcase';

interface MotionShowcaseProps {
	readonly motionVisible: boolean;
	readonly setMotionVisible: (value: boolean) => void;
	readonly motionPresenceVisible: boolean;
	readonly setMotionPresenceVisible: (value: boolean) => void;
	readonly motionAccordionOpen: boolean;
	readonly setMotionAccordionOpen: (value: boolean) => void;
}

export function MotionShowcase({
	motionVisible,
	setMotionVisible,
	motionPresenceVisible,
	setMotionPresenceVisible,
	motionAccordionOpen,
	setMotionAccordionOpen,
}: MotionShowcaseProps) {
	return (
		<div className="space-y-8">
			<ShowcaseSection
				title="Motion"
				description="Animation components with Framer Motion"
				tags={['utility', 'motion', 'animation', 'framer']}
			>
				<div className="space-y-4">
					<MotionBoxShowcase />
					<AnimatePresenceShowcase
						motionVisible={motionVisible}
						setMotionVisible={setMotionVisible}
					/>
					<MotionPresenceShowcase
						motionPresenceVisible={motionPresenceVisible}
						setMotionPresenceVisible={setMotionPresenceVisible}
					/>
					<MotionAccordionShowcase
						motionAccordionOpen={motionAccordionOpen}
						setMotionAccordionOpen={setMotionAccordionOpen}
					/>
					<MotionStaggerShowcase motionListItems={MOTION_LIST_ITEMS} />
					<MotionFadeShowcase />
					<MotionSlideShowcase />
					<MotionScaleShowcase />
					<LayoutGroupInfo />
				</div>
			</ShowcaseSection>
		</div>
	);
}
