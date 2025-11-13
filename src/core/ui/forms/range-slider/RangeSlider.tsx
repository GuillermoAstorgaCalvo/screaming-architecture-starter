import { RangeSliderContent } from '@core/ui/forms/range-slider/components/RangeSliderContent';
import { useRangeSliderProps } from '@core/ui/forms/range-slider/hooks/useRangeSlider';
import type { RangeSliderProps } from '@src-types/ui/forms-advanced';

/**
 * RangeSlider - Dual-handle range input component for min/max selection
 *
 * Features:
 * - Dual handles for selecting a range (min/max)
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Controlled and uncontrolled modes
 * - Min, max, and step support
 * - Prevents handles from crossing each other
 *
 * @example
 * ```tsx
 * <RangeSlider
 *   label="Price Range"
 *   min={0}
 *   max={1000}
 *   value={[100, 500]}
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RangeSlider
 *   label="Date Range"
 *   min={0}
 *   max={365}
 *   step={1}
 *   defaultValue={[30, 180]}
 *   helperText="Select a range of days"
 * />
 * ```
 */
export default function RangeSlider(props: Readonly<RangeSliderProps>) {
	const { contentProps } = useRangeSliderProps({ props });
	return <RangeSliderContent {...contentProps} />;
}
