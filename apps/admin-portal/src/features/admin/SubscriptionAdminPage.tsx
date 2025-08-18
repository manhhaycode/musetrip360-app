'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@musetrip360/ui-core/button';
import { Badge } from '@musetrip360/ui-core/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { CheckCircle, XCircle, Edit, Trash2, Plus, Info, MoreHorizontal, Eye } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function getAccessToken() {
  try {
    const raw = localStorage.getItem('musetrip360-auth-store');
    if (!raw) return undefined;
    const obj = JSON.parse(raw);
    return obj?.state?.accessToken?.token;
  } catch {
    return undefined;
  }
}

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  maxEvents: number;
  discountPercent: number;
  isActive: boolean;
  subscriptionCount: number;
  createdAt: string;
  updatedAt: string;
};
type PlanFormData = {
  name: string;
  description: string;
  price: number | string;
  durationDays: number | string;
  maxEvents: number | string;
  discountPercent: number | string;
  isActive: boolean;
};

const PlanDetailModal: React.FC<{
  plan: Plan | null;
  open: boolean;
  onClose: () => void;
}> = ({ plan, open, onClose }) => {
  if (!open || !plan) return null;
  return (
    <div className="fixed inset-0 z-[101] bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.18 }}
        className="bg-white rounded-2xl shadow-2xl p-7 w-[95vw] max-w-lg relative"
      >
        <button
          className="absolute right-4 top-4 text-gray-400 text-2xl hover:text-red-400 transition-colors"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex items-center gap-2 mb-5">
          <Info className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold">
            Chi tiết gói: <span className="text-blue-600">{plan.name}</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <DetailRow label="Mô tả">{plan.description}</DetailRow>
          <DetailRow label="Giá">{plan.price.toLocaleString()} VNĐ</DetailRow>
          <DetailRow label="Thời hạn">{plan.durationDays} ngày</DetailRow>
          <DetailRow label="Số sự kiện">{plan.maxEvents}</DetailRow>
          <DetailRow label="Giảm giá">{plan.discountPercent}%</DetailRow>
          <DetailRow label="Trạng thái">
            <Badge variant={plan.isActive ? 'default' : 'secondary'}>{plan.isActive ? 'Active' : 'Inactive'}</Badge>
          </DetailRow>
          <DetailRow label="# Đăng ký">{plan.subscriptionCount}</DetailRow>
          <DetailRow label="Ngày tạo">{new Date(plan.createdAt).toLocaleString()}</DetailRow>
          <DetailRow label="Cập nhật">{new Date(plan.updatedAt).toLocaleString()}</DetailRow>
        </div>
      </motion.div>
    </div>
  );
};
const DetailRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex gap-3 items-center border-b last:border-0 pb-2 last:pb-0">
    <div className="font-medium min-w-[110px] text-gray-500">{label}:</div>
    <div className="flex-1">{children}</div>
  </div>
);

const PlanForm: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PlanFormData, id?: string) => void;
  editingPlan?: Plan | null;
  loading?: boolean;
}> = ({ open, onClose, onSubmit, editingPlan, loading }) => {
  const { register, handleSubmit, formState, reset } = useForm<PlanFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      durationDays: 30,
      maxEvents: 0,
      discountPercent: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (editingPlan) {
      reset({
        name: editingPlan.name,
        description: editingPlan.description,
        price: editingPlan.price,
        durationDays: editingPlan.durationDays,
        maxEvents: editingPlan.maxEvents,
        discountPercent: editingPlan.discountPercent,
        isActive: editingPlan.isActive,
      });
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        durationDays: 30,
        maxEvents: 0,
        discountPercent: 0,
        isActive: true,
      });
    }
  }, [editingPlan, open, reset]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/30 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md"
      >
        <h2 className="text-lg font-bold mb-4">
          {editingPlan ? 'Cập nhật gói Subscription' : 'Tạo mới gói Subscription'}
        </h2>
        <form
          onSubmit={handleSubmit((data) => onSubmit(data, editingPlan?.id))}
          className="space-y-3"
          autoComplete="off"
        >
          <div>
            <label className="font-medium block">
              Tên gói <span className="text-red-500">*</span>
            </label>
            <input
              className={`input input-bordered w-full ${formState.errors.name ? 'border-red-500' : ''}`}
              {...register('name', {
                required: 'Tên gói bắt buộc',
                minLength: { value: 3, message: 'Ít nhất 3 ký tự' },
              })}
              disabled={loading}
            />
            {formState.errors.name && <span className="text-red-500 text-xs">{formState.errors.name.message}</span>}
          </div>
          <div>
            <label className="font-medium block">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`input input-bordered w-full ${formState.errors.description ? 'border-red-500' : ''}`}
              {...register('description', {
                required: 'Mô tả bắt buộc',
                minLength: { value: 10, message: 'Ít nhất 10 ký tự' },
              })}
              disabled={loading}
            />
            {formState.errors.description && (
              <span className="text-red-500 text-xs">{formState.errors.description.message}</span>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-medium block">
                Giá (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                className={`input input-bordered w-full ${formState.errors.price ? 'border-red-500' : ''}`}
                type="number"
                min={0}
                step={0.01}
                {...register('price', { required: 'Giá bắt buộc', min: { value: 0, message: '>= 0' } })}
                disabled={loading}
              />
              {formState.errors.price && <span className="text-red-500 text-xs">{formState.errors.price.message}</span>}
            </div>
            <div className="flex-1">
              <label className="font-medium block">
                Thời hạn (ngày) <span className="text-red-500">*</span>
              </label>
              <input
                className={`input input-bordered w-full ${formState.errors.durationDays ? 'border-red-500' : ''}`}
                type="number"
                min={1}
                {...register('durationDays', { required: 'Thời hạn bắt buộc', min: { value: 1, message: '>= 1' } })}
                disabled={loading}
              />
              {formState.errors.durationDays && (
                <span className="text-red-500 text-xs">{formState.errors.durationDays.message}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-medium block">Số sự kiện tối đa</label>
              <input
                className={`input input-bordered w-full ${formState.errors.maxEvents ? 'border-red-500' : ''}`}
                type="number"
                min={0}
                {...register('maxEvents', { required: true, min: { value: 0, message: '>= 0' } })}
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <label className="font-medium block">Giảm giá (%)</label>
              <input
                className={`input input-bordered w-full ${formState.errors.discountPercent ? 'border-red-500' : ''}`}
                type="number"
                min={0}
                max={100}
                {...register('discountPercent', { required: true, min: 0, max: 100 })}
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label>
              <input type="checkbox" {...register('isActive')} className="mr-2" disabled={loading} defaultChecked />
              Đang hoạt động
            </label>
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Huỷ
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : editingPlan ? 'Lưu' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ConfirmDeleteDialog: React.FC<{
  open: boolean;
  plan: Plan | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}> = ({ open, plan, onCancel, onConfirm, loading }) => {
  if (!open || !plan) return null;
  return (
    <div className="fixed inset-0 z-[102] bg-black/30 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        className="bg-white rounded-xl shadow-lg p-6 min-w-[320px]"
      >
        <div className="mb-4 font-bold text-lg text-red-600">Xác nhận xoá?</div>
        <div className="mb-4">
          Bạn muốn xoá gói <b>{plan.name}</b>?
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Huỷ
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            Xoá
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const API_BASE = 'https://api.musetrip360.site/api/v1/subscriptions/plans';

const SubscriptionAdminPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [detailPlan, setDetailPlan] = useState<Plan | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Plan | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      const res = await fetch(API_BASE + '/admin', {
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await res.json();
      setPlans(data.data?.plans || []);
    } catch {
      setMessage({ type: 'error', text: 'Lỗi tải danh sách gói.' });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSubmitPlan = async (plan: PlanFormData, id?: string) => {
    setLoading(true);
    try {
      const token = getAccessToken();
      const payload = {
        name: plan.name,
        description: plan.description,
        price: Number(plan.price),
        durationDays: Number(plan.durationDays),
        maxEvents: Number(plan.maxEvents),
        discountPercent: Number(plan.discountPercent),
        isActive: !!plan.isActive,
      };
      const res = await fetch(id ? `${API_BASE}/${id}` : API_BASE, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setOpenForm(false);
      setEditingPlan(null);
      setMessage({ type: 'success', text: id ? 'Cập nhật thành công' : 'Tạo mới thành công' });
      await fetchPlans();
    } catch {
      setMessage({ type: 'error', text: id ? 'Cập nhật thất bại' : 'Tạo mới thất bại' });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) throw new Error();
      setConfirmDelete(null);
      setMessage({ type: 'success', text: 'Xoá thành công' });
      await fetchPlans();
    } catch {
      setMessage({ type: 'error', text: 'Xoá thất bại' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const tableHeader = (
    <tr className="bg-gray-50 text-gray-700">
      <th className="p-2 font-semibold">Tên gói</th>
      <th className="p-2 font-semibold">Mô tả</th>
      <th className="p-2 font-semibold">Giá (VNĐ)</th>
      <th className="p-2 font-semibold">Thời hạn</th>
      <th className="p-2 font-semibold">Số sự kiện</th>
      <th className="p-2 font-semibold">Giảm giá (%)</th>
      <th className="p-2 font-semibold">Trạng thái</th>
      <th className="p-2 font-semibold"># Đăng ký</th>
      <th className="p-2 font-semibold text-center">Actions</th>
    </tr>
  );

  const tableRows =
    plans.length === 0 && !loading ? (
      <tr>
        <td colSpan={9} className="text-center py-4 text-gray-400">
          Không có dữ liệu
        </td>
      </tr>
    ) : (
      plans.map((plan) => (
        <tr key={plan.id} className="border-b hover:bg-blue-50 group">
          <td className="p-2 font-semibold text-blue-700 max-w-[190px] truncate" title={plan.name}>
            {plan.name}
          </td>
          <td className="p-2 truncate max-w-[240px]" title={plan.description}>
            {plan.description}
          </td>
          <td className="p-2">{plan.price.toLocaleString()}</td>
          <td className="p-2">{plan.durationDays} ngày</td>
          <td className="p-2">{plan.maxEvents}</td>
          <td className="p-2">{plan.discountPercent}%</td>
          <td className="p-2">
            <Badge variant={plan.isActive ? 'default' : 'secondary'}>{plan.isActive ? 'Active' : 'Inactive'}</Badge>
          </td>
          <td className="p-2 text-center">{plan.subscriptionCount}</td>
          <td className="p-2 text-center min-w-[60px]">
            {/* Nút ba chấm actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDetailPlan(plan)}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setEditingPlan(plan);
                    setOpenForm(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setConfirmDelete(plan)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </td>
        </tr>
      ))
    );

  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto pt-8 pb-16">
        <div className="px-6 py-7">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-bold text-2xl tracking-tight flex items-center gap-3">
              <Plus className="h-7 w-7 text-blue-600" />
              Subscription Plans
            </h1>
            <Button
              variant="default"
              onClick={() => {
                setEditingPlan(null);
                setOpenForm(true);
              }}
              disabled={loading}
              className="gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" /> Thêm mới
            </Button>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded border text-sm font-medium flex items-center ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {message.text}
              <button onClick={() => setMessage(null)} className="ml-3 text-lg font-bold px-1">
                ×
              </button>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-[15px] border-separate border-spacing-0">
              <thead>{tableHeader}</thead>
              <tbody>{tableRows}</tbody>
            </table>
            {loading && <div className="py-4 text-center text-gray-400">Đang tải...</div>}
          </div>
        </div>
        <AnimatePresence>
          {openForm && (
            <PlanForm
              open={openForm}
              onClose={() => {
                setOpenForm(false);
                setEditingPlan(null);
              }}
              onSubmit={handleSubmitPlan}
              editingPlan={editingPlan}
              loading={loading}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {detailPlan && <PlanDetailModal open={!!detailPlan} plan={detailPlan} onClose={() => setDetailPlan(null)} />}
        </AnimatePresence>
        {/* Confirm Delete Dialog */}
        <AnimatePresence>
          {confirmDelete && (
            <ConfirmDeleteDialog
              open={!!confirmDelete}
              plan={confirmDelete}
              onCancel={() => setConfirmDelete(null)}
              onConfirm={() => confirmDelete && handleDelete(confirmDelete.id)}
              loading={loading}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubscriptionAdminPage;
