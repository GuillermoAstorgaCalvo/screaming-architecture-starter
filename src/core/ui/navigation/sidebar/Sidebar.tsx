import { SIDEBAR_DEFAULT_WIDTH } from '@core/constants/ui/navigation';
import {
	getSidebarClasses,
	getSidebarWidth,
} from '@core/ui/navigation/sidebar/helpers/SidebarHelpers';
import type { SidebarProps } from '@src-types/ui/overlays/panels';
import type { ReactNode } from 'react';

interface SidebarContentProps {
	readonly children: ReactNode;
	readonly contentClassName?: string;
}

function SidebarContent({ children, contentClassName }: SidebarContentProps) {
	return <div className={`flex-1 overflow-y-auto ${contentClassName ?? ''}`}>{children}</div>;
}

interface SidebarHeaderProps {
	readonly header?: ReactNode;
}

function SidebarHeader({ header }: SidebarHeaderProps) {
	if (!header) return null;
	return <div className="shrink-0 border-b border-gray-200 dark:border-gray-700">{header}</div>;
}

interface SidebarFooterProps {
	readonly footer?: ReactNode;
}

function SidebarFooter({ footer }: SidebarFooterProps) {
	if (!footer) return null;
	return <div className="shrink-0 border-t border-gray-200 dark:border-gray-700">{footer}</div>;
}

/**
 * Sidebar - Persistent layout sidebar component (not an overlay).
 * Features: Left/right positioning, collapsible, customizable width, header/footer support
 */
export default function Sidebar(props: Readonly<SidebarProps>) {
	const {
		children,
		position = 'left',
		width = SIDEBAR_DEFAULT_WIDTH,
		collapsed = false,
		header,
		footer,
		className,
		contentClassName,
		showBorder = true,
		style,
	} = props;

	const sidebarClasses = getSidebarClasses(position, showBorder, className);
	const sidebarWidth = getSidebarWidth(width, collapsed);

	const sidebarStyle = {
		width: sidebarWidth,
		...style,
	};

	return (
		<aside className={sidebarClasses} style={sidebarStyle} aria-label="Sidebar">
			<SidebarHeader header={header} />
			<SidebarContent {...(contentClassName !== undefined && { contentClassName })}>
				{children}
			</SidebarContent>
			<SidebarFooter footer={footer} />
		</aside>
	);
}
