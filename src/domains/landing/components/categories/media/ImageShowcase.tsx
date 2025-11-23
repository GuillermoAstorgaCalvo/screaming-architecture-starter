import Image from '@core/ui/media/image/Image';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

/**
 * ImageShowcase - Showcase for Image component
 */
export function ImageShowcase() {
	return (
		<ShowcaseSection
			title="Image"
			description="Optimized image component with lazy loading"
			tags={['media', 'image', 'lazy', 'loading']}
		>
			<div className="space-y-4">
				<Image
					src="https://via.placeholder.com/400x200"
					alt="Placeholder Image"
					width={400}
					height={200}
					className="rounded-lg"
				/>
				<Image
					src="https://via.placeholder.com/300x150"
					alt="Lazy Loaded Image"
					width={300}
					height={150}
					lazy
					showSkeleton
					className="rounded-lg"
				/>
			</div>
		</ShowcaseSection>
	);
}
