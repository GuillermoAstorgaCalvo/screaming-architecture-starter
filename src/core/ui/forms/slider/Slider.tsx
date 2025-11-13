import { SliderContent } from '@core/ui/forms/slider/components/SliderContent';
import { useSliderProps } from '@core/ui/forms/slider/hooks/useSlider';
import type { SliderProps } from '@src-types/ui/forms-advanced';

/**
 * Slider - Reusable range input component with label, error, and helper text support
 *
 * Features:
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Controlled and uncontrolled modes
 * - Min, max, and step support
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Volume"
 *   min={0}
 *   max={100}
 *   value={volume}
 *   onChange={(e) => setVolume(Number(e.target.value))}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Price Range"
 *   min={0}
 *   max={1000}
 *   step={10}
 *   defaultValue={500}
 *   helperText="Select your price range"
 * />
 * ```
 */
export default function Slider(props: Readonly<SliderProps>) {
	const { contentProps } = useSliderProps({ props });
	return <SliderContent {...contentProps} />;
}
