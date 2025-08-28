import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@musetrip360/auth-system';
import { useCurrentProfile, useUpdateProfile } from '@musetrip360/user-management';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Button, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
      <View className="px-4 pt-8 pb-6 bg-background rounded-2xl shadow-lg">
        <View style={styles.avatarContainer}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarDefault}>
              <MaterialIcons name="person" size={64} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.title}>Thông tin cá nhân</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{profile?.username || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Họ tên:</Text>
          {editMode ? (
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Nhập họ tên" />
          ) : (
            <Text style={styles.value}>{profile?.fullName || '-'}</Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile?.email || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Số điện thoại:</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{profile?.phoneNumber || '-'}</Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ngày sinh:</Text>
          {editMode ? (
            <>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flex: 1 }}>
                <View pointerEvents="none">
                  <TextInput style={styles.input} value={birthDate} placeholder="dd-mm-yyyy" editable={false} />
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
            <Text style={styles.value}>{profile?.birthDate ? formatDate(profile.birthDate) : '-'}</Text>
          )}
        </View>
        <View style={styles.buttonRow}>
          {editMode ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'var(--primary)' }]}
              onPress={handleSave}
              disabled={updateProfileMutation.isPending}
            >
              <Text className="text-primary-foreground">Lưu</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'var(--primary)' }]}
              onPress={() => setEditMode(true)}
            >
              <Text className="text-primary-foreground">Chỉnh sửa</Text>
            </TouchableOpacity>
          )}
          <View style={{ height: 12 }} />
          <TouchableOpacity style={[styles.button, { backgroundColor: 'var(--destructive)' }]} onPress={handleLogout}>
            <Text className="text-destructive-foreground">Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="check-circle" size={48} color="#22c55e" style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 18, marginBottom: 12, color: '#22c55e', fontWeight: 'bold' }}>
              Cập nhật thành công!
            </Text>
            <Button title="Đóng" onPress={() => setShowSuccess(false)} color="#2563eb" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  avatarDefault: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#2563eb',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    width: 120,
  },
  value: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  input: {
    height: 40,
    borderColor: '#2563eb',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f3f4f6',
    flex: 1,
    textAlign: 'right',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonRow: {
    marginTop: 24,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});

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
