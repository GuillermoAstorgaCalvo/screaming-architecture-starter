import DescriptionList, {
	DescriptionDetails,
	DescriptionTerm,
} from '@core/ui/data-display/description-list/DescriptionList';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function DescriptionListShowcase() {
	return (
		<ShowcaseSection
			title="DescriptionList"
			description="Description list component"
			tags={['data', 'list', 'description']}
		>
			<DescriptionList>
				<DescriptionTerm>Name</DescriptionTerm>
				<DescriptionDetails>John Doe</DescriptionDetails>
				<DescriptionTerm>Email</DescriptionTerm>
				<DescriptionDetails>john@example.com</DescriptionDetails>
				<DescriptionTerm>Role</DescriptionTerm>
				<DescriptionDetails>Developer</DescriptionDetails>
			</DescriptionList>
		</ShowcaseSection>
	);
}
