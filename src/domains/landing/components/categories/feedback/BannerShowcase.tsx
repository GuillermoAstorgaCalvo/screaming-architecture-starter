import Banner from '@core/ui/feedback/banner/Banner';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function BannerShowcase() {
	return (
		<ShowcaseSection
			title="Banner"
			description="Static banner component for announcements"
			tags={['feedback', 'banner', 'announcement']}
		>
			<div className="space-y-4">
				<Banner
					intent="info"
					title="Information Banner"
					description="This is an informational banner."
				/>
				<Banner
					intent="success"
					title="Success Banner"
					description="Operation completed successfully."
				/>
				<Banner intent="warning" title="Warning Banner" description="Please review this warning." />
				<Banner intent="error" title="Error Banner" description="An error has occurred." />
			</div>
		</ShowcaseSection>
	);
}
