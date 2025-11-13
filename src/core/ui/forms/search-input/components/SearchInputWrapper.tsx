import type { SearchInputWrapperProps } from '@core/ui/forms/search-input/types/SearchInputTypes';

export function SearchInputWrapper({
	fullWidth,
	children,
	...props
}: Readonly<SearchInputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
