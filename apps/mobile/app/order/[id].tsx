import { Card, CardContent } from '@/components/core/ui/card';
import { Text } from '@/components/core/ui/text';
import { OrderTypeEnum, PaymentStatusEnum } from '@musetrip360/payment-management';
import { useGetOrderById } from '@musetrip360/payment-management/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, Package, User } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: order, isLoading, error } = useGetOrderById(id || '');

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
    } if (error || !order) {
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
                    <Text className="text-red-600 text-lg font-semibold mt-4">
                        Không tìm thấy đơn hàng
                    </Text>
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
            <View className="flex-row items-center px-4 py-3 border-b border-border">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#8B4513" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-foreground">Chi tiết đơn hàng</Text>
            </View>

            <ScrollView className="flex-1">
                <View className="p-4 space-y-4">
                    {/* Order Status */}
                    <Card>
                        <CardContent className="p-4">
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-foreground">
                                        #{order.metadata?.orderCode || order.id.slice(-8)}
                                    </Text>
                                    <Text className="text-muted-foreground">
                                        {getOrderTypeText(order.orderType)}
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <Text className="font-semibold" style={{ color: getStatusColor(order.status) }}>
                                        {getStatusText(order.status)}
                                    </Text>
                                    <Text className="text-muted-foreground text-sm">
                                        {formatDateTime(order.createdAt)}
                                    </Text>
                                </View>
                            </View>

                            <View className="bg-primary/5 p-3 rounded-lg">
                                <Text className="text-2xl font-bold text-primary">
                                    {formatCurrency(order.totalAmount)}
                                </Text>
                            </View>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card>
                        <CardContent className="p-4">
                            <View className="flex-row items-center mb-3">
                                <User size={20} color="#8B4513" />
                                <Text className="text-base font-semibold text-foreground ml-2">Thông tin khách hàng</Text>
                            </View>

                            <View className="space-y-2">
                                <View>
                                    <Text className="text-sm text-muted-foreground">Họ tên</Text>
                                    <Text className="text-base text-foreground">{order.createdByUser?.fullName || '-'}</Text>
                                </View>
                                <View>
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
                        <Card>
                            <CardContent className="p-4">
                                <View className="flex-row items-center mb-3">
                                    <Calendar size={20} color="#8B4513" />
                                    <Text className="text-base font-semibold text-foreground ml-2">Chi tiết sự kiện</Text>
                                </View>

                                {order.orderEvents.map((orderEvent, index) => (
                                    <View key={index} className="space-y-2">
                                        <View>
                                            <Text className="text-sm text-muted-foreground">Tên sự kiện</Text>
                                            <Text className="text-base text-foreground font-medium">
                                                {orderEvent.event?.title || 'Đang cập nhật'}
                                            </Text>
                                        </View>

                                        {orderEvent.event?.startTime && (
                                            <View>
                                                <Text className="text-sm text-muted-foreground">Thời gian bắt đầu</Text>
                                                <Text className="text-base text-foreground">
                                                    {formatDateTime(orderEvent.event.startTime)}
                                                </Text>
                                            </View>
                                        )}

                                        {orderEvent.event?.endTime && (
                                            <View>
                                                <Text className="text-sm text-muted-foreground">Thời gian kết thúc</Text>
                                                <Text className="text-base text-foreground">
                                                    {formatDateTime(orderEvent.event.endTime)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Order Summary */}
                    <Card>
                        <CardContent className="p-4">
                            <Text className="text-base font-semibold text-foreground mb-3">Tổng kết đơn hàng</Text>

                            <View className="flex-row justify-between">
                                <Text className="text-muted-foreground">Tổng tiền</Text>
                                <Text className="text-lg font-bold text-primary">
                                    {formatCurrency(order.totalAmount)}
                                </Text>
                            </View>
                        </CardContent>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
