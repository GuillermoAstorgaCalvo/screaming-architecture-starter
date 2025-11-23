import SegmentedControl from '@core/ui/forms/segmented-control/SegmentedControl';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderSegmentedControlSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="SegmentedControl"
			description="iOS-style segmented control"
			tags={['form', 'input', 'segmented', 'control']}
		>
			<div className="space-y-4">
				<SegmentedControl
					items={[
						{ id: 'option1', label: 'Option 1' },
						{ id: 'option2', label: 'Option 2' },
						{ id: 'option3', label: 'Option 3' },
					]}
					value={state.segmentedValue}
					onValueChange={state.setSegmentedValue}
				/>
				<SegmentedControl
					items={[
						{ id: 'list', label: 'List' },
						{ id: 'grid', label: 'Grid' },
						{ id: 'card', label: 'Card' },
					]}
					value={state.segmentedValue}
					onValueChange={state.setSegmentedValue}
					variant="pills"
					size="sm"
				/>
			</div>
		</ShowcaseSection>
	);
}
