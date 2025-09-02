import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Text } from '@/components/core/ui/text';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderSuccessPage() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar style="dark" />
            <View className="flex-1 items-center justify-center px-4">
                <Card className="bg-green-50 border border-green-200 rounded-lg w-full max-w-md">
                    <CardContent className="p-6 items-center">
                        <CheckCircle size={64} color="#16a34a" />
                        <Text className="text-2xl font-bold text-green-800 mt-4 mb-2 text-center">
                            Thanh toán thành công!
                        </Text>
                        <Text className="text-green-700 text-center mb-6">
                            Đơn hàng của bạn đã được xử lý thành công. Bạn có thể kiểm tra chi tiết sự kiện đã đăng ký.
                        </Text>

                        <View className="w-full space-y-3">
                            <Button
                                onPress={() => router.push('/events' as any)}
                                className="bg-green-600 w-full p-3 rounded-lg"
                            >
                                <Text className="text-white font-medium text-center">Xem sự kiện của tôi</Text>
                            </Button>

                            <Button
                                onPress={() => router.push('/' as any)}
                                className="bg-gray-200 w-full p-3 rounded-lg"
                            >
                                <Text className="text-gray-700 font-medium text-center">Về trang chủ</Text>
                            </Button>
                        </View>
                    </CardContent>
                </Card>
            </View>
        </SafeAreaView>
    );
}
