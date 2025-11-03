import AppLayout from '@app/components/AppLayout';
import { withTheme } from '@app/components/PageWrapper';
import Error404 from '@app/pages/Error404';
import { ROUTES } from '@core/config/routes';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const LandingPageBase = lazy(() => import('@domains/landing/pages/LandingPage'));

const LandingPage = withTheme(LandingPageBase);

function LoadingFallback() {
	return (
		<div className="flex items-center justify-center p-6" aria-live="polite" aria-label="Loading">
			<p className="text-gray-600 dark:text-gray-400">Loading...</p>
		</div>
	);
}

export default function Router() {
	return (
		<AppLayout>
			<Suspense fallback={<LoadingFallback />}>
				<Routes>
					<Route path={ROUTES.HOME} element={<LandingPage />} />
					<Route path="*" element={<Error404 />} />
				</Routes>
			</Suspense>
		</AppLayout>
	);
}
