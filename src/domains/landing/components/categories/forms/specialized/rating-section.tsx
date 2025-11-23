import Rating from '@core/ui/forms/rating/Rating';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderRatingSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Rating"
			description="Rating component"
			tags={['form', 'input', 'rating', 'star']}
		>
			<div className="space-y-4">
				<Rating value={state.ratingValue} onChange={state.setRatingValue} max={5} />
				<Rating value={4} readOnly max={5} />
			</div>
		</ShowcaseSection>
	);
}
