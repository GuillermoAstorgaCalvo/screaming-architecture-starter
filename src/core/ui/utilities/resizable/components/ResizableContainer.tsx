import { prepareAllData } from '@core/ui/utilities/resizable/helpers/ResizableContainer.helpers';
import type {
	ProcessedContainerProps,
	ResizableContainerProps,
} from '@core/ui/utilities/resizable/types/ResizableContainer.types';
import { type ForwardedRef, forwardRef } from 'react';

function processContainerProps(props: ResizableContainerProps): ProcessedContainerProps {
	const {
		id,
		direction,
		size,
		isResizing,
		disabled,
		className,
		handleClassName,
		style,
		children,
		onMouseDown,
	} = props;

	const { containerStyle, containerClasses, handle } = prepareAllData({
		direction,
		size,
		style,
		isResizing,
		disabled,
		className,
		handleClassName,
		onMouseDown,
	});

	return { id, containerStyle, containerClasses, handle, children };
}

function renderContainer(
	{ id, containerStyle, containerClasses, handle, children }: ProcessedContainerProps,
	ref: ForwardedRef<HTMLDivElement>
) {
	return (
		<div
			ref={ref}
			id={id}
			className={containerClasses}
			style={containerStyle}
			aria-label="Resizable container"
		>
			{children}
			{handle}
		</div>
	);
}

function ResizableContainerInner(
	props: ResizableContainerProps,
	ref: ForwardedRef<HTMLDivElement>
) {
	const processedProps = processContainerProps(props);
	return renderContainer(processedProps, ref);
}

export const ResizableContainer = forwardRef<HTMLDivElement, ResizableContainerProps>(
	ResizableContainerInner
);

ResizableContainer.displayName = 'ResizableContainer';
