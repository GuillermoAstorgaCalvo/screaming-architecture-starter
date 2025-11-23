import LanguageSelectorFlag from '@core/ui/language-selector/LanguageSelectorFlag';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function LanguageSelectorFlagShowcase() {
	return (
		<ShowcaseSection
			title="LanguageSelectorFlag"
			description="Language selector with flag emojis component"
			tags={['language', 'i18n', 'selector', 'flag']}
		>
			<div className="space-y-4">
				<LanguageSelectorFlag />
				<LanguageSelectorFlag size="sm" showLabel={false} />
			</div>
		</ShowcaseSection>
	);
}
