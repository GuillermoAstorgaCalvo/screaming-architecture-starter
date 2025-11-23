import Toggle from '@core/ui/forms/toggle/Toggle';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderToggleSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Toggle"
			description="Button-like toggle component"
			tags={['form', 'input', 'toggle', 'button']}
		>
			<div className="space-y-4">
				<div className="flex flex-wrap gap-4">
					<Toggle pressed={state.togglePressed} onPressedChange={state.setTogglePressed}>
						Toggle Me
					</Toggle>
					<Toggle
						variant="outline"
						pressed={state.togglePressed}
						onPressedChange={state.setTogglePressed}
					>
						Outline Toggle
					</Toggle>
					<Toggle size="sm" pressed={state.togglePressed} onPressedChange={state.setTogglePressed}>
						Small
					</Toggle>
					<Toggle size="lg" pressed={state.togglePressed} onPressedChange={state.setTogglePressed}>
						Large
					</Toggle>
					<Toggle pressed disabled>
						Disabled
					</Toggle>
				</div>
			</div>
		</ShowcaseSection>
	);
}
