import Text from '@core/ui/text/Text';
import ScrollToTop from '@core/ui/utilities/scroll-to-top/ScrollToTop';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ScrollToTopShowcase() {
	return (
		<ShowcaseSection
			title="ScrollToTop"
			description="Scroll to top button"
			tags={['utility', 'scroll', 'button']}
		>
			<Text>Scroll down the page to see the scroll-to-top button appear.</Text>
			<ScrollToTop threshold={300} />
		</ShowcaseSection>
	);
}
