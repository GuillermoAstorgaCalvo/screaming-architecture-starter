import Heading from '@core/ui/heading/Heading';
import Text from '@core/ui/text/Text';
import { AnchorShowcase } from '@domains/landing/components/categories/navigation/AnchorShowcase';
import { AppBarShowcase } from '@domains/landing/components/categories/navigation/AppBarShowcase';
import { BottomNavigationShowcase } from '@domains/landing/components/categories/navigation/BottomNavigationShowcase';
import { BreadcrumbsShowcase } from '@domains/landing/components/categories/navigation/BreadcrumbsShowcase';
import { FloatingActionButtonShowcase } from '@domains/landing/components/categories/navigation/FloatingActionButtonShowcase';
import { LinkShowcase } from '@domains/landing/components/categories/navigation/LinkShowcase';
import { MenubarShowcase } from '@domains/landing/components/categories/navigation/MenubarShowcase';
import { NavigationMenuShowcase } from '@domains/landing/components/categories/navigation/NavigationMenuShowcase';
import { PaginationShowcase } from '@domains/landing/components/categories/navigation/PaginationShowcase';
import { SidebarShowcase } from '@domains/landing/components/categories/navigation/SidebarShowcase';
import { StepperShowcase } from '@domains/landing/components/categories/navigation/StepperShowcase';
import { TabsShowcase } from '@domains/landing/components/categories/navigation/TabsShowcase';

/**
 * NavigationCategory - Showcase for navigation components
 */
export default function NavigationCategory() {
	return (
		<div className="space-y-8">
			<div>
				<Heading as="h1" size="lg" className="mb-2 text-white">
					Navigation
				</Heading>
				<Text className="text-white/70">Components for navigation, routing, and wayfinding</Text>
			</div>

			<TabsShowcase />
			<BreadcrumbsShowcase />
			<PaginationShowcase />
			<StepperShowcase />
			<AnchorShowcase />
			<LinkShowcase />
			<AppBarShowcase />
			<NavigationMenuShowcase />
			<BottomNavigationShowcase />
			<FloatingActionButtonShowcase />
			<MenubarShowcase />
			<SidebarShowcase />
		</div>
	);
}
