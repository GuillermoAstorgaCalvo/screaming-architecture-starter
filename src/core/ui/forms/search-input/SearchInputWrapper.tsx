import type { SearchInputWrapperProps } from './SearchInputTypes';

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
