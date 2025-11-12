import { useTranslation } from '@core/i18n/useTranslation';
import Container from '@core/ui/container/Container';
import type { ThemeConfig } from '@src-types/layout';

export interface LandingPageProps {
	readonly theme: ThemeConfig;
}

export default function LandingPage({ theme: _theme }: LandingPageProps) {
	const { t } = useTranslation('landing');

	return (
		<main>
			<Container maxWidth="6xl">
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
							{t('hero.title')}
						</h1>
						<p className="mt-2 text-gray-600 dark:text-gray-400">{t('hero.subtitle')}</p>
					</div>
				</div>
			</Container>
		</main>
	);
}
