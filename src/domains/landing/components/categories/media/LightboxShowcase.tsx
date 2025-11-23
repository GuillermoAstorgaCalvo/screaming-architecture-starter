import Button from '@core/ui/button/Button';
import Lightbox from '@core/ui/media/lightbox/Lightbox';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';
import { useState } from 'react';

import { LIGHTBOX_IMAGES } from './constants/constants';

/**
 * LightboxShowcase - Showcase for Lightbox component
 */
export function LightboxShowcase() {
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	return (
		<ShowcaseSection
			title="Lightbox"
			description="Fullscreen image gallery viewer"
			tags={['media', 'lightbox', 'gallery', 'image']}
		>
			<div className="space-y-4">
				<Button variant="primary" onClick={() => setLightboxOpen(true)}>
					Open Lightbox
				</Button>
				<Lightbox
					isOpen={lightboxOpen}
					onClose={() => setLightboxOpen(false)}
					images={LIGHTBOX_IMAGES}
					currentIndex={lightboxIndex}
					onIndexChange={setLightboxIndex}
					showCounter
					showCaption
				/>
			</div>
		</ShowcaseSection>
	);
}
