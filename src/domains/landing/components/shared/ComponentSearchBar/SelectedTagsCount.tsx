import Text from '@core/ui/text/Text';
import type { SelectedTagsCountProps } from '@domains/landing/components/shared/ComponentSearchBar.types';

export function SelectedTagsCount({ count }: Readonly<SelectedTagsCountProps>) {
	if (count === 0) {
		return null;
	}

	return (
		<Text size="sm" className="text-white/60 font-medium">
			{count} tag{count === 1 ? '' : 's'} selected
		</Text>
	);
}
