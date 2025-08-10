/**
 * @fileoverview Streaming State Hook
 *
 * Convenient hook for accessing streaming state
 */

import { useStreamingStore, useStreamingSelectors } from '../store/streamingStore';

export const useStreamingState = () => {
  const store = useStreamingStore();
  const selectors = useStreamingSelectors();

  return {
    ...store,
    ...selectors,
  };
};

export default useStreamingState;
