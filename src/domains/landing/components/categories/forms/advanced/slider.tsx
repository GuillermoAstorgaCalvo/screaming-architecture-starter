import Slider from '@core/ui/forms/slider/Slider';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderSliderSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Slider"
			description="Slider component"
			tags={['form', 'input', 'slider', 'range']}
		>
			<div className="space-y-4">
				<Slider
					label="Slider"
					value={state.sliderValue}
					onChange={e => {
						const newValue = Number(e.target.value);
						state.setSliderValue(newValue);
					}}
					min={0}
					max={100}
				/>
				<Slider
					label="Slider with Steps"
					value={state.sliderValue}
					onChange={e => {
						const newValue = Number(e.target.value);
						state.setSliderValue(newValue);
					}}
					min={0}
					max={100}
					step={10}
				/>
			</div>
		</ShowcaseSection>
	);
}
