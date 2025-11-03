import { useFormAdapter } from '@core/forms/formAdapter';
import { zodResolver } from '@core/forms/zodResolver';
import Button from '@core/ui/button/Button';
import Input from '@core/ui/input/Input';
import { useEffect } from 'react';
import { z } from 'zod';

const userNameSchema = z.object({
	name: z.string().min(1, 'Name is required').trim(),
});

type UserNameFormData = z.infer<typeof userNameSchema>;

export interface UserNameFormProps {
	readonly userName: string;
	readonly onUserNameChange: (_: string) => void;
}

export default function UserNameForm({ userName, onUserNameChange }: UserNameFormProps) {
	const { register, handleSubmit, errors, reset, isValid } = useFormAdapter<UserNameFormData>({
		resolver: zodResolver(userNameSchema),
		defaultValues: {
			name: userName,
		},
	});

	// Reset form when userName prop changes
	useEffect(() => {
		reset({ name: userName });
	}, [userName, reset]);

	const onSubmit = handleSubmit(data => {
		onUserNameChange(data.name);
	});

	return (
		<div>
			<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
				User name (persisted in storage):
			</p>
			{userName ? (
				<p className="font-medium text-gray-900 dark:text-gray-100">Hello, {userName}! 👋</p>
			) : (
				<p className="text-sm text-gray-500 dark:text-gray-500">No name stored yet</p>
			)}
			<form onSubmit={onSubmit} className="mt-2 flex gap-2">
				<div className="flex-1">
					<Input
						{...register('name')}
						placeholder="Enter your name"
						{...(errors.name?.message ? { error: errors.name.message } : {})}
						fullWidth
					/>
				</div>
				<Button type="submit" variant="primary" disabled={!isValid}>
					Save
				</Button>
			</form>
		</div>
	);
}
