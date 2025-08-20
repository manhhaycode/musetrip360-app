import { useArtifactsByMuseum } from '@musetrip360/artifact-management/api';

interface ArtifactSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
  HistoricalPeriods?: string[];
}

export const useArtifacts = (params?: ArtifactSearchParams) => {
  // Use real API exactly like visitor-portal when museumId is provided
  const apiResult = useArtifactsByMuseum(
    {
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 10,
      museumId: params?.museumId || '',
      HistoricalPeriods: params?.HistoricalPeriods,
    },
    {
      enabled: !!params?.museumId,
    }
  );

  // If no museumId provided, return mock data for homepage
  if (!params?.museumId) {
    const mockArtifacts = [
      {
        id: '1',
        name: 'Tượng Phật cổ',
        description: 'Tượng Phật được chạm khắc từ thế kỷ 15',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        model3DUrl: '',
        historicalPeriod: 'Thế kỷ 15',
        rating: 4.8,
        isActive: true,
        museumId: '1',
        createdBy: '',
        metadata: {
          type: 'Tượng',
          material: 'Đá',
          discoveryLocation: 'Chùa Một Cột',
        },
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
      {
        id: '2',
        name: 'Gốm sứ Huế',
        description: 'Bộ sưu tập gốm sứ hoàng gia triều Nguyễn',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        model3DUrl: '',
        historicalPeriod: 'Triều Nguyễn',
        rating: 4.6,
        isActive: true,
        museumId: '2',
        createdBy: '',
        metadata: {
          type: 'Gốm sứ',
          material: 'Sứ',
          discoveryLocation: 'Huế',
        },
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
      {
        id: '3',
        name: 'Tranh Đông Hồ',
        description: 'Tranh dân gian truyền thống Việt Nam',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        model3DUrl: '',
        historicalPeriod: 'Thế kỷ 17',
        rating: 4.7,
        isActive: true,
        museumId: '1',
        createdBy: '',
        metadata: {
          type: 'Tranh',
          material: 'Giấy dó',
          discoveryLocation: 'Bắc Ninh',
        },
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    ];

    return {
      data: {
        list: mockArtifacts,
      },
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};
