import { SIDEBAR_DEFAULT_WIDTH } from '@core/constants/ui/navigation';
import i18n from '@core/i18n/i18n';
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
	return <div className="shrink-0 border-b border-border dark:border-border">{header}</div>;
}

interface SidebarFooterProps {
	readonly footer?: ReactNode;
}

function SidebarFooter({ footer }: SidebarFooterProps) {
	if (!footer) return null;
	return <div className="shrink-0 border-t border-border dark:border-border">{footer}</div>;
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
		<aside
			className={sidebarClasses}
			style={sidebarStyle}
			aria-label={i18n.t('a11y.sidebar', { ns: 'common' })}
		>
			<SidebarHeader header={header} />
			<SidebarContent {...(contentClassName !== undefined && { contentClassName })}>
				{children}
			</SidebarContent>
			<SidebarFooter footer={footer} />
		</aside>
	);
}
