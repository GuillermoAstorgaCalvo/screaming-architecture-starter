import type { ColorPickerSwatchesProps } from '@core/ui/forms/color-picker/types/ColorPickerTypes';
import { classNames } from '@core/utils/classNames';

export function ColorPickerSwatches({
	swatches,
	currentColor,
	onColorSelect,
	disabled,
}: Readonly<ColorPickerSwatchesProps>) {
	if (swatches.length === 0) return null;

	return (
		<div className="flex flex-wrap gap-2 mt-2">
			{swatches.map(color => {
				const isSelected = color.toLowerCase() === currentColor?.toLowerCase();
				return (
					<button
						key={color}
						type="button"
						disabled={disabled}
						className={classNames(
							'w-8 h-8 rounded border-2 transition-all',
							'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
							isSelected
								? 'border-gray-900 dark:border-gray-100 ring-2 ring-offset-1'
								: 'border-gray-300 dark:border-gray-600',
							disabled && 'opacity-50 cursor-not-allowed'
						)}
						style={{ backgroundColor: color }}
						onClick={() => onColorSelect(color)}
						aria-label={`Select color ${color}`}
					/>
				);
			})}
		</div>
	);
}
