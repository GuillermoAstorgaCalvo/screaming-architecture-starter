import { ROUTES } from '@core/config/routes';
import { useTranslation } from '@core/i18n/useTranslation';
import { Link } from 'react-router-dom';

export default function Error404() {
	const { t } = useTranslation('common');

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-xl">
			<h1 className="text-4xl font-bold text-text-primary dark:text-text-primary">
				{t('errors.error404.title')}
			</h1>
			<p className="mt-lg text-lg text-text-secondary dark:text-text-secondary">
				{t('errors.error404.message')}
			</p>
			<Link
				to={ROUTES.HOME}
				className="mt-xl text-primary underline hover:text-primary/90 dark:text-primary dark:hover:text-primary/80"
			>
				{t('errors.error404.returnHome')}
			</Link>
		</main>
	);
}
