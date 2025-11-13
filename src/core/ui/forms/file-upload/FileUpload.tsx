import { FileUploadContent } from '@core/ui/forms/file-upload/components/FileUploadContent';
import { useFileUploadProps } from '@core/ui/forms/file-upload/hooks/useFileUpload';
import type { FileUploadProps } from '@src-types/ui/forms-inputs';

/**
 * FileUpload - File input component with drag-and-drop, preview, progress, and validation
 *
 * Features:
 * - Drag-and-drop support
 * - File preview (images with thumbnails)
 * - Progress indicators for uploads
 * - Multiple file support
 * - File validation UI (size, type, count)
 * - Accessible: proper ARIA attributes and relationships
 * - Size variants: sm, md, lg
 * - Error and helper text display
 * - Full width option
 * - Dark mode support
 * - Automatic ID generation when label is provided
 * - Controlled and uncontrolled modes
 *
 * @example
 * ```tsx
 * <FileUpload
 *   label="Upload Files"
 *   multiple
 *   accept={['image/*', '.pdf']}
 *   onChange={(files) => console.log(files)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <FileUpload
 *   label="Profile Picture"
 *   validation={{
 *     maxSize: 5 * 1024 * 1024, // 5MB
 *     acceptedTypes: ['image/jpeg', 'image/png'],
 *   }}
 *   showProgress
 *   onChange={(file) => handleUpload(file)}
 * />
 * ```
 */
export default function FileUpload(props: Readonly<FileUploadProps>) {
	const { contentProps } = useFileUploadProps({ props });
	return <FileUploadContent {...contentProps} />;
}
