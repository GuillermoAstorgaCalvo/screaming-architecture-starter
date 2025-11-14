import AppLayout from '@app/components/AppLayout';
import { withTheme } from '@app/components/PageWrapper';
import Error404 from '@app/pages/Error404';
import type { AnalyticsPageView } from '@core/ports/AnalyticsPort';
import { useAnalytics } from '@core/providers/analytics/useAnalytics';
import { buildRoute } from '@core/router/routes.gen';
import { DefaultLoadingFallback } from '@core/ui/utilities/loadable/components/loadableFallback';
import { RouteTransition } from '@core/ui/utilities/motion/components/RouteTransition';
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

const LandingPageBase = lazy(() => import('@domains/landing/pages/LandingPage'));

const LandingPage = withTheme(LandingPageBase);

export default function Router() {
	const analytics = useAnalytics();
	const location = useLocation();

	useEffect(() => {
		const path = `${location.pathname}${location.search}${location.hash}`;

		const pageView: AnalyticsPageView = { path };

		const documentTitle = 'document' in globalThis ? globalThis.document.title : undefined;

		if (documentTitle !== undefined) {
			pageView.title = documentTitle;
		}

		const windowLocation = 'window' in globalThis ? globalThis.window.location.href : undefined;

		if (windowLocation !== undefined) {
			pageView.location = windowLocation;
		}

		analytics.trackPageView(pageView);
	}, [analytics, location.hash, location.pathname, location.search]);

	return (
		<AppLayout>
			<Suspense fallback={<DefaultLoadingFallback />}>
				<RouteTransition locationKey={location.pathname}>
					<Routes location={location}>
						<Route path={buildRoute('HOME')} element={<LandingPage />} />
						<Route path="*" element={<Error404 />} />
					</Routes>
				</RouteTransition>
			</Suspense>
		</AppLayout>
	);
}
