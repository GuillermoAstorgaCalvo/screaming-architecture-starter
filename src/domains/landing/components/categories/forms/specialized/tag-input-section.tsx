import TagInput from '@core/ui/forms/tag-input/TagInput';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderTagInputSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="TagInput"
			description="Component for adding/removing multiple tags"
			tags={['form', 'input', 'tag', 'chip']}
		>
			<div className="space-y-4">
				<TagInput
					label="Tags"
					placeholder="Add tags..."
					tags={state.tagInputValue}
					onChange={state.setTagInputValue}
				/>
				<TagInput
					label="Skills (max 5)"
					placeholder="Add skills..."
					maxTags={5}
					helperText="Add up to 5 skills"
				/>
			</div>
		</ShowcaseSection>
	);
}
