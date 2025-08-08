import {
  MuseumRequest,
  MuseumRequestDataTable,
  MuseumRequestDetailModal,
  useApproveMuseumRequest,
  useGetMuseumRequests,
  useRejectMuseumRequest,
} from '@musetrip360/museum-management';
import { APIError } from '@musetrip360/query-foundation';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { CheckCircle, Clock, FileText, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// ======================== Components ========================
function RequestStats({ data }: { data: MuseumRequest[] }) {
  const stats = {
    total: data.length,
    pending: data.filter((r) => r.status === 'Pending').length,
    approved: data.filter((r) => r.status === 'Approved').length,
    rejected: data.filter((r) => r.status === 'Rejected').length,
    draft: data.filter((r) => r.status === 'Draft').length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tổng yêu cầu</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Chờ duyệt</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Đã duyệt</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.approved}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Từ chối</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ======================== Main Component ========================
export default function MuseumRequests() {
  const [selectedRequest, setSelectedRequest] = useState<MuseumRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Only get all requests for stats - table handles its own data
  const { data: allRequestsData, isLoading } = useGetMuseumRequests({
    Page: 1,
    PageSize: 1000, // Get all for stats
  });

  const approveMuseumRequest = useApproveMuseumRequest({
    onSuccess: () => {
      toast.success('Yêu cầu tạo bảo tàng đã được phê duyệt');
      setIsDetailModalOpen(false);
      setSelectedRequest(null);
    },
    onError: (error: APIError) => {
      toast.error(error.message || 'Có lỗi xảy ra khi phê duyệt yêu cầu');
    },
  });

  const rejectMuseumRequest = useRejectMuseumRequest({
    onSuccess: () => {
      toast.success('Yêu cầu tạo bảo tàng đã bị từ chối');
      setIsDetailModalOpen(false);
      setSelectedRequest(null);
    },
    onError: (error: APIError) => {
      toast.error(error.message || 'Có lỗi xảy ra khi từ chối yêu cầu');
    },
  });

  const handleViewRequest = (request: MuseumRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleApproveRequest = (request: MuseumRequest) => {
    approveMuseumRequest.mutate(request.id);
  };

  const handleRejectRequest = (request: MuseumRequest) => {
    rejectMuseumRequest.mutate(request.id);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  const requests = allRequestsData?.data?.list || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <RequestStats data={requests} />

      {/* Table - handles its own data fetching */}
      <MuseumRequestDataTable
        onView={handleViewRequest}
        onApprove={handleApproveRequest}
        onReject={(request: MuseumRequest) => {
          setSelectedRequest(request);
          setIsDetailModalOpen(true);
        }}
      />

      {/* Detail Modal */}
      <MuseumRequestDetailModal
        request={selectedRequest}
        open={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        isLoading={approveMuseumRequest.isPending || rejectMuseumRequest.isPending}
      />
    </div>
  );
}
