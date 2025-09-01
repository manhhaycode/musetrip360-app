import { useChangePassword } from '@musetrip360/user-management/api';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const passwordRules = [
  'Tối thiểu 8 ký tự',
  'Ít nhất 1 chữ cái thường (a-z)',
  'Ít nhất 1 chữ cái hoa (A-Z)',
  'Ít nhất 1 số (0-9)',
];

function validatePassword(pw: string) {
  return pw.length >= 8 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw);
}

export default function ChangePasswordScreen() {
  const { mutate: changePassword, isPending } = useChangePassword({
    onSuccess: () => setSuccess('Đổi mật khẩu thành công!'),
    onError: (error: any) => {
      const errorMsg = error?.message || error?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại';
      setError(errorMsg);
    },
  });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    setSuccess(null);
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đủ thông tin');
      return;
    }
    if (!validatePassword(newPassword)) {
      setError('Mật khẩu mới chưa đủ mạnh');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    changePassword({ oldPassword, newPassword });
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-4 py-8">
      <View className="flex-row items-center mb-4">
        <Lock size={24} color="#a67c52" />
        <Text className="text-xl font-bold text-primary ml-2">Đổi mật khẩu</Text>
      </View>
      {success && (
        <View className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <Text className="text-green-700 text-base">{success}</Text>
        </View>
      )}
      {error && (
        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <Text className="text-red-700 text-base">{error}</Text>
        </View>
      )}
      <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <Text className="text-blue-900 font-semibold mb-2">Yêu cầu mật khẩu mới:</Text>
        {passwordRules.map((rule, idx) => (
          <Text key={idx} className="text-blue-800 text-sm mb-1">
            • {rule}
          </Text>
        ))}
      </View>
      {/* Old Password */}
      <View className="mb-4">
        <Text className="mb-1 text-base font-semibold text-muted-foreground">Mật khẩu hiện tại</Text>
        <View className="relative">
          <TextInput
            className="h-12 px-4 py-2 border-2 border-primary rounded-2xl text-base bg-card w-full text-left text-foreground pr-10"
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Nhập mật khẩu hiện tại"
            secureTextEntry={!show.old}
            placeholderTextColor="#888"
          />
          <TouchableOpacity className="absolute right-2 top-2" onPress={() => setShow((s) => ({ ...s, old: !s.old }))}>
            {show.old ? <EyeOff size={20} color="#a67c52" /> : <Eye size={20} color="#a67c52" />}
          </TouchableOpacity>
        </View>
      </View>
      {/* New Password */}
      <View className="mb-4">
        <Text className="mb-1 text-base font-semibold text-muted-foreground">Mật khẩu mới</Text>
        <View className="relative">
          <TextInput
            className="h-12 px-4 py-2 border-2 border-primary rounded-2xl text-base bg-card w-full text-left text-foreground pr-10"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry={!show.new}
            placeholderTextColor="#888"
          />
          <TouchableOpacity className="absolute right-2 top-2" onPress={() => setShow((s) => ({ ...s, new: !s.new }))}>
            {show.new ? <EyeOff size={20} color="#a67c52" /> : <Eye size={20} color="#a67c52" />}
          </TouchableOpacity>
        </View>
      </View>
      {/* Confirm Password */}
      <View className="mb-6">
        <Text className="mb-1 text-base font-semibold text-muted-foreground">Xác nhận mật khẩu mới</Text>
        <View className="relative">
          <TextInput
            className="h-12 px-4 py-2 border-2 border-primary rounded-2xl text-base bg-card w-full text-left text-foreground pr-10"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry={!show.confirm}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            className="absolute right-2 top-2"
            onPress={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
          >
            {show.confirm ? <EyeOff size={20} color="#a67c52" /> : <Eye size={20} color="#a67c52" />}
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="bg-primary py-3 px-6 rounded-xl items-center mb-2"
        onPress={handleSubmit}
        disabled={isPending}
      >
        <Text className="text-primary-foreground text-base font-semibold">
          {isPending ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
