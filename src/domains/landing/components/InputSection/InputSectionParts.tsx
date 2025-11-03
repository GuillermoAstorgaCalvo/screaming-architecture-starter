import ClearIcon from '@core/ui/icons/clear-icon/ClearIcon';
import SearchIcon from '@core/ui/icons/search-icon/SearchIcon';
import Input from '@core/ui/input/Input';

export function BasicInputs() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Basic</h3>
			<div className="space-y-4 max-w-md">
				<Input label="Name" placeholder="Enter your name" />
				<Input label="Email" type="email" placeholder="Enter your email" required />
				<Input label="Password" type="password" placeholder="Enter your password" required />
			</div>
		</div>
	);
}

export function InputsWithHelperText() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
				With Helper Text
			</h3>
			<div className="space-y-4 max-w-md">
				<Input
					label="Username"
					placeholder="Choose a username"
					helperText="This will be your public display name"
				/>
				<Input
					label="Email"
					type="email"
					placeholder="Enter your email"
					helperText="We'll never share your email"
				/>
			</div>
		</div>
	);
}

interface InputsWithErrorProps {
	readonly email: string;
	readonly password: string;
	readonly setEmail: (_email: string) => void;
	readonly setPassword: (_password: string) => void;
}

const MIN_PASSWORD_LENGTH = 8;

function EmailInput({ email, setEmail }: { email: string; setEmail: (_email: string) => void }) {
	const hasError = email && !email.includes('@');
	return hasError ? (
		<Input
			label="Email"
			type="email"
			placeholder="Enter your email"
			value={email}
			onChange={e => setEmail(e.target.value)}
			error="Please enter a valid email"
		/>
	) : (
		<Input
			label="Email"
			type="email"
			placeholder="Enter your email"
			value={email}
			onChange={e => setEmail(e.target.value)}
		/>
	);
}

function PasswordInput({
	password,
	setPassword,
}: {
	password: string;
	setPassword: (_password: string) => void;
}) {
	const hasError = password && password.length < MIN_PASSWORD_LENGTH;
	return hasError ? (
		<Input
			label="Password"
			type="password"
			placeholder="Enter your password"
			value={password}
			onChange={e => setPassword(e.target.value)}
			error={`Password must be at least ${MIN_PASSWORD_LENGTH} characters`}
			helperText={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
		/>
	) : (
		<Input
			label="Password"
			type="password"
			placeholder="Enter your password"
			value={password}
			onChange={e => setPassword(e.target.value)}
			helperText={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
		/>
	);
}

export function InputsWithError({ email, password, setEmail, setPassword }: InputsWithErrorProps) {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
				With Error Messages
			</h3>
			<div className="space-y-4 max-w-md">
				<EmailInput email={email} setEmail={setEmail} />
				<PasswordInput password={password} setPassword={setPassword} />
			</div>
		</div>
	);
}

interface InputsWithIconsProps {
	readonly search: string;
	readonly setSearch: (_search: string) => void;
}

export function InputsWithIcons({ search, setSearch }: InputsWithIconsProps) {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">With Icons</h3>
			<div className="space-y-4 max-w-md">
				<Input
					label="Search"
					placeholder="Search..."
					leftIcon={<SearchIcon className="text-gray-400" />}
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<Input
					label="Search with clear"
					placeholder="Search..."
					leftIcon={<SearchIcon className="text-gray-400" />}
					rightIcon={search ? <ClearIcon className="text-gray-400" /> : undefined}
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
			</div>
		</div>
	);
}

export function InputSizes() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sizes</h3>
			<div className="space-y-4 max-w-md">
				<Input label="Small" placeholder="Small input" size="sm" />
				<Input label="Medium" placeholder="Medium input" size="md" />
				<Input label="Large" placeholder="Large input" size="lg" />
			</div>
		</div>
	);
}

export function InputFullWidth() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Full Width</h3>
			<Input label="Full width input" placeholder="This input spans full width" fullWidth />
		</div>
	);
}

export function InputDisabled() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Disabled</h3>
			<div className="space-y-4 max-w-md">
				<Input label="Disabled" placeholder="Disabled input" disabled />
				<Input label="Disabled with value" value="This field is disabled" disabled />
			</div>
		</div>
	);
}
