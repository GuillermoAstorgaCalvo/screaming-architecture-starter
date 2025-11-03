import SkipToContent from '@core/a11y/skipToContent';
import Navbar, { type NavbarProps } from '@shared/components/layout/Navbar';
import type { ReactNode } from 'react';

export interface LayoutProps {
	readonly children: ReactNode;
	/**
	 * Theme configuration passed to Navbar (optional)
	 */
	readonly theme?: NavbarProps['theme'];
	/**
	 * Optional custom className for the main container
	 */
	readonly className?: string;
}

/**
 * Layout - Main layout wrapper with Navbar
 *
 * Provides consistent page structure across the application
 * Wraps page content with navigation header
 */
export default function Layout({ children, theme, className }: LayoutProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<SkipToContent targetId="main-content" />
			<Navbar theme={theme} />
			<main id="main-content" className={`flex-1 ${className ?? ''}`}>
				{children}
			</main>
		</div>
	);
}
