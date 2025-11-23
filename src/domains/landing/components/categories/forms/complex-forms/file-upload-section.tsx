import FileUpload from '@core/ui/forms/file-upload/FileUpload';
import ShowcaseSection from '@domains/landing/components/shared/ShowcaseSection';

export function FileUploadSection() {
	return (
		<ShowcaseSection
			title="FileUpload"
			description="File upload component with drag-and-drop"
			tags={['form', 'input', 'file', 'upload']}
		>
			<div className="space-y-4">
				<FileUpload
					label="Upload File"
					onChange={files => {
						console.warn('Files selected:', files);
					}}
				/>
				<FileUpload
					label="Upload Multiple Files"
					multiple
					accept={['image/*', '.pdf']}
					onChange={files => {
						console.warn('Files selected:', files);
					}}
				/>
			</div>
		</ShowcaseSection>
	);
}
