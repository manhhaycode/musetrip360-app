// Event management hooks
import { APIError, CustomMutationOptions, useMutation } from '@musetrip360/query-foundation';

import { AIAudioRes, AIChatReq, AIChatResp } from '@/types';

import { chatWithAi, generateAudio } from '../endpoints';

export function useChatWithAI(options?: CustomMutationOptions<AIChatResp, APIError, AIChatReq>) {
  return useMutation((data: AIChatReq) => chatWithAi(data), options);
}

export function useAudioAIGenerate(options?: CustomMutationOptions<AIAudioRes, APIError, string>) {
  return useMutation((data: string) => generateAudio(data), options);
}
