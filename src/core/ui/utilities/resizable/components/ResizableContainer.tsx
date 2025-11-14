import { useTranslation } from '@core/i18n/useTranslation';
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

function ResizableContainerInner(
	props: ResizableContainerProps,
	ref: ForwardedRef<HTMLDivElement>
) {
	const { t } = useTranslation('common');
	const processedProps = processContainerProps(props);
	const { id, containerStyle, containerClasses, handle, children } = processedProps;

	return (
		<div
			ref={ref}
			id={id}
			className={containerClasses}
			style={containerStyle}
			aria-label={t('a11y.resizableContainer')}
		>
			{children}
			{handle}
		</div>
	);
}

export const ResizableContainer = forwardRef<HTMLDivElement, ResizableContainerProps>(
	ResizableContainerInner
);

ResizableContainer.displayName = 'ResizableContainer';
