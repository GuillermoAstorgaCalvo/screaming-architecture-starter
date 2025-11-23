import Text from '@core/ui/text/Text';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function SEOShowcase() {
	return (
		<ShowcaseSection
			title="useSEO"
			description="Set SEO metadata for the page"
			tags={['hook', 'seo', 'metadata']}
		>
			<Text>
				The `useSEO` hook sets page-specific SEO metadata including title, description, and Open
				Graph tags.
			</Text>
			<Text size="sm" className="mt-2 text-muted-foreground">
				Check the page title and meta tags in the browser developer tools to see the SEO metadata.
			</Text>
		</ShowcaseSection>
	);
}
