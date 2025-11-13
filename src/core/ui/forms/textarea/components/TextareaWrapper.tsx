import type { TextareaWrapperProps } from '@core/ui/forms/textarea/types/TextareaTypes';

export function TextareaWrapper({ fullWidth, children, ...props }: Readonly<TextareaWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
