import ColorPicker from '@core/ui/forms/color-picker/ColorPicker';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderColorPickerSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="ColorPicker"
			description="Color picker with preset swatches"
			tags={['form', 'input', 'color', 'picker']}
		>
			<div className="space-y-4">
				<ColorPicker
					label="Pick Color"
					value={state.colorPickerValue}
					onChange={state.setColorPickerValue}
					showSwatches
					swatches={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']}
				/>
				<ColorPicker
					label="ColorPicker without Swatches"
					defaultValue="#ff8800"
					showSwatches={false}
				/>
			</div>
		</ShowcaseSection>
	);
}
