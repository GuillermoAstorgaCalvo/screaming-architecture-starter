import { DeferredActivationShowcase } from '@domains/landing/components/categories/hooks/showcases/other/DeferredActivationShowcase';
import { HttpClientAuthShowcase } from '@domains/landing/components/categories/hooks/showcases/other/HttpClientAuthShowcase';
import { SEOShowcase } from '@domains/landing/components/categories/hooks/showcases/other/SEOShowcase';

/**
 * OtherHooksShowcase - Showcase group for miscellaneous hooks
 */
export function OtherHooksShowcase() {
	return (
		<>
			<SEOShowcase />

			<HttpClientAuthShowcase />

			<DeferredActivationShowcase />
		</>
	);
}
