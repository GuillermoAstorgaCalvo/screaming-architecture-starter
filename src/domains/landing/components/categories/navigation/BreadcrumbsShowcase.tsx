import Breadcrumbs from '@core/ui/navigation/breadcrumbs/Breadcrumbs';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function BreadcrumbsShowcase() {
	return (
		<ShowcaseSection
			title="Breadcrumbs"
			description="Breadcrumbs navigation component"
			tags={['navigation', 'breadcrumbs', 'path']}
		>
			<Breadcrumbs
				items={[
					{ label: 'Home', to: '/' },
					{ label: 'Category', to: '/category' },
					{ label: 'Current Page', isCurrentPage: true },
				]}
			/>
		</ShowcaseSection>
	);
}
