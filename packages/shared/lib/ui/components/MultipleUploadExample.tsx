import React, { useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { FormDropZone } from './FormDropZone';
import { MediaType, FileData } from '../../types';
import { useBulkUpload } from '@/contexts';

interface FormData {
  title: string;
  files: Partial<FileData>[];
}

export const MultipleUploadExample: React.FC = () => {
  const [disabled, setDisabled] = React.useState(false);
  const bulkUpload = useBulkUpload();

  const form = useForm<FormData>({
    disabled,
    defaultValues: {
      title: '',
      files: [{}], // Start with one empty file field
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'files',
  });

  const watchedFiles = useWatch({
    control: form.control,
    name: 'files',
  });

  // Automatically add new FormDropZone when all current ones have files
  useEffect(() => {
    const allFilesHaveContent = watchedFiles?.every((file) => file?.file);
    const hasFiles = watchedFiles && watchedFiles.length > 0;

    if (hasFiles && allFilesHaveContent) {
      // Add a new empty field automatically
      append({});
    }
  }, [watchedFiles, append]);

  const onSubmit = async (data: FormData) => {
    const validFiles = data.files.filter((file) => file?.file);
    console.log('Form submitted:', { ...data, files: validFiles });
    setDisabled(true);
    try {
      if (bulkUpload && bulkUpload?.getPendingFiles()?.length > 0) {
        const isAccept = await bulkUpload?.openConfirmDialog();
        if (isAccept) {
          await bulkUpload?.uploadAll();
          console.log('Files uploaded successfully:', form.getValues());
        }
      } else {
        console.log('No files to upload, form data:', form.getValues());
      }
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      <h1 className="text-2xl font-bold">Multiple File Upload with useFieldArray</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Files ({fields.length})</h3>
              <span className="text-sm text-muted-foreground">New fields auto-added when all filled</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">File {index + 1}</span>
                    {fields.length > 1 && (
                      <Button type="button" onClick={() => remove(index)} variant="destructive" size="sm">
                        Remove
                      </Button>
                    )}
                  </div>

                  <FormDropZone
                    name={`files.${index}`}
                    control={form.control}
                    mediaType={MediaType.IMAGE}
                    label={`Upload File ${index + 1}`}
                    description="Select an image file"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit ({watchedFiles?.filter((f) => f?.file).length || 0} files)
          </Button>
        </form>
      </Form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Current Form State:</h4>
        <pre className="text-xs overflow-auto">{JSON.stringify(watchedFiles, null, 2)}</pre>
      </div>
    </div>
  );
};
