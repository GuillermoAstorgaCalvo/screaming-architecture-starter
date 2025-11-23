import ColorInput from '@core/ui/forms/color-input/ColorInput';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderColorInputSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="ColorInput"
			description="Native color input component"
			tags={['form', 'input', 'color']}
		>
			<div className="space-y-4">
				<ColorInput
					label="Choose Color"
					value={state.colorInputValue}
					onChange={state.setColorInputValue}
				/>
				<ColorInput label="Disabled Color" defaultValue="#0000ff" disabled />
			</div>
		</ShowcaseSection>
	);
}
