import ToggleGroup, { ToggleGroupItem } from '@core/ui/forms/toggle/components/ToggleGroup';
import Text from '@core/ui/text/Text';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';

export function ToggleGroupSingleShowcase({ state }: { readonly state: FormsCategoryState }) {
	return (
		<div>
			<Text size="sm" className="mb-2 font-semibold">
				Single Selection
			</Text>
			<ToggleGroup
				type="single"
				value={state.toggleGroupSingle}
				onValueChange={value => {
					if (typeof value === 'string') {
						state.setToggleGroupSingle(value);
					}
				}}
			>
				<ToggleGroupItem value="option1">Option A</ToggleGroupItem>
				<ToggleGroupItem value="option2">Option B</ToggleGroupItem>
				<ToggleGroupItem value="option3">Option C</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}
