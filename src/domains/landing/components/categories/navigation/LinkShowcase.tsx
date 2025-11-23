import Link from '@core/ui/navigation/link/Link';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function LinkShowcase() {
	return (
		<ShowcaseSection
			title="Link"
			description="Navigation link component"
			tags={['navigation', 'link', 'route']}
		>
			<div className="flex flex-wrap gap-4">
				<Link to="/">Home</Link>
				<Link to="/about">About</Link>
				<Link to="/contact" target="_blank" showExternalIcon>
					Contact (External)
				</Link>
			</div>
		</ShowcaseSection>
	);
}
