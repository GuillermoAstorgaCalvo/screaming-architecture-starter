import type { ReactNode } from 'react';

import { buildToastBodyProps, buildToastContainerProps } from './toast.props.builders';
import type { ToastProps } from './toast.types';
import { ToastBody, ToastContainer } from './ToastParts';
import { useToastData } from './useToastData';

interface RenderToastContentProps {
	readonly id?: string | undefined;
	readonly intent: ToastProps['intent'];
	readonly title?: string | undefined;
	readonly description?: string | ReactNode | undefined;
	readonly children?: ReactNode | undefined;
	readonly className?: string | undefined;
	readonly action?: ToastProps['action'] | undefined;
	readonly dismissLabel: string;
	readonly accessibleRole: 'status' | 'alert';
	readonly dismissHandlers: ReturnType<typeof useToastData>['renderProps']['dismissHandlers'];
}

function renderToastContent(props: Readonly<RenderToastContentProps>) {
	const containerProps = buildToastContainerProps({
		id: props.id,
		role: props.accessibleRole,
		intent: props.intent,
		className: props.className,
		dismissHandlers: props.dismissHandlers,
	});
	const bodyProps = buildToastBodyProps({
		intent: props.intent,
		title: props.title,
		description: props.description,
		action: props.action,
		dismissHandlers: props.dismissHandlers,
		dismissLabel: props.dismissLabel,
		children: props.children,
	});
	return (
		<ToastContainer {...containerProps}>
			<ToastBody {...bodyProps} />
		</ToastContainer>
	);
}

export default function Toast(props: Readonly<ToastProps>) {
	const { isOpen, renderProps } = useToastData(props);
	if (!isOpen) return null;
	return renderToastContent(renderProps);
}
