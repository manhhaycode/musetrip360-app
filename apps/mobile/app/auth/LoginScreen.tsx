import { useLogin } from '@musetrip360/auth-system/api';
import { AuthTypeEnum } from '@musetrip360/auth-system/types';
import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Đăng nhập" onPress={handleLogin} disabled={loginMutation.isPending} />
      {loginMutation.isPending && <ActivityIndicator style={{ marginTop: 16 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});
