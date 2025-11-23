import { DebounceShowcase } from '@domains/landing/components/categories/hooks/showcases/state/DebounceShowcase';
import { PreviousShowcase } from '@domains/landing/components/categories/hooks/showcases/state/PreviousShowcase';
import { ThrottleShowcase } from '@domains/landing/components/categories/hooks/showcases/state/ThrottleShowcase';
import { ToggleShowcase } from '@domains/landing/components/categories/hooks/showcases/state/ToggleShowcase';

import type { ShowcasesProps } from './types/types';

/**
 * StateHooksShowcase - Showcase group for state management hooks
 */
export function StateHooksShowcase(props: Readonly<ShowcasesProps>) {
	return (
		<>
			<DebounceShowcase
				inputValue={props.inputValue}
				onInputChange={props.setInputValue}
				debouncedValue={props.debouncedValue}
			/>

			<ThrottleShowcase
				inputValue={props.inputValue}
				onInputChange={props.setInputValue}
				throttledValue={props.throttledValue}
			/>

			<ToggleShowcase />

			<PreviousShowcase
				inputValue={props.inputValue}
				onInputChange={props.setInputValue}
				previousValue={props.previousValue}
			/>
		</>
	);
}
