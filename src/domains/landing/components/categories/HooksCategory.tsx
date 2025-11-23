import { useSEO } from '@core/hooks/seo/useSEO';
import { DataHooksShowcase } from '@domains/landing/components/categories/hooks/DataHooksShowcase';
import { HooksHeader } from '@domains/landing/components/categories/hooks/HooksHeader';
import { MotionHooksShowcase } from '@domains/landing/components/categories/hooks/MotionHooksShowcase';
import { OtherHooksShowcase } from '@domains/landing/components/categories/hooks/OtherHooksShowcase';
import { ScrollHooksShowcase } from '@domains/landing/components/categories/hooks/ScrollHooksShowcase';
import { StateHooksShowcase } from '@domains/landing/components/categories/hooks/StateHooksShowcase';
import type { ShowcasesProps } from '@domains/landing/components/categories/hooks/types/types';
import { UIHooksShowcase } from '@domains/landing/components/categories/hooks/UIHooksShowcase';
import { useHooksState } from '@domains/landing/components/categories/hooks/useHooksState';

/**
 * HooksCategory - Showcase for React hooks
 */

function HooksShowcases(props: Readonly<ShowcasesProps>) {
	return (
		<>
			<StateHooksShowcase {...props} />

			<UIHooksShowcase />

			<DataHooksShowcase />

			<ScrollHooksShowcase />

			<MotionHooksShowcase />

			<OtherHooksShowcase />
		</>
	);
}

export default function HooksCategory() {
	const { inputValue, setInputValue, debouncedValue, throttledValue, previousValue } =
		useHooksState();

	useSEO({
		title: 'Landing Page - Hooks Showcase',
		description: 'Demonstration of custom React hooks',
	});

	return (
		<div className="space-y-8">
			<HooksHeader />
			<HooksShowcases
				inputValue={inputValue}
				setInputValue={setInputValue}
				debouncedValue={debouncedValue}
				throttledValue={throttledValue}
				previousValue={previousValue}
			/>
		</div>
	);
}
