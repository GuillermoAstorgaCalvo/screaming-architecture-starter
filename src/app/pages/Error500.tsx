import { ROUTES } from '@core/config/routes';
import { Link } from 'react-router-dom';

export default function Error500() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-6">
			<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">500</h1>
			<p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Internal server error</p>
			<Link
				to={ROUTES.HOME}
				className="mt-6 text-primary underline hover:text-primary/90 dark:text-primary dark:hover:text-primary/80"
			>
				Return to Home
			</Link>
		</main>
	);
}
