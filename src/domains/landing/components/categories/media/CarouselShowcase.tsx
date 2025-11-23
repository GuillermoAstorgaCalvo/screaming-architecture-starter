import Carousel from '@core/ui/media/carousel/Carousel';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

/**
 * CarouselShowcase - Showcase for Carousel component
 */
export function CarouselShowcase() {
	return (
		<ShowcaseSection
			title="Carousel"
			description="Image/content carousel component"
			tags={['media', 'carousel', 'slider', 'image']}
		>
			<Carousel showArrows showDots autoPlay={false}>
				<div className="flex h-48 items-center justify-center bg-primary-100 dark:bg-primary-900">
					<Text className="text-lg font-semibold">Slide 1</Text>
				</div>
				<div className="flex h-48 items-center justify-center bg-secondary-100 dark:bg-secondary-900">
					<Text className="text-lg font-semibold">Slide 2</Text>
				</div>
				<div className="flex h-48 items-center justify-center bg-accent-100 dark:bg-accent-900">
					<Text className="text-lg font-semibold">Slide 3</Text>
				</div>
			</Carousel>
		</ShowcaseSection>
	);
}
