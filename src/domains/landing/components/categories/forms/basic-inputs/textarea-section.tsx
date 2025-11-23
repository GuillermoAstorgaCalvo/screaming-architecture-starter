import Textarea from '@core/ui/forms/textarea/Textarea';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderTextareaSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Textarea"
			description="Multi-line text input component"
			tags={['form', 'input', 'text']}
		>
			<div className="space-y-4">
				<Textarea
					label="Textarea"
					placeholder="Enter multiple lines of text..."
					value={state.textareaValue}
					onChange={e => state.setTextareaValue(e.target.value)}
					rows={4}
				/>
				<Textarea
					label="Disabled Textarea"
					placeholder="Disabled"
					disabled
					value="Disabled textarea value"
					rows={4}
				/>
			</div>
		</ShowcaseSection>
	);
}
