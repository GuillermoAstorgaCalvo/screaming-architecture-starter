import SkipToContent from '@core/a11y/skipToContent';
import { classNames } from '@core/utils/classNames';
import Navbar from '@shared/components/layout/Navbar';
import type { LayoutProps } from '@src-types/layout';

/**
 * Layout - Main layout wrapper with Navbar
 *
 * Provides consistent page structure across the application
 * Wraps page content with navigation header
 */
export default function Layout({ children, theme, className }: Readonly<LayoutProps>) {
	return (
		<div className="flex min-h-screen flex-col">
			<SkipToContent targetId="main-content" />
			<Navbar theme={theme} />
			<main id="main-content" className={classNames('flex-1', className)}>
				{children}
			</main>
		</div>
	);
}
