import ApiDemoSection from '@domains/landing/components/ApiDemoSection';
import ButtonSection from '@domains/landing/components/ButtonSection';
import CloseIconSection from '@domains/landing/components/CloseIconSection';
import FormsSection from '@domains/landing/components/FormsSection';
import HooksDemoSection from '@domains/landing/components/HooksDemoSection';
import IconButtonSection from '@domains/landing/components/IconButtonSection';
import InputSection from '@domains/landing/components/InputSection';
import LabelSection from '@domains/landing/components/LabelSection';
import ModalSection from '@domains/landing/components/ModalSection';
import SearchSection from '@domains/landing/components/SearchSection';
import SpinnerSection from '@domains/landing/components/SpinnerSection';
import StorageSection from '@domains/landing/components/StorageSection';
import TextComponentsSection from '@domains/landing/components/TextComponentsSection';
import ThemeSection from '@domains/landing/components/ThemeSection';
import ToggleSection from '@domains/landing/components/ToggleSection';
import { useLandingStorage } from '@domains/landing/hooks/useLandingStorage';

export interface LandingPageProps {
	readonly theme: {
		readonly theme: 'light' | 'dark' | 'system';
		readonly resolvedTheme: 'light' | 'dark';
		/**
		 * Function to set the theme preference
		 * @param theme - The new theme value ('light' | 'dark' | 'system')
		 */
		readonly setTheme: (_theme: 'light' | 'dark' | 'system') => void;
	};
}

function CoreUIComponents() {
	return (
		<>
			<ButtonSection />
			<IconButtonSection />
			<InputSection />
			<LabelSection />
			<SpinnerSection />
			<ModalSection />
			<TextComponentsSection />
			<CloseIconSection />
		</>
	);
}

interface FeatureDemonstrationsProps {
	readonly theme: LandingPageProps['theme'];
	readonly visitCount: number;
	readonly userName: string;
	readonly setUserName: (_name: string) => void;
	readonly clearStorage: () => void;
}

function FeatureDemonstrations(props: FeatureDemonstrationsProps) {
	return (
		<>
			<ThemeSection
				theme={props.theme.theme}
				resolvedTheme={props.theme.resolvedTheme}
				setTheme={props.theme.setTheme}
			/>
			<StorageSection
				visitCount={props.visitCount}
				userName={props.userName}
				onUserNameChange={props.setUserName}
				onClearStorage={props.clearStorage}
			/>
			<ApiDemoSection />
			<SearchSection />
			<ToggleSection />
			<HooksDemoSection />
			<FormsSection />
		</>
	);
}

export default function LandingPage({ theme }: LandingPageProps) {
	const { visitCount, userName, setUserName, clearStorage } = useLandingStorage();

	return (
		<main className="p-6 max-w-6xl mx-auto">
			<div className="space-y-6">
				<HeaderSection />
				<CoreUIComponents />
				<FeatureDemonstrations
					theme={theme}
					visitCount={visitCount}
					userName={userName}
					setUserName={setUserName}
					clearStorage={clearStorage}
				/>
			</div>
		</main>
	);
}

function HeaderSection() {
	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
				Screaming Architecture Starter
			</h1>
			<p className="mt-2 text-gray-600 dark:text-gray-400">
				Your app is running. All core UI components and features are demonstrated below.
			</p>
		</div>
	);
}
