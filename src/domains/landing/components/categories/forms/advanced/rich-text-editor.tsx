import RichTextEditor from '@core/ui/forms/rich-text-editor/RichTextEditor';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderRichTextEditorSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="RichTextEditor"
			description="WYSIWYG rich text editor"
			tags={['form', 'input', 'text', 'editor', 'wysiwyg']}
		>
			<div className="space-y-4">
				<RichTextEditor
					label="Content"
					placeholder="Start typing..."
					value={state.richTextValue}
					onChange={state.setRichTextValue}
					helperText="Enter your content here"
				/>
			</div>
		</ShowcaseSection>
	);
}
