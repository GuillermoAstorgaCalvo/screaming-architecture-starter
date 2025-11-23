import { DefaultLoadingFallback } from '@core/ui/utilities/loadable/components/loadableFallback';
import { type JSX, lazy, type LazyExoticComponent, Suspense } from 'react';

import type { CategoryId } from './landing.types';

// Lazy load category components to enable code splitting
// This prevents all category components (and their heavy dependencies like charts, editor, etc.)
// from being bundled into the initial LandingPage chunk
const DataDisplayCategory = lazy(
	() => import('@domains/landing/components/categories/DataDisplayCategory')
);
const FeedbackCategory = lazy(
	() => import('@domains/landing/components/categories/FeedbackCategory')
);
const FormsCategory = lazy(() => import('@domains/landing/components/categories/FormsCategory'));
const HooksCategory = lazy(() => import('@domains/landing/components/categories/HooksCategory'));
const LayoutCategory = lazy(() => import('@domains/landing/components/categories/LayoutCategory'));
const MediaCategory = lazy(() => import('@domains/landing/components/categories/MediaCategory'));
const NavigationCategory = lazy(
	() => import('@domains/landing/components/categories/NavigationCategory')
);
const OverlaysCategory = lazy(
	() => import('@domains/landing/components/categories/OverlaysCategory')
);
const RootComponentsCategory = lazy(
	() => import('@domains/landing/components/categories/RootComponentsCategory')
);
const UtilitiesCategory = lazy(
	() => import('@domains/landing/components/categories/UtilitiesCategory')
);

const CATEGORY_COMPONENTS: Record<CategoryId, LazyExoticComponent<() => JSX.Element>> = {
	root: RootComponentsCategory,
	forms: FormsCategory,
	'data-display': DataDisplayCategory,
	feedback: FeedbackCategory,
	navigation: NavigationCategory,
	overlays: OverlaysCategory,
	media: MediaCategory,
	layout: LayoutCategory,
	hooks: HooksCategory,
	utilities: UtilitiesCategory,
};

export function renderCategoryContent(activeCategory: CategoryId): JSX.Element {
	const Component = CATEGORY_COMPONENTS[activeCategory];
	return (
		<Suspense fallback={<DefaultLoadingFallback />}>
			<Component />
		</Suspense>
	);
}
