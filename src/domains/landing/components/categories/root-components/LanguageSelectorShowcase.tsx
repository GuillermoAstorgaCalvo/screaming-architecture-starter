import LanguageSelector from '@core/ui/language-selector/LanguageSelector';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function LanguageSelectorShowcase() {
	return (
		<ShowcaseSection
			title="LanguageSelector"
			description="Language selector component"
			tags={['language', 'i18n', 'selector']}
		>
			<div className="space-y-4">
				<LanguageSelector />
			</div>
		</ShowcaseSection>
	);
}
