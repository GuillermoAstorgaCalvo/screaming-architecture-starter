import Switch from '@core/ui/forms/switch/Switch';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function renderSwitchSection(state: FormsCategoryState) {
	return (
		<ShowcaseSection
			title="Switch"
			description="Toggle switch component"
			tags={['form', 'input', 'switch', 'toggle']}
		>
			<div className="space-y-4">
				<Switch
					label="Toggle Switch"
					checked={state.switchChecked}
					onChange={e => state.setSwitchChecked(e.target.checked)}
				/>
				<Switch label="Checked by default" defaultChecked />
				<Switch label="Disabled switch" disabled />
				<Switch label="Disabled checked" disabled defaultChecked />
			</div>
		</ShowcaseSection>
	);
}
