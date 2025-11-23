import Input from '@core/ui/forms/input/Input';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderInputSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Input"
			description="Text input component"
			tags={['form', 'input', 'text']}
		>
			<div className="space-y-4">
				<Input
					label="Text Input"
					placeholder="Enter text..."
					value={state.inputValue}
					onChange={e => state.setInputValue(e.target.value)}
				/>
				<Input label="Disabled Input" placeholder="Disabled" disabled value="Disabled value" />
				<Input
					label="Input with Error"
					placeholder="Enter text..."
					error="This field is required"
				/>
				<Input
					label="Input with Helper Text"
					placeholder="Enter text..."
					helperText="This is helper text"
				/>
			</div>
		</ShowcaseSection>
	);
}
