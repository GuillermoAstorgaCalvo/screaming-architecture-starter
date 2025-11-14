import { useSEO } from '@core/hooks/seo/useSEO';
import { useTranslation } from '@core/i18n/useTranslation';
import Container from '@core/ui/container/Container';
import type { ThemeConfig } from '@src-types/layout';

export interface LandingPageProps {
	readonly theme: ThemeConfig;
}

export default function LandingPage({ theme: _theme }: LandingPageProps) {
	const { t } = useTranslation('landing');

	useSEO({
		title: t('hero.title'),
		description: t('hero.subtitle'),
	});

	return (
		<main>
			<Container maxWidth="6xl">
				<div className="space-y-xl">
					<div>
						<h1 className="text-3xl font-bold text-text-primary dark:text-text-primary">
							{t('hero.title')}
						</h1>
						<p className="mt-sm text-text-secondary dark:text-text-secondary">
							{t('hero.subtitle')}
						</p>
					</div>
				</div>
			</Container>
		</main>
	);
}
