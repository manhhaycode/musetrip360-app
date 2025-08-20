import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Mail } from 'lucide-react-native';
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);

  const handleSendResetEmail = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Integrate with real forgot password API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      setIsEmailSent(true);
      Alert.alert(
        'Email đã được gửi!',
        'Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Có lỗi xảy ra khi gửi email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {/* Header */}
          <View className="flex-row items-center px-4 py-4 border-b border-border">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-foreground ml-2">Quên mật khẩu</Text>
          </View>

          <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 px-4 py-8">
              {/* Info Card */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <View className="items-center mb-6">
                    <View className="w-16 h-16 bg-accent rounded-full items-center justify-center mb-4">
                      <Text className="text-2xl">🔑</Text>
                    </View>
                    <Text className="text-2xl font-bold text-foreground text-center">Đặt lại mật khẩu</Text>
                    <Text className="text-muted-foreground text-center mt-2">
                      Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
                    </Text>
                  </View>

                  {!isEmailSent ? (
                    <View className="space-y-4">
                      {/* Email Input */}
                      <View>
                        <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
                        <View className="relative">
                          <Input
                            placeholder="Nhập địa chỉ email của bạn"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            className="pl-10"
                          />
                          <View className="absolute left-3 top-3">
                            <Mail size={18} color="#6b7280" />
                          </View>
                        </View>
                      </View>

                      {/* Send Email Button */}
                      <Button onPress={handleSendResetEmail} disabled={isLoading || !email} className="w-full mt-6">
                        <Text className="text-primary-foreground font-medium">
                          {isLoading ? 'Đang gửi email...' : 'Gửi email đặt lại'}
                        </Text>
                      </Button>
                    </View>
                  ) : (
                    <View className="items-center space-y-4">
                      <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-2">
                        <Text className="text-3xl">✉️</Text>
                      </View>
                      <Text className="text-lg font-semibold text-foreground text-center">Email đã được gửi!</Text>
                      <Text className="text-muted-foreground text-center">
                        Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{'\n'}
                        <Text className="font-medium">{email}</Text>
                      </Text>
                      <Text className="text-sm text-muted-foreground text-center">
                        Vui lòng kiểm tra cả thư mục spam nếu bạn không thấy email.
                      </Text>
                    </View>
                  )}
                </CardContent>
              </Card>

              {/* Back to Login */}
              <View className="flex-row justify-center items-center">
                <Text className="text-muted-foreground text-sm">Nhớ mật khẩu rồi? </Text>
                <TouchableOpacity onPress={handleBackToLogin}>
                  <Text className="text-primary font-medium text-sm">Đăng nhập ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
