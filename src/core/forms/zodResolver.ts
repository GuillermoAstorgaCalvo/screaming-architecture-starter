/**
 * ZodResolver - Zod validation resolver for forms
 *
 * Provides Zod schema validation integration with form libraries.
 * Uses @hookform/resolvers to bridge Zod schemas with react-hook-form.
 *
 * Usage:
 * ```ts
 * import { z } from 'zod';
 * import { zodResolver } from '@core/forms/zodResolver';
 * import { useFormAdapter } from '@core/forms/formAdapter';
 *
 * const schema = z.object({
 *   name: z.string().min(1, 'Name is required'),
 *   email: z.string().email('Invalid email'),
 * });
 *
 * const { register, handleSubmit, errors } = useFormAdapter({
 *   resolver: zodResolver(schema),
 * });
 * ```
 */

/**
 * Re-exports the Zod resolver from @hookform/resolvers
 *
 * This provides a consistent API through the form adapter layer,
 * allowing domains to use Zod validation without directly depending on @hookform/resolvers.
 */
export { zodResolver } from '@hookform/resolvers/zod';
