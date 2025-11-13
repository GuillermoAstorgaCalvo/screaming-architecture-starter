import type { TagInputWrapperProps } from '@core/ui/forms/tag-input/types/TagInputTypes';

export function TagInputWrapper({ fullWidth, children, ...props }: Readonly<TagInputWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
