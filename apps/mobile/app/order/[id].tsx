import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Text } from '@/components/core/ui/text';
import { OrderTypeEnum, PaymentStatusEnum } from '@musetrip360/payment-management';
import { useGetOrderById } from '@musetrip360/payment-management/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, CreditCard, Package, RefreshCw, User } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: order, isLoading, error, refetch } = useGetOrderById(id || '');

  const handleContinuePayment = () => {
    if (order?.metadata?.checkoutUrl) {
      Linking.openURL(order.metadata.checkoutUrl).catch(() => {
        Alert.alert('Lỗi', 'Không thể mở trang thanh toán. Vui lòng thử lại!');
      });
    } else {
      Alert.alert('Thông báo', 'Không tìm thấy link thanh toán. Vui lòng liên hệ hỗ trợ.');
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const getStatusText = (status: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.Pending:
        return 'Chờ thanh toán';
      case PaymentStatusEnum.Success:
        return 'Đã thanh toán';
      case PaymentStatusEnum.Canceled:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.Pending:
        return '#f59e0b';
      case PaymentStatusEnum.Success:
        return '#10b981';
      case PaymentStatusEnum.Canceled:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getOrderTypeText = (type: OrderTypeEnum) => {
    switch (type) {
      case OrderTypeEnum.Event:
        return 'Đặt vé sự kiện';
      case OrderTypeEnum.Tour:
        return 'Đặt tour';
      case OrderTypeEnum.Subscription:
        return 'Đăng ký dịch vụ';
      default:
        return 'Đơn hàng';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDateTime = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('vi-VN');
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8B4513" />
          <Text className="text-muted-foreground mt-2">Đang tải chi tiết đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (error || !order) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="auto" />

        {/* Header */}
        <View className="flex-row items-center px-4 py-3 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#8B4513" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Chi tiết đơn hàng</Text>
        </View>

        <View className="flex-1 items-center justify-center px-4">
          <Package size={64} color="#dc2626" />
          <Text className="text-red-600 text-lg font-semibold mt-4">Không tìm thấy đơn hàng</Text>
          <Text className="text-muted-foreground text-center mt-2">
            {error?.message || 'Đơn hàng không tồn tại hoặc đã bị xóa'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#8B4513" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Chi tiết đơn hàng</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} className="p-2">
          <RefreshCw size={20} color="#8B4513" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        {/* Order Status */}
        <Card style={{ marginBottom: 20 }}>
          <CardContent className="p-4">
            <View className="flex-row justify-between items-start" style={{ marginBottom: 12 }}>
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground">
                  #{order.metadata?.orderCode || order.id.slice(-8)}
                </Text>
                <Text className="text-muted-foreground">{getOrderTypeText(order.orderType)}</Text>
              </View>
              <View className="items-end">
                <Text className="font-semibold" style={{ color: getStatusColor(order.status) }}>
                  {getStatusText(order.status)}
                </Text>
                <Text className="text-muted-foreground text-sm">{formatDateTime(order.createdAt)}</Text>
              </View>
            </View>

            <View className="bg-primary/5 p-3 rounded-lg">
              <Text className="text-2xl font-bold text-primary">{formatCurrency(order.totalAmount)}</Text>
            </View>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card style={{ marginBottom: 20 }}>
          <CardContent className="p-4">
            <View className="flex-row items-center" style={{ marginBottom: 12 }}>
              <User size={20} color="#8B4513" />
              <Text className="text-base font-semibold text-foreground ml-2">Thông tin khách hàng</Text>
            </View>

            <View>
              <View style={{ marginBottom: 12 }}>
                <Text className="text-sm text-muted-foreground">Họ tên</Text>
                <Text className="text-base text-foreground">{order.createdByUser?.fullName || '-'}</Text>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text className="text-sm text-muted-foreground">Email</Text>
                <Text className="text-base text-foreground">{order.createdByUser?.email || '-'}</Text>
              </View>
              {order.createdByUser?.phoneNumber && (
                <View>
                  <Text className="text-sm text-muted-foreground">Số điện thoại</Text>
                  <Text className="text-base text-foreground">{order.createdByUser.phoneNumber}</Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Event Details */}
        {order.orderEvents && order.orderEvents.length > 0 && (
          <Card style={{ marginBottom: 20 }}>
            <CardContent className="p-4">
              <View className="flex-row items-center" style={{ marginBottom: 12 }}>
                <Calendar size={20} color="#8B4513" />
                <Text className="text-base font-semibold text-foreground ml-2">Chi tiết sự kiện</Text>
              </View>

              {order.orderEvents.map((orderEvent, index) => (
                <View key={index} style={{ marginBottom: index < order.orderEvents.length - 1 ? 16 : 0 }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text className="text-sm text-muted-foreground">Tên sự kiện</Text>
                    <Text className="text-base text-foreground font-medium">
                      {orderEvent.event?.title || 'Đang cập nhật'}
                    </Text>
                  </View>

                  {orderEvent.event?.startTime && (
                    <View style={{ marginBottom: 8 }}>
                      <Text className="text-sm text-muted-foreground">Thời gian bắt đầu</Text>
                      <Text className="text-base text-foreground">{formatDateTime(orderEvent.event.startTime)}</Text>
                    </View>
                  )}

                  {orderEvent.event?.endTime && (
                    <View style={{ marginBottom: 8 }}>
                      <Text className="text-sm text-muted-foreground">Thời gian kết thúc</Text>
                      <Text className="text-base text-foreground">{formatDateTime(orderEvent.event.endTime)}</Text>
                    </View>
                  )}

                  {orderEvent.event?.location && (
                    <View>
                      <Text className="text-sm text-muted-foreground">Địa điểm</Text>
                      <Text className="text-base text-foreground">{orderEvent.event.location}</Text>
                    </View>
                  )}
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card style={{ marginBottom: 20 }}>
          <CardContent className="p-4">
            <Text className="text-base font-semibold text-foreground" style={{ marginBottom: 12 }}>
              Tổng kết đơn hàng
            </Text>

            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Tổng tiền</Text>
              <Text className="text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</Text>
            </View>
          </CardContent>
        </Card>

        {/* Payment Actions */}
        {order.status === PaymentStatusEnum.Pending && order.metadata?.checkoutUrl && (
          <Card style={{ marginBottom: 20 }}>
            <CardContent className="p-4">
              <Text className="text-base font-semibold text-foreground" style={{ marginBottom: 12 }}>
                Thanh toán
              </Text>
              <Text className="text-muted-foreground text-sm" style={{ marginBottom: 16 }}>
                Đơn hàng của bạn chưa được thanh toán. Bấm nút bên dưới để tiếp tục thanh toán.
              </Text>

              <Button
                onPress={handleContinuePayment}
                className="bg-primary w-full p-3 rounded-lg flex-row items-center justify-center"
              >
                <View className="flex-row items-center">
                  <CreditCard size={16} color="white" />
                  <Text className="text-white font-medium ml-2">Tiếp tục thanh toán</Text>
                </View>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Status Info */}
        {order.status === PaymentStatusEnum.Pending && !order.metadata?.checkoutUrl && (
          <Card style={{ marginBottom: 20 }}>
            <CardContent className="p-4">
              <Text className="text-base font-semibold text-foreground" style={{ marginBottom: 12 }}>
                Trạng thái thanh toán
              </Text>
              <Text className="text-muted-foreground text-sm">
                Đơn hàng đang chờ xử lý. Link thanh toán sẽ được tạo sớm. Vui lòng bấm nút làm mới để cập nhật trạng
                thái.
              </Text>
            </CardContent>
          </Card>
        )}

        {order.status === PaymentStatusEnum.Canceled && (
          <Card style={{ marginBottom: 20 }}>
            <CardContent className="p-4">
              <Text className="text-base font-semibold text-red-600" style={{ marginBottom: 8 }}>
                ❌ Thanh toán thất bại
              </Text>
              <Text className="text-muted-foreground text-sm">
                Đơn hàng đã bị hủy hoặc thanh toán thất bại. Vui lòng tạo đơn hàng mới nếu muốn tiếp tục.
              </Text>
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
