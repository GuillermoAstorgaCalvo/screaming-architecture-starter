import ErrorText from '@core/ui/forms/error-text/ErrorText';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function ErrorTextSection() {
	return (
		<ShowcaseSection
			title="ErrorText"
			description="Error message component"
			tags={['form', 'validation', 'error', 'helper']}
		>
			<div className="space-y-4">
				<ErrorText id="error-1">This is an error message</ErrorText>
				<ErrorText id="error-2" size="sm">
					Small error message
				</ErrorText>
				<ErrorText id="error-3" size="lg">
					Large error message
				</ErrorText>
			</div>
		</ShowcaseSection>
	);
}
