import Marquee from '@core/ui/media/marquee/Marquee';
import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

/**
 * MarqueeShowcase - Showcase for Marquee component
 */
export function MarqueeShowcase() {
	return (
		<ShowcaseSection
			title="Marquee"
			description="Auto-scrolling text/banner component"
			tags={['media', 'marquee', 'scroll', 'text', 'animation']}
		>
			<Marquee direction="left" speed={50} pauseOnHover>
				<div className="flex items-center gap-4 px-4">
					<Text className="font-semibold">Breaking News:</Text>
					<Text>Important announcement - This is a scrolling marquee text</Text>
				</div>
			</Marquee>
		</ShowcaseSection>
	);
}
