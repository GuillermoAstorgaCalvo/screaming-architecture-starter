import HelperText from '@core/ui/forms/helper-text/HelperText';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function HelperTextSection() {
	return (
		<ShowcaseSection
			title="HelperText"
			description="Helper text component"
			tags={['form', 'helper', 'text']}
		>
			<div className="space-y-4">
				<HelperText id="helper-1">This is helper text</HelperText>
				<HelperText id="helper-2" size="sm">
					Small helper text
				</HelperText>
				<HelperText id="helper-3" size="lg">
					Large helper text
				</HelperText>
			</div>
		</ShowcaseSection>
	);
}
