import type { ReactNode, RefObject } from 'react';

export interface PopoverTriggerProps {
	readonly triggerWrapperRef: RefObject<HTMLDivElement | null>;
	readonly containerClassName?: string | undefined;
	readonly trigger: ReactNode;
}

export function PopoverTrigger({
	triggerWrapperRef,
	containerClassName,
	trigger,
}: Readonly<PopoverTriggerProps>) {
	return (
		<div ref={triggerWrapperRef} className={containerClassName}>
			{trigger}
		</div>
	);
}
