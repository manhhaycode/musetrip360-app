// Event management hooks
import { APIError, CustomMutationOptions, useMutation } from '@musetrip360/query-foundation';

import { AIChatReq, AIChatResp } from '@/types';

import { chatWithAi } from '../endpoints';

export function useChatWithAI(options?: CustomMutationOptions<AIChatResp, APIError, AIChatReq>) {
  return useMutation((data: AIChatReq) => chatWithAi(data), options);
}
