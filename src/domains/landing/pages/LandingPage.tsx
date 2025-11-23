import { ComponentFilterProvider } from '@domains/landing/context/ComponentFilterContext';
import { useLandingPageFilters } from '@domains/landing/hooks/useLandingPageFilters';
import { renderCategoryContent } from '@domains/landing/pages/landing.utils';
import { LandingPageHeader } from '@domains/landing/pages/LandingPageHeader';
import { landingSelectors, useLandingStore } from '@domains/landing/store/landingStore';
import type { ThemedPageProps } from '@src-types/layout';

/**
 * LandingPage - Component library showcase and manual testing page
 *
 * Displays all implementations organized by categories with interactive demos
 */

function LandingPageContent(_props: Readonly<ThemedPageProps>) {
	// Use Zustand store for active category (shared between LandingPage and LandingPageHeader)
	const activeCategory = useLandingStore(landingSelectors.activeCategory);
	const setActiveCategory = useLandingStore(landingSelectors.setActiveCategory);
	const { searchQuery, setSearchQuery, selectedTags, toggleTag, allAvailableTags } =
		useLandingPageFilters();

	return (
		<div data-testid="landing-page" className="min-h-screen">
			<LandingPageHeader
				activeCategory={activeCategory}
				onCategoryChange={setActiveCategory}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				selectedTags={selectedTags}
				onTagToggle={toggleTag}
				allAvailableTags={allAvailableTags}
			/>
			<div className="container mx-auto px-4 py-8">
				<div className="space-y-8">{renderCategoryContent(activeCategory)}</div>
			</div>
		</div>
	);
}

export default function LandingPage(props: Readonly<ThemedPageProps>) {
	return (
		<ComponentFilterProvider>
			<LandingPageContent {...props} />
		</ComponentFilterProvider>
	);
}
