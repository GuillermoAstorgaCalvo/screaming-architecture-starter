/**
 * Controller re-export
 *
 * Exposes react-hook-form's Controller component and related types through the
 * core forms adapter layer so consumers can stay decoupled from the underlying
 * form library.
 */

export type {
	ControllerFieldState,
	ControllerProps,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
	Path,
	PathValue,
	UseControllerProps,
	UseControllerReturn,
} from 'react-hook-form';
export { Controller } from 'react-hook-form';
