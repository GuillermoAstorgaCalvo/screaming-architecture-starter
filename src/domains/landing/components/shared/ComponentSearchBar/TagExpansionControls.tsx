import Chip from '@core/ui/forms/chip/Chip';
import type { TagExpansionControlsProps } from '@domains/landing/components/shared/ComponentSearchBar.types';
import type { ReactNode } from 'react';

const CHIP_CLASSES =
	'bg-white/10 text-white/80 border border-white/20 hover:bg-white/15 text-base px-4 py-2';

function ExpansionButton({
	onClick,
	children,
}: Readonly<{ onClick: () => void; children: ReactNode }>) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="cursor-pointer transition-all hover:scale-105"
		>
			<Chip variant="default" size="md" className={CHIP_CLASSES}>
				{children}
			</Chip>
		</button>
	);
}

export function TagExpansionControls({
	hasMoreTags,
	showAllTags,
	onShowMore,
	onShowLess,
	hiddenTagsCount,
}: Readonly<TagExpansionControlsProps>) {
	if (!hasMoreTags) {
		return null;
	}

	if (!showAllTags) {
		return <ExpansionButton onClick={onShowMore}>+{hiddenTagsCount} more</ExpansionButton>;
	}

	return <ExpansionButton onClick={onShowLess}>Show less</ExpansionButton>;
}
