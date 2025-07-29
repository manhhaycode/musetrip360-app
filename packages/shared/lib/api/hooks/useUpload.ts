import {
  APIError,
  APIResponse,
  CustomMutationOptions,
  useUploadMutation,
  UploadProgress,
} from '@musetrip360/query-foundation';

/**
 * Hook for single file upload using query-foundation conventions
 */
export function useFileUpload(
  onProgress?: (progress: UploadProgress) => void,
  options?: CustomMutationOptions<APIResponse<any>, APIError, File>
) {
  return useUploadMutation('/upload', onProgress, undefined, options);
}
