import { useLogin } from '@musetrip360/auth-system/api';
import { AuthTypeEnum } from '@musetrip360/auth-system/types';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Eye, EyeOff, Globe, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const loginMutation = useLogin({
    onSuccess: () => {
      setError('');
    },
    onError: (err) => {
      setError(err.message || 'Đăng nhập thất bại');
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    loginMutation.mutate({
      authType: AuthTypeEnum.Email,
      email,
      password,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <View className="flex-1 bg-background">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} className="flex-1">
            {/* Header Section */}
            <View className="items-center pt-16 pb-8">
              <View className="bg-primary rounded-full p-6 mb-6 shadow-lg">
                <Globe size={40} color="#fff6ed" />
              </View>
              <Text className="text-4xl font-bold text-foreground mb-2">MuseTrip360</Text>
              <Text className="text-lg text-muted-foreground text-center px-6">
                Khám phá bảo tàng với công nghệ 360°
              </Text>
            </View>

            {/* Login Form Card */}
            <View className="flex-1 px-6">
              <View className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                {/* Email Input */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-card-foreground mb-2">Email</Text>
                  <View className="relative">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Mail size={20} color="#a67c52" />
                    </View>
                    <TextInput
                      className="bg-muted border border-input rounded-xl pl-12 pr-4 py-4 text-card-foreground text-base"
                      placeholder="Nhập email của bạn"
                      placeholderTextColor="#a67c52"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-card-foreground mb-2">Mật khẩu</Text>
                  <View className="relative">
                    <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <Lock size={20} color="#a67c52" />
                    </View>
                    <TextInput
                      className="bg-muted border border-input rounded-xl pl-12 pr-12 py-4 text-card-foreground text-base"
                      placeholder="Nhập mật khẩu"
                      placeholderTextColor="#a67c52"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} color="#a67c52" /> : <Eye size={20} color="#a67c52" />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Error Message */}
                {error ? (
                  <View className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <Text className="text-destructive text-sm text-center">{error}</Text>
                  </View>
                ) : null}

                {/* Login Button */}
                <TouchableOpacity
                  className={`bg-primary rounded-xl py-4 flex-row items-center justify-center ${
                    loginMutation.isPending ? 'opacity-70' : ''
                  }`}
                  onPress={handleLogin}
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <ActivityIndicator color="#fff6ed" size="small" />
                  ) : (
                    <>
                      <Text className="text-primary-foreground text-lg font-semibold mr-2">Đăng nhập</Text>
                      <ArrowRight size={20} color="#fff6ed" />
                    </>
                  )}
                </TouchableOpacity>

                {/* Forgot Password */}
                <TouchableOpacity className="mt-4 py-2">
                  <Text className="text-primary text-center font-medium">Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>

              {/* Register Link */}
              <View className="mt-6 pb-8">
                <View className="flex-row items-center justify-center">
                  <Text className="text-muted-foreground">Chưa có tài khoản?</Text>
                  <TouchableOpacity className="ml-1">
                    <Text className="text-primary font-semibold">Đăng ký ngay</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
