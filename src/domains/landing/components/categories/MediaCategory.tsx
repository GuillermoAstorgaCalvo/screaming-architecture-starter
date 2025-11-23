import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';

import { CarouselShowcase } from './media/CarouselShowcase';
import { ImageShowcase } from './media/ImageShowcase';
import { LightboxShowcase } from './media/LightboxShowcase';
import { MapShowcase } from './media/MapShowcase';
import { MarqueeShowcase } from './media/MarqueeShowcase';
import { QRCodeShowcase } from './media/QRCodeShowcase';
import { SignaturePadShowcase } from './media/SignaturePadShowcase';
import { VideoShowcase } from './media/VideoShowcase';

/**
 * MediaCategory - Showcase for media components
 */
export default function MediaCategory() {
	return (
		<div className="space-y-8">
			<div>
				<Heading as="h1" size="lg" className="mb-2 text-white">
					Media
				</Heading>
				<Text className="text-white/70">
					Components for images, videos, carousels, and rich media content
				</Text>
			</div>

			<ImageShowcase />
			<VideoShowcase />
			<QRCodeShowcase />
			<CarouselShowcase />
			<LightboxShowcase />
			<MarqueeShowcase />
			<SignaturePadShowcase />
			<MapShowcase />
		</div>
	);
}
