import { useSelectionStateContext } from '@/context';

// Re-export the SelectionState interface from context
export type { SelectionState } from '@/context';

/**
 * Hook to access selection state from SelectionStateProvider context.
 * This hook does NOT create its own listener - it reads from the shared context.
 *
 * Must be used within a SelectionStateProvider.
 */
export function useSelectionState() {
  return useSelectionStateContext();
}
