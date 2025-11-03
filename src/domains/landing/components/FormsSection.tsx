import { Controller } from '@core/forms/controller';
import { useFormAdapter } from '@core/forms/formAdapter';
import { useController } from '@core/forms/useController';
import { zodResolver } from '@core/forms/zodResolver';
import Button from '@core/ui/button/Button';
import ErrorText from '@core/ui/error-text/ErrorText';
import HelperText from '@core/ui/helper-text/HelperText';
import Input from '@core/ui/input/Input';
import Label from '@core/ui/label/Label';
import { useState } from 'react';
import { z } from 'zod';

interface FormData {
	controllerEmail: string;
	useControllerEmail: string;
}

const formSchema = z.object({
	controllerEmail: z.email({ message: 'Invalid email address' }),
	useControllerEmail: z.email({ message: 'Invalid email address' }),
});

interface ControllerFieldProps {
	readonly control: ReturnType<typeof useFormAdapter<FormData>>['control'];
}

function ControllerField({ control }: ControllerFieldProps) {
	return (
		<div>
			<Label htmlFor="controller-email" required>
				Email (Controller)
			</Label>
			<Controller
				name="controllerEmail"
				control={control}
				render={({ field, fieldState }) => (
					<div className="space-y-1">
						<Input
							{...field}
							id="controller-email"
							type="email"
							placeholder="example@email.com"
							{...(fieldState.error?.message && { error: fieldState.error.message })}
						/>
						{fieldState.error ? (
							<ErrorText id="controller-email-error" size="sm">
								{fieldState.error.message}
							</ErrorText>
						) : null}
						{!fieldState.error && (
							<HelperText id="controller-email-helper" size="sm">
								Using Controller component
							</HelperText>
						)}
					</div>
				)}
			/>
		</div>
	);
}

interface FormSubmissionResultProps {
	readonly data: FormData;
}

function FormSubmissionResult({ data }: FormSubmissionResultProps) {
	return (
		<div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
			<p className="text-sm text-green-800 dark:text-green-200 font-medium">
				✅ Form submitted successfully!
			</p>
			<pre className="text-xs text-green-700 dark:text-green-300 mt-1 overflow-auto">
				{JSON.stringify(data, null, 2)}
			</pre>
		</div>
	);
}

interface ControllerDemoFormProps {
	readonly control: ReturnType<typeof useFormAdapter<FormData>>['control'];
	readonly handleSubmit: ReturnType<typeof useFormAdapter<FormData>>['handleSubmit'];
	readonly onSubmit: (data: FormData) => void;
	readonly onClear: () => void;
}

function ControllerDemoForm({ control, handleSubmit, onSubmit, onClear }: ControllerDemoFormProps) {
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<ControllerField control={control} />
			<div>
				<Label htmlFor="usecontroller-email" required>
					Email (useController)
				</Label>
				<UseControllerInput name="useControllerEmail" control={control} />
			</div>

			<div className="flex gap-2">
				<Button type="submit" size="sm">
					Submit
				</Button>
				<Button type="button" variant="secondary" size="sm" onClick={onClear}>
					Clear Result
				</Button>
			</div>
		</form>
	);
}

function ControllerDemo() {
	const { control, handleSubmit } = useFormAdapter<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			controllerEmail: '',
			useControllerEmail: '',
		},
	});

	const [submittedData, setSubmittedData] = useState<FormData | null>(null);

	const onSubmit = (data: FormData): void => {
		setSubmittedData(data);
	};

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
				Controller & useController
			</h3>
			<p className="text-sm text-gray-600 dark:text-gray-400">
				Demonstrates using Controller component and useController hook for controlled form fields
				that don&apos;t work with the register API.
			</p>

			<ControllerDemoForm
				control={control}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				onClear={() => setSubmittedData(null)}
			/>

			{submittedData ? <FormSubmissionResult data={submittedData} /> : null}

			<p className="text-xs text-gray-500 dark:text-gray-500">
				<code>Controller</code> from <code>@core/forms/controller</code>, <code>useController</code>{' '}
				from <code>@core/forms/useController</code>, <code>useFormAdapter</code> from{' '}
				<code>@core/forms/formAdapter</code>
			</p>
		</div>
	);
}

interface UseControllerInputProps {
	readonly name: 'useControllerEmail';
	readonly control: ReturnType<typeof useFormAdapter<FormData>>['control'];
}

function UseControllerInput({ name, control }: UseControllerInputProps) {
	const { field, fieldState } = useController({
		name,
		control,
	});

	return (
		<div className="space-y-1">
			<Input
				{...field}
				id={`${name}-input`}
				type="email"
				placeholder="example@email.com"
				{...(fieldState.error?.message && { error: fieldState.error.message })}
			/>
			{fieldState.error ? (
				<ErrorText id={`${name}-error`} size="sm">
					{fieldState.error.message}
				</ErrorText>
			) : null}
			{!fieldState.error && (
				<HelperText id={`${name}-helper`} size="sm">
					Using useController hook
				</HelperText>
			)}
		</div>
	);
}

export default function FormsSection() {
	return (
		<section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
			<ControllerDemo />
		</section>
	);
}
