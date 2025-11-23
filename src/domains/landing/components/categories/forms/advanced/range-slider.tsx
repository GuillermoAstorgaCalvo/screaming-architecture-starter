import RangeSlider from '@core/ui/forms/range-slider/RangeSlider';
import {
	DEFAULT_RANGE_STEP_END,
	DEFAULT_RANGE_STEP_START,
} from '@domains/landing/components/categories/forms/constants/constants';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderRangeSliderSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="RangeSlider"
			description="Dual-handle range slider component"
			tags={['form', 'input', 'slider', 'range']}
		>
			<div className="space-y-4">
				<RangeSlider
					label="Price Range"
					min={0}
					max={1000}
					value={state.rangeSliderValue}
					onChange={state.setRangeSliderValue}
				/>
				<RangeSlider
					label="Range with Steps"
					min={0}
					max={100}
					step={5}
					defaultValue={[DEFAULT_RANGE_STEP_START, DEFAULT_RANGE_STEP_END]}
					helperText="Select a range between 0 and 100"
				/>
			</div>
		</ShowcaseSection>
	);
}
