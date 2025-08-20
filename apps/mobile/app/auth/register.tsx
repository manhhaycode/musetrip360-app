import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Input } from '@/components/core/ui/input';
import { Text } from '@/components/core/ui/text';
import { useRegister } from '@musetrip360/auth-system/api';
import { useIsAuthenticated } from '@musetrip360/auth-system/state';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  const isAuthenticated = useIsAuthenticated();
  const registerMutation = useRegister();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async () => {
    const { email, password, confirmPassword, fullName, phoneNumber } = formData;

    if (!email || !password || !fullName) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Lỗi', 'Vui lòng đồng ý với Điều khoản sử dụng');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        email,
        password,
        fullName,
        phoneNumber: phoneNumber || undefined,
        avatarUrl: undefined,
      });

      Alert.alert('Thành công', 'Đăng ký thành công!', [
        {
          text: 'OK',
          onPress: () => router.replace('/'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi đăng ký', error?.message || 'Có lỗi xảy ra khi đăng ký');
    }
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const updateFormData = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {/* Header */}
          <View className="flex-row items-center mobile-container py-4 border-b border-border">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 touch-target">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <View className="flex-row items-center ml-2">
              <View className="w-8 h-8 bg-primary rounded-lg items-center justify-center mr-2">
                <Text className="text-primary-foreground text-lg font-bold">M</Text>
              </View>
              <Text className="text-mobile-lg font-semibold text-foreground">Đăng ký</Text>
            </View>
          </View>

          <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 mobile-container py-8">
              {/* Welcome Card */}
              <Card className="mobile-section mobile-card-shadow">
                <CardContent className="p-6">
                  <View className="items-center mb-6">
                    <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4">
                      <Text className="text-4xl">�</Text>
                    </View>
                    <Text className="text-mobile-2xl font-bold text-foreground text-center">Tham gia MuseTrip360</Text>
                    <Text className="text-muted-foreground text-center mt-2 text-mobile-base">
                      Tạo tài khoản để khám phá thế giới bảo tàng
                    </Text>
                  </View>

                  {/* Register Form */}
                  <View className="space-y-6">
                    {/* Full Name Input */}
                    <View>
                      <Text className="text-mobile-sm font-medium text-foreground mb-2">
                        Họ và tên <Text className="text-destructive">*</Text>
                      </Text>
                      <View className="relative">
                        <Input
                          placeholder="Nhập họ và tên"
                          value={formData.fullName}
                          onChangeText={updateFormData('fullName')}
                          autoComplete="name"
                          className="pl-12 h-12 text-mobile-base"
                        />
                        <View className="absolute left-4 top-3">
                          <User size={20} color="#6b7280" />
                        </View>
                      </View>
                    </View>

                    {/* Email Input */}
                    <View>
                      <Text className="text-mobile-sm font-medium text-foreground mb-2">
                        Email <Text className="text-destructive">*</Text>
                      </Text>
                      <View className="relative">
                        <Input
                          placeholder="Nhập email của bạn"
                          value={formData.email}
                          onChangeText={updateFormData('email')}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoComplete="email"
                          className="pl-12 h-12 text-mobile-base"
                        />
                        <View className="absolute left-4 top-3">
                          <Mail size={20} color="#6b7280" />
                        </View>
                      </View>
                    </View>

                    {/* Phone Number Input */}
                    <View>
                      <Text className="text-mobile-sm font-medium text-foreground mb-2">Số điện thoại</Text>
                      <View className="relative">
                        <Input
                          placeholder="Nhập số điện thoại (tùy chọn)"
                          value={formData.phoneNumber}
                          onChangeText={updateFormData('phoneNumber')}
                          keyboardType="phone-pad"
                          autoComplete="tel"
                          className="pl-12 h-12 text-mobile-base"
                        />
                        <View className="absolute left-4 top-3">
                          <Phone size={20} color="#6b7280" />
                        </View>
                      </View>
                    </View>

                    {/* Password Input */}
                    <View>
                      <Text className="text-mobile-sm font-medium text-foreground mb-2">
                        Mật khẩu <Text className="text-destructive">*</Text>
                      </Text>
                      <View className="relative">
                        <Input
                          placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                          value={formData.password}
                          onChangeText={updateFormData('password')}
                          secureTextEntry={!showPassword}
                          autoComplete="new-password"
                          className="pl-12 pr-12 h-12 text-mobile-base"
                        />
                        <View className="absolute left-4 top-3">
                          <Lock size={20} color="#6b7280" />
                        </View>
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-3 touch-target"
                        >
                          {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Confirm Password Input */}
                    <View>
                      <Text className="text-mobile-sm font-medium text-foreground mb-2">
                        Xác nhận mật khẩu <Text className="text-destructive">*</Text>
                      </Text>
                      <View className="relative">
                        <Input
                          placeholder="Nhập lại mật khẩu"
                          value={formData.confirmPassword}
                          onChangeText={updateFormData('confirmPassword')}
                          secureTextEntry={!showConfirmPassword}
                          autoComplete="new-password"
                          className="pl-12 pr-12 h-12 text-mobile-base"
                        />
                        <View className="absolute left-4 top-3">
                          <Lock size={20} color="#6b7280" />
                        </View>
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-3 touch-target"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} color="#6b7280" />
                          ) : (
                            <Eye size={20} color="#6b7280" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Terms Agreement */}
                    <TouchableOpacity
                      onPress={() => setAgreeToTerms(!agreeToTerms)}
                      className="flex-row items-start touch-target"
                    >
                      <View
                        className={`w-5 h-5 border-2 rounded mt-0.5 mr-3 items-center justify-center ${
                          agreeToTerms ? 'bg-primary border-primary' : 'border-border'
                        }`}
                      >
                        {agreeToTerms && <Text className="text-primary-foreground text-xs">✓</Text>}
                      </View>
                      <View className="flex-1">
                        <Text className="text-mobile-sm text-foreground leading-5">
                          Tôi đồng ý với <Text className="text-primary font-medium">Điều khoản sử dụng</Text> và{' '}
                          <Text className="text-primary font-medium">Chính sách bảo mật</Text>
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* Register Button */}
                    <Button
                      onPress={handleRegister}
                      disabled={
                        registerMutation.isPending ||
                        !formData.email ||
                        !formData.password ||
                        !formData.fullName ||
                        !agreeToTerms
                      }
                      className="w-full h-12 mt-6"
                    >
                      <Text className="text-primary-foreground font-medium text-mobile-base">
                        {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
                      </Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>

              {/* Login Link */}
              <View className="flex-row justify-center items-center mt-6">
                <Text className="text-muted-foreground text-mobile-sm">Đã có tài khoản? </Text>
                <TouchableOpacity onPress={handleLogin} className="touch-target">
                  <Text className="text-primary font-medium text-mobile-sm">Đăng nhập ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
