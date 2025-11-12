# Forms Module

This module provides a library-agnostic form handling abstraction to avoid coupling domain code to specific form implementations. The adapter pattern enables easy swapping of form libraries without changing domain code.

## Structure

- **`formAdapter.ts`**: Form abstraction layer over react-hook-form. Provides `useFormAdapter<T>()` hook that wraps `useForm` and exposes a consistent `FormControls<T>` interface.
- **`controller.tsx`**: Controller component for controlled components. Exports Controller from react-hook-form through the adapter layer for components that don't work with the `register` API.
- **`useController.ts`**: `useController` hook and related types for controlled components. Exports useController from react-hook-form through the adapter layer.

## Usage

### Import Pattern

Import directly from the specific modules:

```ts
// ✅ Preferred - direct imports from specific modules
import { useFormAdapter, type FormControls, type FieldValues } from '@core/forms/formAdapter';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from '@core/forms/controller'; // When using Controller component
import { useController } from '@core/forms/useController'; // When using useController hook
```

### Basic Form Setup

Create a form with Zod validation:

```tsx
import { useFormAdapter } from '@core/forms/formAdapter';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
	const { register, handleSubmit, errors, isValid } = useFormAdapter<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: '',
			email: '',
		},
	});

	const onSubmit = handleSubmit(data => {
		console.log('Form data:', data);
	});

	return (
		<form onSubmit={onSubmit}>
			<input {...register('name')} />
			{errors.name && <span>{errors.name.message}</span>}

			<input {...register('email')} type="email" />
			{errors.email && <span>{errors.email.message}</span>}

			<button type="submit" disabled={!isValid}>
				Submit
			</button>
		</form>
	);
}
```

### Form Controls API

The `useFormAdapter` hook returns a `FormControls<T>` object with the following properties:

#### Methods

- **`register`**: Register a field with the form
- **`handleSubmit`**: Handle form submission with validation
- **`reset`**: Reset the form to initial values
- **`setValue`**: Set a field value programmatically
- **`getValues`**: Get a field value
- **`trigger`**: Trigger validation for specific fields or all fields
- **`watch`**: Watch field values
- **`setError`**: Set field error manually
- **`clearErrors`**: Clear field error
- **`unregister`**: Unregister a field from the form (useful for dynamic forms)
- **`setFocus`**: Programmatically focus a field (useful for accessibility and UX)
- **`getFieldState`**: Get the state of a specific field (error, invalid, isDirty, isTouched, etc.)
- **`control`**: Form control object for use with Controller component

#### State Properties

- **`formState`**: Full form state object (from react-hook-form)
- **`errors`**: Field errors object
- **`isValid`**: Whether the form is valid (no validation errors)
- **`isSubmitting`**: Whether the form is currently being submitted
- **`isDirty`**: Whether the form has been modified from its default values

### Integration with Core UI Components

The form adapter works seamlessly with core UI components:

```tsx
import { useFormAdapter } from '@core/forms/formAdapter';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@core/ui/input/Input';
import Button from '@core/ui/button/Button';
import { z } from 'zod';

const schema = z.object({
	name: z.string().min(1, 'Name is required'),
});

function MyForm() {
	const { register, handleSubmit, errors, isValid } = useFormAdapter({
		resolver: zodResolver(schema),
	});

	return (
		<form onSubmit={handleSubmit(data => console.log(data))}>
			<Input
				{...register('name')}
				placeholder="Enter your name"
				{...(errors.name?.message ? { error: errors.name.message } : {})}
			/>
			<Button type="submit" disabled={!isValid}>
				Submit
			</Button>
		</form>
	);
}
```

### Advanced Usage

#### Resetting Form When Props Change

```tsx
import { useEffect } from 'react';
import { useFormAdapter } from '@core/forms/formAdapter';

function MyForm({ initialValue }: { initialValue: string }) {
	const { register, handleSubmit, reset } = useFormAdapter({
		defaultValues: { name: initialValue },
	});

	// Reset form when prop changes
	useEffect(() => {
		reset({ name: initialValue });
	}, [initialValue, reset]);

	// ...
}
```

#### Watching Field Values

```tsx
const { register, watch } = useFormAdapter();

// Watch a specific field
const email = watch('email');

// Watch all fields
const allValues = watch();

// Use in JSX
{
	email && <p>Email: {email}</p>;
}
```

#### Programmatic Field Updates

```tsx
const { setValue, getValues, trigger } = useFormAdapter();

// Set a field value
setValue('name', 'John Doe');

// Get a field value
const currentName = getValues('name');

// Trigger validation
trigger('email'); // Validate specific field
trigger(); // Validate all fields
```

#### Getting Field State

```tsx
const { getFieldState, register } = useFormAdapter();

<input {...register('email')} />;
const fieldState = getFieldState('email');

// Access field-specific state
if (fieldState.isTouched && fieldState.invalid) {
	console.log('Field has been touched and is invalid');
}
```

#### Unregistering Fields (Dynamic Forms)

```tsx
const { register, unregister } = useFormAdapter();

// Unregister a field when it's removed from the form
const handleRemoveField = (fieldName: string) => {
	unregister(fieldName);
};
```

#### Programmatically Focusing Fields

```tsx
import type { Path } from '@core/forms/formAdapter';

const { setFocus, errors, trigger } = useFormAdapter<FormData>();

// Focus the first field with an error after validation
const handleSubmit = async () => {
	const isValid = await trigger();
	if (!isValid) {
		// Find first error field and focus it
		const firstErrorField = Object.keys(errors)[0];
		if (firstErrorField) {
			setFocus(firstErrorField as Path<FormData>);
		}
	}
};
```

#### Using Controller for Controlled Components

For third-party UI libraries or custom components that don't work with `register`:

```tsx
import { useFormAdapter } from '@core/forms/formAdapter';
import { Controller } from '@core/forms/controller';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomSelect from './CustomSelect';
import { z } from 'zod';

const schema = z.object({
	country: z.string().min(1, 'Country is required'),
});

function MyForm() {
	const { control, handleSubmit, errors } = useFormAdapter({
		resolver: zodResolver(schema),
	});

	return (
		<form onSubmit={handleSubmit(data => console.log(data))}>
			<Controller
				name="country"
				control={control}
				render={({ field }) => (
					<CustomSelect
						value={field.value}
						onChange={field.onChange}
						onBlur={field.onBlur}
						error={errors.country?.message}
					/>
				)}
			/>
		</form>
	);
}
```

#### Using useController Hook

For programmatic control when you need more control than the Controller component provides:

```tsx
import { useFormAdapter } from '@core/forms/formAdapter';
import { useController } from '@core/forms/useController';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomInput from './CustomInput';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email('Invalid email address'),
});

function MyForm() {
	const { control, handleSubmit } = useFormAdapter({
		resolver: zodResolver(schema),
	});

	const {
		field,
		fieldState: { error, isTouched, invalid },
	} = useController({
		name: 'email',
		control,
	});

	return (
		<form onSubmit={handleSubmit(data => console.log(data))}>
			<CustomInput {...field} error={isTouched && invalid ? error?.message : undefined} />
		</form>
	);
}
```

### Type Safety

The form adapter is fully type-safe with TypeScript:

```tsx
import type { SubmitHandler, Path, PathValue } from '@core/forms/formAdapter';

const schema = z.object({
	name: z.string(),
	age: z.number().min(18),
	address: z.object({
		street: z.string(),
		city: z.string(),
	}),
});

type FormData = z.infer<typeof schema>;

// TypeScript will enforce correct field names
const { register, errors, handleSubmit } = useFormAdapter<FormData>({
	resolver: zodResolver(schema),
});

// ✅ Type-safe field paths
register('name');
register('address.street'); // Nested paths work
errors.name?.message;
errors.address?.street?.message;

// ✅ Type-safe submit handler
const onSubmit: SubmitHandler<FormData> = data => {
	// data is fully typed as FormData
	console.log(data.name, data.age);
};

// ✅ Type-safe path and value types
const namePath: Path<FormData> = 'name'; // ✅
const streetPath: Path<FormData> = 'address.street'; // ✅
const streetValue: PathValue<FormData, 'address.street'> = '123 Main St'; // ✅

// ❌ TypeScript error
register('invalidField'); // Type error: 'invalidField' is not assignable to Path<FormData>
errors.invalidField; // Property 'invalidField' does not exist
```

#### Available Type Exports

The adapter exports commonly used types from react-hook-form (import directly from the adapter):

- **`FieldValues`**: Base type for form data
- **`FieldErrors`**: Type for form field errors
- **`FormState`**: Complete form state object
- **`Path<T>`**: Type-safe field path (e.g., `'name' | 'address.street'`)
- **`PathValue<T, P>`**: Type-safe field value based on path
- **`SubmitHandler<T>`**: Type-safe submit handler function
- **`UseFormAdapterOptions<T>`**: Configuration options for form initialization

Additional types and hook available from `@core/forms/controller` for Controller component:

- **`Controller`**: Controller component for controlled form fields
- **`ControllerProps<T>`**: Props for the Controller component
- **`ControllerRenderProps<T>`**: Props passed to the render function
- **`FieldPath<T>`**: Type-safe field path for Controller (similar to `Path<T>`)

Additional types and hook available from `@core/forms/useController` for useController hook:

- **`useController`**: Hook for programmatic control of form fields
- **`ControllerProps<T>`**: Props for the Controller component (also available from `@core/forms/controller`)
- **`ControllerRenderProps<T>`**: Props passed to the render function (also available from `@core/forms/controller`)
- **`FieldPath<T>`**: Type-safe field path for Controller (also available from `@core/forms/controller`)
- **`UseControllerProps<T>`**: Props for the `useController` hook
- **`UseControllerReturn<T>`**: Return type of the `useController` hook

## Architecture Principles

### Adapter Pattern

The form adapter provides a library-agnostic interface, allowing domains to use forms without directly depending on react-hook-form. This enables:

- **Easy library swapping**: Change the underlying form library without modifying domain code
- **Consistent API**: Same form handling patterns across the application
- **Simplified testing**: Mock form implementations for testing

### Abstraction Layer

Domains should **only** depend on the adapter interface (`FormControls<T>`, `useFormAdapter`, etc.) and **never** import directly from `react-hook-form` or `@hookform/resolvers`.

**✅ Correct:**

```ts
import { useFormAdapter } from '@core/forms/formAdapter';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from '@core/forms/controller';
```

**❌ Incorrect:**

```ts
import { useForm } from 'react-hook-form'; // Direct dependency - breaks abstraction
import { Controller } from 'react-hook-form'; // Direct dependency - breaks abstraction
```

## Error Handling

Field errors are accessible through the `errors` object. Error messages can be extracted using optional chaining:

```tsx
const { errors } = useFormAdapter<FormData>();

// Access error message
errors.email?.message;

// Check if field has error
if (errors.email) {
	// Handle error
}

// Type-safe error access
errors.nested?.field?.message; // Works for nested objects
```

The error structure matches react-hook-form's `FieldErrors<T>` type, providing type-safe access to all field errors.

## Validation Modes

The form adapter supports all react-hook-form validation modes via `mode` option:

```tsx
const form = useFormAdapter({
	mode: 'onChange', // 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all'
	resolver: zodResolver(schema),
});
```

- **`onSubmit`** (default): Validation triggers on form submission
- **`onBlur`**: Validation triggers when field loses focus
- **`onChange`**: Validation triggers on every change
- **`onTouched`**: Validation triggers after first blur, then on every change
- **`all`**: Validation triggers on both blur and change events

## See Also

- `.cursor/rules/architecture/folder-structure-core-ui.mdc` - Core structure guidelines
- `.cursor/rules/quality/conventions.mdc` - Form conventions and best practices
- `@core/ui/input/Input` - Input component that integrates with forms
- `@core/ui/button/Button` - Button component for form submissions
- `@core/forms/controller` - Controller component for controlled form fields
