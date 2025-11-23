import AspectRatio from '@core/ui/layout/aspect-ratio/AspectRatio';
import Image from '@core/ui/media/image/Image';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

import { ASPECT_RATIO_1_1, ASPECT_RATIO_4_3, ASPECT_RATIO_16_9 } from './constants/constants';

export function AspectRatioShowcase() {
	return (
		<ShowcaseSection
			title="AspectRatio"
			description="Maintain aspect ratio for content"
			tags={['layout', 'aspect', 'ratio', 'image']}
		>
			<div className="space-y-4">
				<AspectRatio ratio={ASPECT_RATIO_16_9}>
					<Image
						src="https://via.placeholder.com/800x450"
						alt="16:9 Image"
						className="h-full w-full object-cover"
					/>
				</AspectRatio>
				<AspectRatio ratio={ASPECT_RATIO_1_1}>
					<div className="flex h-full w-full items-center justify-center bg-surface-200">
						<Text>Square (1:1)</Text>
					</div>
				</AspectRatio>
				<AspectRatio ratio={ASPECT_RATIO_4_3}>
					<div className="flex h-full w-full items-center justify-center bg-surface-200">
						<Text>4:3 Ratio</Text>
					</div>
				</AspectRatio>
			</div>
		</ShowcaseSection>
	);
}
