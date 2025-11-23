import { IntervalShowcase } from '@domains/landing/components/categories/hooks/showcases/ui/IntervalShowcase';
import { LocalStorageShowcase } from '@domains/landing/components/categories/hooks/showcases/ui/LocalStorageShowcase';
import { MediaQueryShowcase } from '@domains/landing/components/categories/hooks/showcases/ui/MediaQueryShowcase';
import { SessionStorageShowcase } from '@domains/landing/components/categories/hooks/showcases/ui/SessionStorageShowcase';
import { WindowSizeShowcase } from '@domains/landing/components/categories/hooks/showcases/ui/WindowSizeShowcase';

/**
 * UIHooksShowcase - Showcase group for UI-related hooks
 */
export function UIHooksShowcase() {
	return (
		<>
			<WindowSizeShowcase />

			<MediaQueryShowcase />

			<LocalStorageShowcase />

			<SessionStorageShowcase />

			<IntervalShowcase />
		</>
	);
}
