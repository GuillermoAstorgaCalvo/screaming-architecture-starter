import { InViewShowcase } from '@domains/landing/components/categories/hooks/showcases/scroll/InViewShowcase';
import { ScrollPositionShowcase } from '@domains/landing/components/categories/hooks/showcases/scroll/ScrollPositionShowcase';
import { ScrollProgressShowcase } from '@domains/landing/components/categories/hooks/showcases/scroll/ScrollProgressShowcase';

/**
 * ScrollHooksShowcase - Showcase group for scroll-related hooks
 */
export function ScrollHooksShowcase() {
	return (
		<>
			<ScrollPositionShowcase />

			<InViewShowcase />

			<ScrollProgressShowcase />
		</>
	);
}
