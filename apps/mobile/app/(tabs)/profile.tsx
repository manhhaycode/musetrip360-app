import { useAuthStore } from '@musetrip360/auth-system/state';
import { useGetUserEventParticipants } from '@musetrip360/event-management/api';
import { EventParticipant, EventStatusEnum, EventTypeEnum, ParticipantRoleEnum } from '@musetrip360/event-management/types';
import { Order, OrderTypeEnum, PaymentStatusEnum } from '@musetrip360/payment-management';
import { useGetOrders } from '@musetrip360/payment-management/api';
import { useCurrentProfile } from '@musetrip360/user-management/api';
import { useRouter } from 'expo-router';
import { Calendar, ChevronRight, Eye, Lock, LogOut, MapPin, Package, ShoppingBag, Ticket, User, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Tab types
type TabType = 'profile' | 'orders' | 'events';

export default function ProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { resetStore, userId } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Orders data
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useGetOrders({
    Page: 1,
    PageSize: 10,
  });

  // Events data
  const { data: eventParticipants, isLoading: eventsLoading, error: eventsError } = useGetUserEventParticipants(userId || '', {
    enabled: !!userId,
  });

  const handleLogout = () => {
    resetStore();
  };

  const renderTabButton = (tab: TabType, icon: React.ReactNode, title: string) => (
    <TouchableOpacity
      key={tab}
      className={`flex-1 py-3 px-4 rounded-lg ${activeTab === tab ? 'bg-primary' : 'bg-card'}`}
      onPress={() => setActiveTab(tab)}
    >
      <View className="items-center">
        <View className={`${activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
          {icon}
        </View>
        <Text className={`text-xs font-medium mt-1 ${activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusText = (status: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.Success:
        return 'Thành công';
      case PaymentStatusEnum.Pending:
        return 'Đang xử lý';
      case PaymentStatusEnum.Canceled:
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status: PaymentStatusEnum) => {
    switch (status) {
      case PaymentStatusEnum.Success:
        return 'text-green-600';
      case PaymentStatusEnum.Pending:
        return 'text-yellow-600';
      case PaymentStatusEnum.Canceled:
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getOrderTypeText = (type: OrderTypeEnum) => {
    switch (type) {
      case OrderTypeEnum.Event:
        return 'Sự kiện';
      case OrderTypeEnum.Tour:
        return 'Tour';
      case OrderTypeEnum.Subscription:
        return 'Đăng ký';
      default:
        return type;
    }
  };

  const getEventTypeText = (type: EventTypeEnum) => {
    switch (type) {
      case EventTypeEnum.Exhibition:
        return 'Triển lãm';
      case EventTypeEnum.Workshop:
        return 'Workshop';
      case EventTypeEnum.SpecialEvent:
        return 'Sự kiện đặc biệt';
      case EventTypeEnum.HolidayEvent:
        return 'Sự kiện lễ hội';
      default:
        return type;
    }
  };

  const getEventStatusText = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.Published:
        return 'Đang diễn ra';
      case EventStatusEnum.Draft:
        return 'Bản nháp';
      case EventStatusEnum.Pending:
        return 'Chờ duyệt';
      case EventStatusEnum.Cancelled:
        return 'Đã hủy';
      case EventStatusEnum.Expired:
        return 'Đã kết thúc';
      default:
        return status;
    }
  };

  const getRoleText = (role: ParticipantRoleEnum) => {
    switch (role) {
      case ParticipantRoleEnum.Attendee:
        return 'Người tham gia';
      case ParticipantRoleEnum.Organizer:
        return 'Tổ chức';
      case ParticipantRoleEnum.TourGuide:
        return 'Hướng dẫn viên';
      case ParticipantRoleEnum.Guest:
        return 'Khách mời';
      default:
        return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEventItem = ({ item }: { item: EventParticipant }) => {
    const event = item.event;
    if (!event) return null;

    return (
      <View className="bg-card p-4 mb-3 rounded-lg border border-border">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="font-semibold text-foreground text-base mb-1">{event.title}</Text>
            <Text className="text-muted-foreground text-sm mb-2">
              {getEventTypeText(event.eventType)} • {getRoleText(item.role)}
            </Text>
            <Text className="text-muted-foreground text-xs">
              Tham gia: {formatDate(item.joinedAt)}
            </Text>
          </View>
          <View className="bg-primary/10 px-2 py-1 rounded">
            <Text className="text-primary text-xs font-medium">
              {getEventStatusText(event.status)}
            </Text>
          </View>
        </View>

        <Text className="text-muted-foreground text-sm mb-3" numberOfLines={2}>
          {event.description}
        </Text>

        <View className="space-y-2 mb-3">
          <View className="flex-row items-center">
            <Calendar size={14} color="#a67c52" />
            <Text className="text-xs text-muted-foreground ml-2">
              {formatDate(event.startTime)} - {formatDate(event.endTime)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <MapPin size={14} color="#a67c52" />
            <Text className="text-xs text-muted-foreground ml-2" numberOfLines={1}>
              {event.location}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Users size={14} color="#a67c52" />
            <Text className="text-xs text-muted-foreground ml-2">
              {event.capacity - event.availableSlots}/{event.capacity} người tham gia
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ticket size={14} color="#8B4513" />
            <Text className="font-bold text-primary text-sm ml-1">
              {event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center bg-primary/10 px-3 py-1 rounded-full"
            onPress={() => router.push(`/event/${event.id}`)}
          >
            <Eye size={14} color="#8B4513" />
            <Text className="text-primary text-xs ml-1 font-medium">Chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View className="bg-card p-4 mb-3 rounded-lg border border-border">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="font-semibold text-foreground text-base">
            Đơn hàng #{item.metadata?.orderCode || item.id.slice(-8)}
          </Text>
          <Text className="text-muted-foreground text-sm">
            {getOrderTypeText(item.orderType)} • {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <Text className={`font-medium text-sm ${getStatusColor(item.status)}`}>
          {getStatusText(item.status)}
        </Text>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="font-bold text-primary text-lg">
          {formatCurrency(item.totalAmount)}
        </Text>
        <TouchableOpacity
          className="flex-row items-center bg-primary/10 px-3 py-1 rounded-full"
          onPress={() => router.push(`/order/${item.id}` as any)}
        >
          <Eye size={14} color="#8B4513" />
          <Text className="text-primary text-xs ml-1 font-medium">Chi tiết</Text>
        </TouchableOpacity>
      </View>

      {item.orderEvents && item.orderEvents.length > 0 && (
        <View className="mt-2 p-2 bg-blue-50 rounded">
          <Text className="text-blue-700 text-xs font-medium">
            Sự kiện: {item.orderEvents[0].event?.title || 'Đang cập nhật'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderProfileSection = () => (
    <ScrollView className="flex-1 px-4">
      <View className="items-center mb-6">
        {profile?.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} className="w-24 h-24 rounded-full mb-3" />
        ) : (
          <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-3">
            <User size={48} color="#fff6ed" />
          </View>
        )}
        <Text className="text-xl font-bold text-foreground">{profile?.fullName || profile?.email}</Text>
        <Text className="text-muted-foreground text-sm">{profile?.email}</Text>
      </View>

      {/* Profile Info */}
      <View className="space-y-4">
        <View className="bg-card p-4 rounded-lg border border-border">
          <Text className="text-base font-semibold text-foreground mb-3">Thông tin cá nhân</Text>

          <View className="space-y-3">
            <View>
              <Text className="text-sm font-medium text-muted-foreground">Họ tên</Text>
              <Text className="text-base text-foreground">{profile?.fullName || '-'}</Text>
            </View>

            <View>
              <Text className="text-sm font-medium text-muted-foreground">Email</Text>
              <Text className="text-base text-foreground">{profile?.email || '-'}</Text>
            </View>

            <View>
              <Text className="text-sm font-medium text-muted-foreground">Số điện thoại</Text>
              <Text className="text-base text-foreground">{profile?.phoneNumber || '-'}</Text>
            </View>

            <View>
              <Text className="text-sm font-medium text-muted-foreground">Ngày sinh</Text>
              <Text className="text-base text-foreground">
                {profile?.birthDate ? formatDate(profile.birthDate) : '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <TouchableOpacity
            className="bg-card p-4 rounded-lg border border-border flex-row items-center justify-between"
            onPress={() => router.push('/profile/edit')}
          >
            <View className="flex-row items-center">
              <User size={20} color="#8B4513" />
              <Text className="ml-3 text-base font-medium text-foreground">Chỉnh sửa thông tin</Text>
            </View>
            <ChevronRight size={20} color="#8B4513" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-card p-4 rounded-lg border border-border flex-row items-center justify-between"
            onPress={() => router.push('/(tabs)/change-password')}
          >
            <View className="flex-row items-center">
              <Lock size={20} color="#8B4513" />
              <Text className="ml-3 text-base font-medium text-foreground">Đổi mật khẩu</Text>
            </View>
            <ChevronRight size={20} color="#8B4513" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-card p-4 rounded-lg border border-red-200 flex-row items-center justify-between"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <LogOut size={20} color="#dc2626" />
              <Text className="ml-3 text-base font-medium text-red-600">Đăng xuất</Text>
            </View>
            <ChevronRight size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderOrdersSection = () => {
    // API returns {list: Order[], total: number} directly, not wrapped in data
    // Cast to any to bypass type checking since actual response differs from type definition
    const orders = (ordersData as any)?.list || [];
    const total = (ordersData as any)?.total || 0;

    return (
      <View className="flex-1 px-4">
        <Text className="text-lg font-bold text-foreground mb-4">Đơn hàng của tôi</Text>

        {ordersLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#8B4513" />
            <Text className="text-muted-foreground mt-2">Đang tải đơn hàng...</Text>
          </View>
        ) : ordersError ? (
          <View className="flex-1 items-center justify-center py-8">
            <Package size={48} color="#dc2626" />
            <Text className="text-red-600 text-center mt-4">
              Lỗi tải đơn hàng
            </Text>
            <Text className="text-muted-foreground text-center text-sm mt-2">
              {ordersError?.message || 'Có lỗi xảy ra khi tải dữ liệu'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-8">
                <Package size={48} color="#a67c52" />
                <Text className="text-muted-foreground text-center mt-4">
                  Chưa có đơn hàng nào
                </Text>
                <Text className="text-muted-foreground text-center text-sm mt-2">
                  Tổng số đơn hàng: {total}
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  };

  const renderEventsSection = () => {
    const events = eventParticipants || [];

    return (
      <View className="flex-1 px-4">
        <Text className="text-lg font-bold text-foreground mb-4">Sự kiện đã tham gia</Text>

        {eventsLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#8B4513" />
            <Text className="text-muted-foreground mt-2">Đang tải sự kiện...</Text>
          </View>
        ) : eventsError ? (
          <View className="flex-1 items-center justify-center py-8">
            <Calendar size={48} color="#dc2626" />
            <Text className="text-red-600 text-center mt-4">
              Lỗi tải sự kiện
            </Text>
            <Text className="text-muted-foreground text-center text-sm mt-2">
              {eventsError?.message || 'Có lỗi xảy ra khi tải dữ liệu'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-8">
                <Calendar size={48} color="#a67c52" />
                <Text className="text-muted-foreground text-center mt-4">
                  Chưa tham gia sự kiện nào
                </Text>
                <Text className="text-muted-foreground text-center text-sm mt-2">
                  Hãy khám phá các sự kiện thú vị!
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  };

  if (profileLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8B4513" />
        <Text className="text-muted-foreground mt-2">Đang tải thông tin...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Hồ sơ</Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row px-4 py-3 space-x-2">
        {renderTabButton('profile', <User size={20} color={activeTab === 'profile' ? '#fff6ed' : '#a67c52'} />, 'Thông tin')}
        {renderTabButton('orders', <ShoppingBag size={20} color={activeTab === 'orders' ? '#fff6ed' : '#a67c52'} />, 'Đơn hàng')}
        {renderTabButton('events', <Calendar size={20} color={activeTab === 'events' ? '#fff6ed' : '#a67c52'} />, 'Sự kiện')}
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === 'profile' && renderProfileSection()}
        {activeTab === 'orders' && renderOrdersSection()}
        {activeTab === 'events' && renderEventsSection()}
      </View>
    </SafeAreaView>
  );
}
