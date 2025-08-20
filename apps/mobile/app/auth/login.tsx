import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
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
import { useLogin } from '@musetrip360/auth-system/api';
import { useIsAuthenticated } from '@musetrip360/auth-system/state';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const isAuthenticated = useIsAuthenticated();
  const loginMutation = useLogin();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email,
        password,
        authType: 'Email' as any,
      });

      Alert.alert('Thành công', 'Đăng nhập thành công!', [
        {
          text: 'OK',
          onPress: () => router.replace('/'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error?.message || 'Có lỗi xảy ra khi đăng nhập');
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const handleGoogleLogin = async () => {
    Alert.alert('Google Login', 'Google OAuth sẽ được tích hợp trong phiên bản tiếp theo!');
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
              <Text className="text-mobile-lg font-semibold text-foreground">Đăng nhập</Text>
            </View>
          </View>

          <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 mobile-container py-8">
              {/* Welcome Card */}
              <Card className="mobile-section mobile-card-shadow">
                <CardContent className="p-6">
                  <View className="items-center mb-6">
                    <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4">
                      <Text className="text-4xl">🏛️</Text>
                    </View>
                    <Text className="text-mobile-2xl font-bold text-foreground text-center">Chào mừng trở lại!</Text>
                    <Text className="text-muted-foreground text-center mt-2 text-mobile-base">
                      Đăng nhập để tiếp tục khám phá các bảo tàng
                    </Text>
                  </View>

                  {/* Login Form */}
                  <View className="space-y-6">
                    {/* Email Input */}
                    <View>
                      <Text className="text-mobile-sm font-medium text-foreground mb-2">Email</Text>
                      <View className="relative">
                        <Input
                          placeholder="Nhập email của bạn"
                          value={email}
                          onChangeText={setEmail}
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

                    {/* Password Input */}
                    <View>
                      <Text className="text-mobile-sm font-medium text-foreground mb-2">Mật khẩu</Text>
                      <View className="relative">
                        <Input
                          placeholder="Nhập mật khẩu"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword}
                          autoComplete="password"
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

                    {/* Forgot Password */}
                    <TouchableOpacity onPress={handleForgotPassword} className="self-end touch-target">
                      <Text className="text-primary text-mobile-sm font-medium">Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <Button
                      onPress={handleLogin}
                      disabled={loginMutation.isPending || !email || !password}
                      className="w-full h-12 mt-6"
                    >
                      <Text className="text-primary-foreground font-medium text-mobile-base">
                        {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                      </Text>
                    </Button>

                    {/* Divider */}
                    <View className="flex-row items-center my-6">
                      <View className="flex-1 h-px bg-border" />
                      <Text className="text-muted-foreground text-mobile-sm px-3">Hoặc</Text>
                      <View className="flex-1 h-px bg-border" />
                    </View>

                    {/* Google Login Button */}
                    <Button
                      variant="outline"
                      onPress={handleGoogleLogin}
                      disabled={loginMutation.isPending}
                      className="w-full h-12 flex-row items-center"
                    >
                      <Text className="text-2xl mr-2">🌐</Text>
                      <Text className="text-foreground font-medium text-mobile-base">Đăng nhập với Google</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>

              {/* Register Link */}
              <View className="flex-row justify-center items-center mt-6">
                <Text className="text-muted-foreground text-mobile-sm">Chưa có tài khoản? </Text>
                <TouchableOpacity onPress={handleRegister} className="touch-target">
                  <Text className="text-primary font-medium text-mobile-sm">Đăng ký ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
