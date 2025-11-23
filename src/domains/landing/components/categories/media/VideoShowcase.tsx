import Video from '@core/ui/media/video/Video';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

/**
 * VideoShowcase - Showcase for Video component
 */
export function VideoShowcase() {
	return (
		<ShowcaseSection
			title="Video"
			description="Video player component"
			tags={['media', 'video', 'player']}
		>
			<Video
				src="https://www.w3schools.com/html/mov_bbb.mp4"
				title="Sample Video"
				controls
				className="w-full rounded-lg"
			/>
		</ShowcaseSection>
	);
}
