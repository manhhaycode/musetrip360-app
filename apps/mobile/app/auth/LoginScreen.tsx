import { useLogin } from '@musetrip360/auth-system/api';
import { AuthTypeEnum } from '@musetrip360/auth-system/types';
import { Eye, EyeOff, Globe } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu.');
      return;
    }
    loginMutation.mutate({ email, password, authType: AuthTypeEnum.Email });
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-4 py-8 justify-center">
      <View className="flex-row items-center justify-center mb-8">
        <View className="w-14 h-14 rounded-lg bg-primary items-center justify-center mr-3">
          <Globe size={32} color="#fff" />
        </View>
        <View>
          <Text className="text-xl font-bold text-foreground">MuseTrip360</Text>
          <Text className="text-xs text-muted-foreground">Digital Museum Platform</Text>
        </View>
      </View>
      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <Text className="text-red-700 text-base">{error}</Text>
        </View>
      ) : null}
      <View className="mb-4">
        <Text className="mb-1 text-base font-semibold text-muted-foreground">Email</Text>
        <TextInput
          className="h-12 px-4 py-2 border-2 border-primary rounded-2xl text-base bg-card w-full text-left text-foreground"
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
      </View>
      <View className="mb-6">
        <Text className="mb-1 text-base font-semibold text-muted-foreground">Mật khẩu</Text>
        <View className="relative">
          <TextInput
            className="h-12 px-4 py-2 border-2 border-primary rounded-2xl text-base bg-card w-full text-left text-foreground pr-10"
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPassword}
            placeholderTextColor="#888"
          />
          <TouchableOpacity className="absolute right-2 top-2" onPress={() => setShowPassword((s) => !s)}>
            {showPassword ? <EyeOff size={20} color="#a67c52" /> : <Eye size={20} color="#a67c52" />}
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="bg-primary py-3 px-6 rounded-xl items-center mb-4"
        onPress={handleLogin}
        disabled={loginMutation.isPending}
      >
        <Text className="text-primary-foreground text-base font-semibold">Đăng nhập</Text>
      </TouchableOpacity>
      {loginMutation.isPending && <ActivityIndicator className="mt-4" />}
    </SafeAreaView>
  );
}
