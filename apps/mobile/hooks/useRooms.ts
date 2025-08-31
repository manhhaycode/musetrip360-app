/*import { useGetRoomByEvent } from '@musetrip360/event-management/api';

interface RoomParams {
  eventId?: string;
}

export const useRooms = (params?: RoomParams, options?: { enabled?: boolean }) => {
  console.log('🏠 useRooms called with params:', params);
  console.log('🏠 useRooms options:', options);

  // Use room API
  const apiResult = useGetRoomByEvent(params?.eventId || '', {
    enabled: options?.enabled !== false && !!params?.eventId,
    refetchOnWindowFocus: false,
  });

  console.log('🏠 useRooms API result:', {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};
*/
