import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';
import Input from '@core/ui/input/Input';

function ErrorTextDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Error Text</h3>
			<div className="space-y-4 max-w-md">
				<Input
					label="Email"
					type="email"
					placeholder="Enter your email"
					error="This email is already taken"
				/>
				<div>
					<ErrorText size="sm">Small error message</ErrorText>
				</div>
				<div>
					<ErrorText size="md">Medium error message</ErrorText>
				</div>
				<div>
					<ErrorText id="error-example">Error with ID for accessibility</ErrorText>
				</div>
			</div>
		</div>
	);
}

function HelperTextDemo() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Helper Text</h3>
			<div className="space-y-4 max-w-md">
				<Input
					label="Password"
					type="password"
					placeholder="Enter your password"
					helperText="Must be at least 8 characters long"
				/>
				<div>
					<HelperText size="sm">Small helper text</HelperText>
				</div>
				<div>
					<HelperText size="md">Medium helper text</HelperText>
				</div>
				<div>
					<HelperText id="helper-example">Helper text with ID for accessibility</HelperText>
				</div>
			</div>
		</div>
	);
}

function CombinedExample() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
				Combined Example
			</h3>
			<div className="space-y-4 max-w-md">
				<Input
					label="Username"
					placeholder="Choose a username"
					error="Username must be unique"
					helperText="This will be your public display name"
				/>
			</div>
		</div>
	);
}

function StandaloneExamples() {
	return (
		<div>
			<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
				Standalone Examples
			</h3>
			<div className="space-y-3 max-w-md">
				<ErrorText>This is a standalone error message</ErrorText>
				<ErrorText size="sm">This is a small standalone error message</ErrorText>
				<HelperText>This is a standalone helper text</HelperText>
				<HelperText size="sm">This is a small standalone helper text</HelperText>
			</div>
		</div>
	);
}

export default function TextComponentsSection() {
	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
				Error & Helper Text
			</h2>
			<div className="space-y-6">
				<ErrorTextDemo />
				<HelperTextDemo />
				<CombinedExample />
				<StandaloneExamples />
			</div>
		</section>
	);
}
