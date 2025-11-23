import ToggleGroup, { ToggleGroupItem } from '@core/ui/forms/toggle/components/ToggleGroup';
import Text from '@core/ui/text/Text';
import type { FormsCategoryState } from '@domains/landing/components/categories/forms/state';

export function ToggleGroupMultipleShowcase({ state }: { readonly state: FormsCategoryState }) {
	return (
		<div>
			<Text size="sm" className="mb-2 font-semibold">
				Multiple Selection
			</Text>
			<ToggleGroup
				type="multiple"
				value={state.toggleGroupMultiple}
				onValueChange={value => {
					if (Array.isArray(value)) {
						state.setToggleGroupMultiple(value);
					}
				}}
			>
				<ToggleGroupItem value="opt1">Option 1</ToggleGroupItem>
				<ToggleGroupItem value="opt2">Option 2</ToggleGroupItem>
				<ToggleGroupItem value="opt3">Option 3</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}
