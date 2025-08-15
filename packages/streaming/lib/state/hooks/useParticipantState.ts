/**
 * @fileoverview Participant State Hook
 *
 * Convenient hook for accessing participant state
 */

import { useParticipantStore, useParticipantSelectors } from '../store/participantStore';

export const useParticipantState = () => {
  const store = useParticipantStore();
  const selectors = useParticipantSelectors();

  return {
    ...store,
    ...selectors,
  };
};
