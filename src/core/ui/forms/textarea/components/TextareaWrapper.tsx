import type { TextareaWrapperProps } from './TextareaTypes';

export function TextareaWrapper({ fullWidth, children, ...props }: Readonly<TextareaWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}
