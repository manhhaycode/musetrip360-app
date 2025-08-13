/**
 * @fileoverview Room State Hook
 *
 * Convenient hook for accessing room state
 */

import { useRoomStore, useRoomSelectors } from '../store/roomStore';

export const useRoomState = () => {
  const store = useRoomStore();
  const selectors = useRoomSelectors();

  return {
    ...store,
    ...selectors,
  };
};
