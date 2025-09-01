import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@musetrip360/auth-system/state';
import { useCurrentProfile, useUpdateProfile } from '@musetrip360/user-management/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useCurrentProfile();
  const { resetStore } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [birthDate, setBirthDate] = useState(profile?.birthDate || '');
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  React.useEffect(() => {
    setFullName(profile?.fullName || '');
    setPhoneNumber(profile?.phoneNumber || '');
    setBirthDate(profile?.birthDate || '');
  }, [profile]);

  const handleLogout = () => {
    resetStore();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      setBirthDate(`${day}-${month}-${year}`);
    }
  };

  const handleSave = () => {
    let birthDateApi = birthDate;
    if (birthDate && birthDate.includes('-') && birthDate.length === 10) {
      const [day, month, year] = birthDate.split('-');
      birthDateApi = `${year}-${month}-${day}`;
    }
    updateProfileMutation.mutate(
      { fullName, phoneNumber, birthDate: birthDateApi },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setEditMode(false);
          // Cập nhật lại dữ liệu profile ngay khi lưu thành công
          if (profile) {
            profile.fullName = fullName;
            profile.phoneNumber = phoneNumber;
            profile.birthDate = birthDateApi;
          }
        },
      }
    );
  };

  if (isLoading) {
    return <Text>Đang tải thông tin...</Text>;
  }
  if (error) {
    return <Text>Lỗi tải thông tin cá nhân</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-8 pb-6 bg-background rounded-2xl shadow-lg">
        <View className="items-center mb-4">
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} className="w-20 h-20 rounded-full mb-2" />
          ) : (
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-2">
              <User size={64} color="#fff" />
            </View>
          )}
        </View>
        <Text className="text-xl font-bold mb-4 text-primary">Thông tin cá nhân</Text>
        {/* Họ tên */}
        <View className="mb-3 w-full">
          <Text className="text-base font-semibold text-muted-foreground mb-1">Họ tên:</Text>
          {editMode ? (
            <TextInput
              className="h-12 px-4 py-2 border-2 border-primary rounded-2xl text-base bg-card w-full text-left text-foreground"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ tên"
              placeholderTextColor="#888"
            />
          ) : (
            <Text className="text-base text-foreground w-full text-left">{profile?.fullName || '-'}</Text>
          )}
        </View>
        {/* Email */}
        <View className="mb-3 w-full">
          <Text className="text-base font-semibold text-muted-foreground mb-1">Email:</Text>
          <Text className="text-base text-foreground w-full text-left">{profile?.email || '-'}</Text>
        </View>
        {/* Số điện thoại */}
        <View className="mb-3 w-full">
          <Text className="text-base font-semibold text-muted-foreground mb-1">Số điện thoại:</Text>
          {editMode ? (
            <TextInput
              className="h-12 px-4 py-2 border-2 border-primary rounded-2xl text-base bg-card w-full text-left text-foreground"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              placeholderTextColor="#888"
            />
          ) : (
            <Text className="text-base text-foreground w-full text-left">{profile?.phoneNumber || '-'}</Text>
          )}
        </View>
        {/* Ngày sinh */}
        <View className="mb-3 w-full">
          <Text className="text-base font-semibold text-muted-foreground mb-1">Ngày sinh:</Text>
          {editMode ? (
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="w-full">
              <View pointerEvents="none">
                <TextInput
                  className="h-12 px-4 py-2 border-2 border-primary rounded-2xl text-base bg-card w-full text-left text-foreground"
                  value={birthDate}
                  placeholder="dd-mm-yyyy"
                  editable={false}
                  placeholderTextColor="#888"
                />
              </View>
            </TouchableOpacity>
          ) : (
            <Text className="text-base text-foreground w-full text-left">
              {profile?.birthDate ? formatDate(profile.birthDate) : '-'}
            </Text>
          )}
          {showDatePicker && (
            <DateTimePicker
              value={birthDate ? parseDate(birthDate) : new Date()}
              mode="date"
              display="calendar"
              onChange={handleDateChange}
            />
          )}
        </View>
        {/* Username */}
        <View className="mb-3 w-full">
          <Text className="text-base font-semibold text-muted-foreground mb-1">Username:</Text>
          <Text className="text-base text-foreground w-full text-left">{profile?.username || '-'}</Text>
        </View>
        {/* Button */}
        <View className="mt-6 w-full">
          {editMode ? (
            <TouchableOpacity
              className="py-3 px-6 rounded-xl items-center mb-4 bg-primary"
              onPress={handleSave}
              disabled={updateProfileMutation.isPending}
            >
              <Text className="text-primary-foreground text-base font-semibold">Lưu</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="py-3 px-6 rounded-xl items-center mb-4 bg-primary"
              onPress={() => setEditMode(true)}
            >
              <Text className="text-primary-foreground text-base font-semibold">Chỉnh sửa</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="py-3 px-6 rounded-xl items-center mb-4 bg-secondary"
            onPress={() => {
              router.push('/change-password');
            }}
          >
            <Text className="text-foreground text-base font-semibold">Đổi mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity className="py-3 px-6 rounded-xl items-center mb-4 bg-secondary" onPress={handleLogout}>
            <Text className="text-red-500 text-base font-semibold">Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="bg-card p-8 rounded-2xl items-center shadow-lg">
            <MaterialIcons name="check-circle" size={48} color="#22c55e" style={{ marginBottom: 8 }} />
            <Text className="text-lg mb-3 text-green-500 font-bold">Cập nhật thành công!</Text>
            <TouchableOpacity className="mt-2 py-2 px-6 rounded bg-primary" onPress={() => setShowSuccess(false)}>
              <Text className="text-primary-foreground">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Thêm hàm formatDate phía trên hoặc dưới component
function formatDate(dateString: string) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
}

// Thêm hàm parseDate phía trên hoặc dưới component
function parseDate(dateString: string) {
  // dd-mm-yyyy hoặc yyyy-mm-dd -> Date
  if (!dateString) return new Date();
  if (dateString.includes('-') && dateString.length === 10) {
    const parts = dateString.split('-');
    if (parts[0].length === 4) {
      // yyyy-mm-dd
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
      // dd-mm-yyyy
      return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }
  }
  // ISO format
  return new Date(dateString);
}
