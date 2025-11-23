import Chip from '@core/ui/forms/chip/Chip';
import type { TagToggleButtonProps } from '@domains/landing/components/shared/ComponentSearchBar.types';

export function TagToggleButton({ tag, isSelected, onToggle }: Readonly<TagToggleButtonProps>) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className="cursor-pointer transition-all hover:scale-105"
		>
			<Chip
				variant={isSelected ? 'primary' : 'default'}
				size="md"
				className={
					isSelected
						? 'bg-primary/30 text-primary-foreground border border-primary/50 text-base px-4 py-2'
						: 'bg-white/10 text-white/80 border border-white/20 hover:bg-white/15 text-base px-4 py-2'
				}
			>
				{tag}
			</Chip>
		</button>
	);
}
