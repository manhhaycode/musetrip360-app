'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Edit,
  Save,
  X,
  AlertTriangle,
  FileText,
  Users,
  MapPin,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

import {
  useGetPoliciesByMuseum,
  useCreatePolicy,
  useUpdatePolicy,
  useDeletePolicy,
  useMuseumStore,
  MuseumPolicy,
  PolicyTypeEnum,
} from '@musetrip360/museum-management';

import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Badge } from '@musetrip360/ui-core/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@musetrip360/ui-core/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@musetrip360/ui-core/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@musetrip360/ui-core/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';

import Divider from '@/components/Divider';
import get from 'lodash.get';

// Policy type options for UI display
const policyTypeOptions = [
  { value: PolicyTypeEnum.TermsOfService, label: 'Điều khoản dịch vụ', icon: FileText },
  { value: PolicyTypeEnum.Visitor, label: 'Chính sách khách tham quan', icon: Users },
  { value: PolicyTypeEnum.Tour, label: 'Chính sách tour', icon: MapPin },
  { value: PolicyTypeEnum.Refund, label: 'Chính sách hoàn tiền', icon: RefreshCw },
];

// Helper function to get policy type option by value
const getPolicyTypeOption = (policyType: PolicyTypeEnum) => {
  return policyTypeOptions.find((option) => option.value === policyType);
};

// Validation schema for policy creation/editing
const policySchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
  content: z.string().min(1, 'Nội dung là bắt buộc').min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  policyType: z.nativeEnum(PolicyTypeEnum, { required_error: 'Loại chính sách là bắt buộc' }),
  zOrder: z.number().min(0, 'Thứ tự hiển thị phải là số không âm'),
});

type PolicyFormData = z.infer<typeof policySchema>;

const MuseumPolicyPage = () => {
  const { selectedMuseum } = useMuseumStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<MuseumPolicy | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pagination] = useState({ Page: 1, PageSize: 100 });
  const [deletingPolicyId, setDeletingPolicyId] = useState<string | null>(null);

  // Handle dialog close
  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingPolicy(null);
    form.reset({
      title: '',
      content: '',
      policyType: PolicyTypeEnum.TermsOfService,
      zOrder: 0,
    });
  };

  // Fetch policies for the selected museum
  const {
    data: policiesResponse,
    isLoading,
    error,
    refetch,
  } = useGetPoliciesByMuseum(
    selectedMuseum?.id ?? '',
    { Page: pagination.Page, PageSize: pagination.PageSize },
    {
      enabled: !!selectedMuseum?.id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Create policy mutation
  const { mutate: createPolicy, isPending: isCreating } = useCreatePolicy({
    onSuccess: () => {
      setSuccessMessage('Chính sách đã được tạo thành công!');
      setErrorMessage(null);
      handleCloseDialog();
      setTimeout(() => {
        if (refetch) {
          refetch();
        }
      }, 100);
    },
    onError: (error) => {
      setErrorMessage('Có lỗi xảy ra khi tạo chính sách. Vui lòng thử lại.');
      console.error('Create policy error:', error);
    },
  });

  // Update policy mutation
  const { mutate: updatePolicy, isPending: isUpdating } = useUpdatePolicy({
    onSuccess: () => {
      setSuccessMessage('Chính sách đã được cập nhật thành công!');
      setErrorMessage(null);
      handleCloseDialog();
      setTimeout(() => {
        if (refetch) {
          refetch();
        }
      }, 100);
    },
    onError: (error) => {
      setErrorMessage('Có lỗi xảy ra khi cập nhật chính sách. Vui lòng thử lại.');
      console.error('Update policy error:', error);
    },
  });

  // Delete policy mutation
  const { mutate: deletePolicy, isPending: isDeleting } = useDeletePolicy({
    onSuccess: () => {
      setSuccessMessage('Chính sách đã được xóa thành công!');
      setErrorMessage(null);
      setDeletingPolicyId(null);
      setTimeout(() => {
        if (refetch) {
          refetch();
        }
      }, 100);
    },
    onError: (error) => {
      setErrorMessage('Có lỗi xảy ra khi xóa chính sách. Vui lòng thử lại.');
      setDeletingPolicyId(null);
      console.error('Delete policy error:', error);
    },
  });

  // Form handling
  const form = useForm<PolicyFormData>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      title: '',
      content: '',
      policyType: PolicyTypeEnum.TermsOfService,
      zOrder: 0,
    },
  });

  // Handle form submission
  const handleSubmit = (data: PolicyFormData) => {
    if (!selectedMuseum?.id) {
      setErrorMessage('Không tìm thấy thông tin bảo tàng');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    if (editingPolicy) {
      // Update existing policy
      const updateData = {
        id: editingPolicy.id,
        title: data.title,
        content: data.content,
        policyType: data.policyType,
        isActive: editingPolicy.isActive, // Keep the current active state
        zOrder: data.zOrder,
        museumId: selectedMuseum.id,
      };
      updatePolicy(updateData);
    } else {
      // Create new policy
      const policyData = {
        title: data.title,
        content: data.content,
        policyType: data.policyType,
        zOrder: data.zOrder,
        museumId: selectedMuseum.id,
      };
      createPolicy(policyData);
    }
  };

  // Handle edit policy
  const handleEditPolicy = (policy: MuseumPolicy) => {
    try {
      setEditingPolicy(policy);
      form.reset({
        title: policy.title,
        content: policy.content,
        policyType: policy.policyType,
        zOrder: policy.zOrder,
      });
      setIsCreateDialogOpen(true);
    } catch (error) {
      console.error('Error editing policy:', error);
      setErrorMessage('Có lỗi xảy ra khi chỉnh sửa chính sách.');
    }
  };

  // Handle delete policy
  const handleDeletePolicy = (policyId: string) => {
    setDeletingPolicyId(policyId);
    deletePolicy(policyId);
  };

  // Handle toggle policy status
  const handleTogglePolicyStatus = (policy: MuseumPolicy) => {
    const updateData = {
      id: policy.id,
      title: policy.title,
      content: policy.content,
      policyType: policy.policyType,
      isActive: !policy.isActive,
      zOrder: policy.zOrder,
      museumId: policy.museumId,
    };
    updatePolicy(updateData);
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Get policies data
  const policies = get(policiesResponse, 'list', []) || [];

  // Loading state
  if (!selectedMuseum?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Chưa chọn bảo tàng</h2>
          <p className="text-gray-500">Vui lòng chọn một bảo tàng để quản lý chính sách.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý chính sách</h1>
          <p className="text-muted-foreground">Quản lý các chính sách cho bảo tàng {selectedMuseum?.name}</p>
        </div>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleCloseDialog();
            } else {
              setIsCreateDialogOpen(true);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo chính sách mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPolicy ? 'Chỉnh sửa chính sách' : 'Tạo chính sách mới'}</DialogTitle>
              <DialogDescription>
                {editingPolicy ? 'Cập nhật thông tin chính sách' : 'Thêm chính sách mới cho bảo tàng của bạn'}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề chính sách</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề chính sách" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="policyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại chính sách</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value)} value={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại chính sách" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {policyTypeOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <SelectItem key={option.value} value={String(option.value)}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nội dung chính sách</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập nội dung chi tiết của chính sách..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Mô tả chi tiết nội dung chính sách của bảo tàng</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thứ tự hiển thị</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Số thứ tự để sắp xếp hiển thị (0 = hiển thị đầu tiên)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isCreating || isUpdating}>
                    {(isCreating || isUpdating) && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    )}
                    <Save className="h-4 w-4 mr-2" />
                    {editingPolicy ? 'Cập nhật' : 'Tạo mới'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Divider />

      {/* Messages */}
      {successMessage && (
        <div className="animate-in slide-in-from-bottom-1 duration-200 rounded-md bg-green-50 p-3 text-sm text-green-800 border border-green-200">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="animate-in slide-in-from-top-1 duration-200 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          Có lỗi xảy ra khi tải danh sách chính sách. Vui lòng thử lại.
        </div>
      )}

      {/* Policies List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách chính sách</CardTitle>
          <CardDescription>Quản lý tất cả các chính sách của bảo tàng {selectedMuseum?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          {policies.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Chưa có chính sách nào</h3>
              <p className="text-gray-500">Hãy tạo chính sách đầu tiên cho bảo tàng của bạn.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {policies.map((policy: MuseumPolicy) => {
                const policyTypeOption = getPolicyTypeOption(policy.policyType);
                const Icon = policyTypeOption?.icon || FileText;

                return (
                  <div key={policy.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-medium text-lg">{policy.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Icon className="h-4 w-4" />
                            <span>{policyTypeOption?.label || 'Không xác định'}</span>
                          </div>
                          <Badge variant={policy.isActive ? 'default' : 'secondary'} className="text-xs">
                            {policy.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{policy.content}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePolicyStatus(policy)}
                          disabled={isUpdating}
                        >
                          {policy.isActive ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => handleEditPolicy(policy)}>
                          <Edit className="h-4 w-4 mr-1" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" disabled={isDeleting && deletingPolicyId === policy.id}>
                              {isDeleting && deletingPolicyId === policy.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-1" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-1" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa chính sách</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa chính sách "{policy.title}"? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePolicy(policy.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MuseumPolicyPage;
