import { useAuthStore } from '@musetrip360/auth-system/state';
import { useGetUserEventParticipants } from '@musetrip360/event-management/api';
import {
  EventParticipant,
  EventStatusEnum,
  EventTypeEnum,
  ParticipantRoleEnum,
} from '@musetrip360/event-management/types';
import { Order, OrderTypeEnum, PaymentStatusEnum } from '@musetrip360/payment-management';
import { useGetOrders } from '@musetrip360/payment-management/api';
import { useCurrentProfile } from '@musetrip360/user-management/api';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  Calendar,
  ChevronRight,
  Eye,
  Lock,
  LogOut,
  MapPin,
  Package,
  ShoppingBag,
  Ticket,
  User,
  Users,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Tab types
type TabType = 'profile' | 'orders' | 'events';

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { resetStore, userId } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  // Set activeTab based on query parameter
  React.useEffect(() => {
    if (params.tab && ['profile', 'orders', 'events'].includes(params.tab as string)) {
      setActiveTab(params.tab as TabType);
    }
  }, [params.tab]);

  // Orders data
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useGetOrders({
    Page: 1,
    PageSize: 10,
  });

  // Events data
  const {
    data: eventParticipants,
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useGetUserEventParticipants(userId || '', {
    enabled: !!userId,
  });

  // Refetch data when screen is focused (especially after returning from payment)
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        if (activeTab === 'events') {
          refetchEvents();
        } else if (activeTab === 'orders') {
          refetchOrders();
        }
      }
    }, [userId, activeTab, refetchEvents, refetchOrders])
  );

  const handleLogout = () => {
    resetStore();
  };

  const renderTabButton = (tab: TabType, icon: React.ReactNode, title: string) => (
    <TouchableOpacity
      key={tab}
      className={`flex-1 py-4 px-4 rounded-lg ${activeTab === tab ? 'bg-primary' : 'bg-card'}`}
      onPress={() => {
        setActiveTab(tab);
        // Refetch data when switching tabs
        if (tab === 'events' && userId) {
          refetchEvents();
        } else if (tab === 'orders' && userId) {
          refetchOrders();
        }
      }}
      style={{ marginHorizontal: 8 }}
    >
      <View className="items-center">
        <View className={`${activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{icon}</View>
        <Text
          className={`text-xs font-medium ${activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground'}`}
          style={{ marginTop: 6 }}
        >
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
      <View className="bg-card p-4 rounded-lg border border-border" style={{ marginBottom: 16 }}>
        <View className="flex-row justify-between items-start" style={{ marginBottom: 12 }}>
          <View className="flex-1">
            <Text className="font-semibold text-foreground text-base" style={{ marginBottom: 4 }}>
              {event.title}
            </Text>
            <Text className="text-muted-foreground text-sm" style={{ marginBottom: 8 }}>
              {getEventTypeText(event.eventType)} • {getRoleText(item.role)}
            </Text>
            <Text className="text-muted-foreground text-xs">Tham gia: {formatDate(item.joinedAt)}</Text>
          </View>
          <View className="bg-primary/10 px-2 py-1 rounded">
            <Text className="text-primary text-xs font-medium">{getEventStatusText(event.status)}</Text>
          </View>
        </View>

        <Text className="text-muted-foreground text-sm" numberOfLines={2} style={{ marginBottom: 12 }}>
          {event.description}
        </Text>

        <View style={{ marginBottom: 12 }}>
          <View className="flex-row items-center" style={{ marginBottom: 8 }}>
            <Calendar size={14} color="#a67c52" />
            <Text className="text-xs text-muted-foreground" style={{ marginLeft: 8 }}>
              {formatDate(event.startTime)} - {formatDate(event.endTime)}
            </Text>
          </View>

          <View className="flex-row items-center" style={{ marginBottom: 8 }}>
            <MapPin size={14} color="#a67c52" />
            <Text className="text-xs text-muted-foreground" numberOfLines={1} style={{ marginLeft: 8 }}>
              {event.location}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Users size={14} color="#a67c52" />
            <Text className="text-xs text-muted-foreground" style={{ marginLeft: 8 }}>
              {event.capacity - event.availableSlots}/{event.capacity} người tham gia
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ticket size={14} color="#8B4513" />
            <Text className="font-bold text-primary text-sm" style={{ marginLeft: 4 }}>
              {event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center bg-primary/10 px-3 py-1 rounded-full"
            onPress={() => router.push(`/event/${event.id}`)}
          >
            <Eye size={14} color="#8B4513" />
            <Text className="text-primary text-xs font-medium" style={{ marginLeft: 4 }}>
              Chi tiết
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderOrderItem = ({ item }: { item: Order }) => (
    <View className="bg-card p-4 rounded-lg border border-border" style={{ marginBottom: 16 }}>
      <View className="flex-row justify-between items-start" style={{ marginBottom: 8 }}>
        <View className="flex-1">
          <Text className="font-semibold text-foreground text-base">
            Đơn hàng #{item.metadata?.orderCode || item.id.slice(-8)}
          </Text>
          <Text className="text-muted-foreground text-sm">
            {getOrderTypeText(item.orderType)} • {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <Text className={`font-medium text-sm ${getStatusColor(item.status)}`}>{getStatusText(item.status)}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="font-bold text-primary text-lg">{formatCurrency(item.totalAmount)}</Text>
        <TouchableOpacity
          className="flex-row items-center bg-primary/10 px-3 py-1 rounded-full"
          onPress={() => router.push(`/order/${item.id}` as any)}
        >
          <Eye size={14} color="#8B4513" />
          <Text className="text-primary text-xs font-medium" style={{ marginLeft: 4 }}>
            Chi tiết
          </Text>
        </TouchableOpacity>
      </View>

      {item.orderEvents && item.orderEvents.length > 0 && (
        <View className="p-2 bg-blue-50 rounded" style={{ marginTop: 8 }}>
          <Text className="text-blue-700 text-xs font-medium">
            Sự kiện: {item.orderEvents[0].event?.title || 'Đang cập nhật'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderProfileSection = () => (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16 }}>
      <View className="items-center" style={{ marginBottom: 24 }}>
        {profile?.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} className="w-24 h-24 rounded-full" style={{ marginBottom: 12 }} />
        ) : (
          <View className="w-24 h-24 rounded-full bg-primary items-center justify-center" style={{ marginBottom: 12 }}>
            <User size={48} color="#fff6ed" />
          </View>
        )}
        <Text className="text-xl font-bold text-foreground">{profile?.fullName || profile?.email}</Text>
        <Text className="text-muted-foreground text-sm">{profile?.email}</Text>
      </View>

      {/* Profile Info */}
      <View>
        <View className="bg-card p-4 rounded-lg border border-border" style={{ marginBottom: 20 }}>
          <Text className="text-base font-semibold text-foreground" style={{ marginBottom: 12 }}>
            Thông tin cá nhân
          </Text>

          <View>
            <View style={{ marginBottom: 12 }}>
              <Text className="text-sm font-medium text-muted-foreground">Họ tên</Text>
              <Text className="text-base text-foreground">{profile?.fullName || '-'}</Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text className="text-sm font-medium text-muted-foreground">Email</Text>
              <Text className="text-base text-foreground">{profile?.email || '-'}</Text>
            </View>

            <View style={{ marginBottom: 12 }}>
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
        <View>
          <TouchableOpacity
            className="bg-card p-4 rounded-lg border border-border flex-row items-center justify-between"
            onPress={() => router.push('/profile/edit')}
            style={{ marginBottom: 16 }}
          >
            <View className="flex-row items-center">
              <User size={20} color="#8B4513" />
              <Text className="text-base font-medium text-foreground" style={{ marginLeft: 12 }}>
                Chỉnh sửa thông tin
              </Text>
            </View>
            <ChevronRight size={20} color="#8B4513" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-card p-4 rounded-lg border border-border flex-row items-center justify-between"
            onPress={() => router.push('/(tabs)/change-password')}
            style={{ marginBottom: 16 }}
          >
            <View className="flex-row items-center">
              <Lock size={20} color="#8B4513" />
              <Text className="text-base font-medium text-foreground" style={{ marginLeft: 12 }}>
                Đổi mật khẩu
              </Text>
            </View>
            <ChevronRight size={20} color="#8B4513" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-card p-4 rounded-lg border border-red-200 flex-row items-center justify-between"
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <LogOut size={20} color="#dc2626" />
              <Text className="text-base font-medium text-red-600" style={{ marginLeft: 12 }}>
                Đăng xuất
              </Text>
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
      <View className="flex-1">
        <Text className="text-lg font-bold text-foreground" style={{ marginHorizontal: 16, marginBottom: 16 }}>
          Đơn hàng của tôi
        </Text>

        {ordersLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#8B4513" />
            <Text className="text-muted-foreground" style={{ marginTop: 8 }}>
              Đang tải đơn hàng...
            </Text>
          </View>
        ) : ordersError ? (
          <View className="flex-1 items-center justify-center" style={{ paddingVertical: 32 }}>
            <Package size={48} color="#dc2626" />
            <Text className="text-red-600 text-center" style={{ marginTop: 16 }}>
              Lỗi tải đơn hàng
            </Text>
            <Text className="text-muted-foreground text-center text-sm" style={{ marginTop: 8 }}>
              {ordersError?.message || 'Có lỗi xảy ra khi tải dữ liệu'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center" style={{ paddingVertical: 32 }}>
                <Package size={48} color="#a67c52" />
                <Text className="text-muted-foreground text-center" style={{ marginTop: 16 }}>
                  Chưa có đơn hàng nào
                </Text>
                <Text className="text-muted-foreground text-center text-sm" style={{ marginTop: 8 }}>
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
      <View className="flex-1">
        <Text className="text-lg font-bold text-foreground" style={{ marginHorizontal: 16, marginBottom: 16 }}>
          Sự kiện đã tham gia
        </Text>

        {eventsLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#8B4513" />
            <Text className="text-muted-foreground" style={{ marginTop: 8 }}>
              Đang tải sự kiện...
            </Text>
          </View>
        ) : eventsError ? (
          <View className="flex-1 items-center justify-center" style={{ paddingVertical: 32 }}>
            <Calendar size={48} color="#dc2626" />
            <Text className="text-red-600 text-center" style={{ marginTop: 16 }}>
              Lỗi tải sự kiện
            </Text>
            <Text className="text-muted-foreground text-center text-sm" style={{ marginTop: 8 }}>
              {eventsError?.message || 'Có lỗi xảy ra khi tải dữ liệu'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={events}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center" style={{ paddingVertical: 32 }}>
                <Calendar size={48} color="#a67c52" />
                <Text className="text-muted-foreground text-center" style={{ marginTop: 16 }}>
                  Chưa tham gia sự kiện nào
                </Text>
                <Text className="text-muted-foreground text-center text-sm" style={{ marginTop: 8 }}>
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
      {/* Tab Navigation */}
      <View className="flex-row px-4 py-6">
        {renderTabButton(
          'profile',
          <User size={20} color={activeTab === 'profile' ? '#fff6ed' : '#a67c52'} />,
          'Thông tin'
        )}
        {renderTabButton(
          'orders',
          <ShoppingBag size={20} color={activeTab === 'orders' ? '#fff6ed' : '#a67c52'} />,
          'Đơn hàng'
        )}
        {renderTabButton(
          'events',
          <Calendar size={20} color={activeTab === 'events' ? '#fff6ed' : '#a67c52'} />,
          'Sự kiện'
        )}
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
