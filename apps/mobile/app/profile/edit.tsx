import { useCurrentProfile, useUpdateProfile } from '@musetrip360/user-management/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useCurrentProfile();
  const updateProfileMutation = useUpdateProfile();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhoneNumber(profile.phoneNumber || '');
      setBirthDate(profile.birthDate ? formatDateForEdit(profile.birthDate) : '');
    }
  }, [profile]);

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
        },
        onError: (error) => {
          console.error('Update profile error:', error);
        },
      }
    );
  };

  const formatDateForEdit = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}-${month}-${year}`;
  };

  const parseDate = (dateString: string) => {
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
    return new Date(dateString);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Đang tải thông tin...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-destructive">Lỗi tải thông tin cá nhân</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#8B4513" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">Chỉnh sửa thông tin</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Avatar Section */}
        <View className="items-center mb-6">
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} className="w-24 h-24 rounded-full mb-3" />
          ) : (
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-3">
              <User size={48} color="#fff6ed" />
            </View>
          )}
          <TouchableOpacity className="bg-primary/10 px-4 py-2 rounded-full">
            <Text className="text-primary font-medium">Thay đổi ảnh</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View className="space-y-4">
          {/* Họ tên */}
          <View>
            <Text className="text-base font-semibold text-muted-foreground mb-2">Họ tên *</Text>
            <TextInput
              className="h-14 px-4 py-3 border-2 border-border rounded-lg text-base bg-card text-foreground"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ tên"
              placeholderTextColor="#a67c52"
            />
          </View>

          {/* Email (Read only) */}
          <View>
            <Text className="text-base font-semibold text-muted-foreground mb-2">Email</Text>
            <View className="h-14 px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 justify-center">
              <Text className="text-base text-gray-600">{profile?.email || '-'}</Text>
            </View>
          </View>

          {/* Số điện thoại */}
          <View>
            <Text className="text-base font-semibold text-muted-foreground mb-2">Số điện thoại</Text>
            <TextInput
              className="h-14 px-4 py-3 border-2 border-border rounded-lg text-base bg-card text-foreground"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              placeholderTextColor="#a67c52"
            />
          </View>

          {/* Ngày sinh */}
          <View>
            <Text className="text-base font-semibold text-muted-foreground mb-2">Ngày sinh</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View className="h-14 px-4 py-3 border-2 border-border rounded-lg bg-card justify-center">
                <Text className="text-base text-foreground">{birthDate || 'Chọn ngày sinh'}</Text>
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate ? parseDate(birthDate) : new Date()}
                mode="date"
                display="calendar"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          {/* Username (Read only) */}
          <View>
            <Text className="text-base font-semibold text-muted-foreground mb-2">Username</Text>
            <View className="h-14 px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 justify-center">
              <Text className="text-base text-gray-600">{profile?.username || '-'}</Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View className="mt-8">
          <TouchableOpacity
            className="h-14 rounded-lg items-center justify-center bg-primary"
            onPress={handleSave}
            disabled={updateProfileMutation.isPending}
          >
            <Text className="text-primary-foreground text-base font-semibold">
              {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 bg-black/30 justify-center items-center">
          <View className="bg-card p-8 rounded-2xl items-center shadow-lg mx-8">
            <CheckCircle size={48} color="#22c55e" style={{ marginBottom: 16 }} />
            <Text className="text-lg mb-3 text-green-500 font-bold text-center">Cập nhật thành công!</Text>
            <TouchableOpacity
              className="mt-2 py-3 px-6 rounded-lg bg-primary"
              onPress={() => {
                setShowSuccess(false);
                router.back();
              }}
            >
              <Text className="text-primary-foreground font-medium">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
