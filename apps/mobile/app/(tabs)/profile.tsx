import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@musetrip360/auth-system/state';
import { useCurrentProfile, useUpdateProfile } from '@musetrip360/user-management/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Image, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
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
      <View className="px-4 pt-8 pb-6 bg-card rounded-2xl shadow-lg">
        <View className="items-center mb-4">
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} className="w-20 h-20 rounded-full mb-2" />
          ) : (
            <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-2">
              <MaterialIcons name="person" size={64} color="#fff" />
            </View>
          )}
        </View>
        <Text className="text-xl font-bold mb-4 text-primary">Thông tin cá nhân</Text>
        <View className="flex-row items-center mb-3 w-full justify-between">
          <Text className="text-base font-semibold text-muted-foreground w-32">Username:</Text>
          <Text className="text-base text-foreground flex-1 text-right">{profile?.username || '-'}</Text>
        </View>
        <View className="flex-row items-center mb-3 w-full justify-between">
          <Text className="text-base font-semibold text-muted-foreground w-32">Họ tên:</Text>
          {editMode ? (
            <TextInput
              className="h-10 border border-primary rounded px-3 text-base bg-muted flex-1 text-right"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ tên"
              placeholderTextColor="var(--muted-foreground)"
            />
          ) : (
            <Text className="text-base text-foreground flex-1 text-right">{profile?.fullName || '-'}</Text>
          )}
        </View>
        <View className="flex-row items-center mb-3 w-full justify-between">
          <Text className="text-base font-semibold text-muted-foreground w-32">Email:</Text>
          <Text className="text-base text-foreground flex-1 text-right">{profile?.email || '-'}</Text>
        </View>
        <View className="flex-row items-center mb-3 w-full justify-between">
          <Text className="text-base font-semibold text-muted-foreground w-32">Số điện thoại:</Text>
          {editMode ? (
            <TextInput
              className="h-10 border border-primary rounded px-3 text-base bg-muted flex-1 text-right"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              placeholderTextColor="var(--muted-foreground)"
            />
          ) : (
            <Text className="text-base text-foreground flex-1 text-right">{profile?.phoneNumber || '-'}</Text>
          )}
        </View>
        <View className="flex-row items-center mb-3 w-full justify-between">
          <Text className="text-base font-semibold text-muted-foreground w-32">Ngày sinh:</Text>
          {editMode ? (
            <>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} className="flex-1">
                <View pointerEvents="none">
                  <TextInput
                    className="h-10 border border-primary rounded px-3 text-base bg-muted flex-1 text-right"
                    value={birthDate}
                    placeholder="dd-mm-yyyy"
                    editable={false}
                    placeholderTextColor="var(--muted-foreground)"
                  />
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={birthDate ? parseDate(birthDate) : new Date()}
                  mode="date"
                  display="calendar"
                  onChange={handleDateChange}
                />
              )}
            </>
          ) : (
            <Text className="text-base text-foreground flex-1 text-right">
              {profile?.birthDate ? formatDate(profile.birthDate) : '-'}
            </Text>
          )}
        </View>
        <View className="mt-6 w-full">
          {editMode ? (
            <TouchableOpacity
              className="py-3 px-6 rounded items-center mb-2 bg-primary"
              onPress={handleSave}
              disabled={updateProfileMutation.isPending}
            >
              <Text className="text-primary-foreground">Lưu</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="py-3 px-6 rounded items-center mb-2 bg-primary"
              onPress={() => setEditMode(true)}
            >
              <Text className="text-primary-foreground">Chỉnh sửa</Text>
            </TouchableOpacity>
          )}
          <View className="h-3" />
          <TouchableOpacity className="py-3 px-6 rounded items-center bg-destructive" onPress={handleLogout}>
            <Text className="text-destructive-foreground">Đăng xuất</Text>
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
