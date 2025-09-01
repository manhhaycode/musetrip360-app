/*import { useRemoveCartItemMutation, useUpdateCartItemMutation } from '@/api/cart/cartAPI';
import { Button } from '@/components/core/ui/button';
import { Text } from '@/components/core/ui/text';
import { useHaptics } from '@/hooks/useHaptics';
import { useCartStore } from '@/store/useCartStore';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeInDown, FadeOutRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
    const router = useRouter();
    const { triggerImpact } = useHaptics();

    const { items, totalItems, totalAmount, isLoading, updateCartItem, removeCartItem } = useCartStore();
    const cart = { items, totalItems, totalAmount };

    const updateCartItemMutation = useUpdateCartItemMutation({
        onSuccess: () => {
            triggerImpact('light');
        },
    });

    const removeCartItemMutation = useRemoveCartItemMutation({
        onSuccess: () => {
            triggerImpact('medium');
        },
    });

    const handleUpdateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        updateCartItem(itemId, quantity);
        triggerImpact('light');

        // updateCartItemMutation.mutate({
        //   id: itemId,
        //   data: { quantity },
        // });
    };

    const handleRemoveItem = (itemId: string) => {
        // removeCartItemMutation.mutate(itemId);
        removeCartItem(itemId);
        triggerImpact('medium');
    };

    const renderRightActions = (itemId: string) => {
        return (
            <Pressable onPress={() => handleRemoveItem(itemId)}>
                <View className="flex justify-center bg-destructive w-20 h-full">
                    <Button variant="destructive" className="h-full justify-center items-center">
                        <Trash2 color="#fff" size={24} />
                    </Button>
                </View>
            </Pressable>
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="hsl(240, 5.9%, 10%)" />
            </View>
        );
    }

    if (!cart?.items.length) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="p-4">
                    <Text className="text-2xl font-bold">Your Cart</Text>
                </View>
                <Animated.View entering={FadeIn.duration(400)} className="flex-1 justify-center items-center p-4">
                    <ShoppingCart size={64} color="hsl(240, 3.8%, 46.1%)" />
                    <Text className="text-xl font-semibold mt-4">Your cart is empty</Text>
                    <Text className="text-muted-foreground text-center mt-2">
                        Add some furniture items to your cart to get started
                    </Text>
                    <Button className="mt-6" onPress={() => router.push('/')}>
                        Browse Products
                    </Button>
                </Animated.View>
            </SafeAreaView>
        );
    }

    const formattedTotal = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(cart.totalAmount);

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="p-4">
                <Text className="text-2xl font-bold">Your Cart</Text>
                <Text className="text-muted-foreground mt-1">
                    {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                </Text>
            </View>

            <ScrollView className="flex-1">
                {cart.items.map((item, index) => (
                    <Animated.View
                        key={item.id}
                        entering={FadeInDown.delay(index * 100).duration(400)}
                        exiting={FadeOutRight.duration(300)}
                    >
                        <Swipeable renderRightActions={() => renderRightActions(item.id)}>
                            <View className="flex-row p-4 border-b border-border">
                                <Image source={{ uri: item.product.thumbnail }} className="w-20 h-20 rounded-md" contentFit="cover" />
                                <View className="flex-1 ml-4 justify-between">
                                    <View>
                                        <Text className="font-medium">{item.product.name}</Text>
                                        {item.product.categories.length > 0 && (
                                            <Text className="text-sm text-muted-foreground">{item.product.categories[0].name}</Text>
                                        )}
                                    </View>

                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-row items-center">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8"
                                                onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus size={16} />
                                            </Button>
                                            <Text className="mx-3 font-medium">{item.quantity}</Text>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8"
                                                onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus size={16} />
                                            </Button>
                                        </View>

                                        <Text className="font-bold">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                            }).format(item.product.price * (1 - (item.product.discount || 0)) * item.quantity)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Swipeable>
                    </Animated.View>
                ))}
            </ScrollView>

            <View className="p-4 border-t border-border">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-muted-foreground">Subtotal</Text>
                    <Text className="font-medium">{formattedTotal}</Text>
                </View>
                <View className="flex-row justify-between mb-4">
                    <Text className="text-muted-foreground">Shipping</Text>
                    <Text className="font-medium">Free</Text>
                </View>
                <View className="flex-row justify-between mb-6">
                    <Text className="font-bold">Total</Text>
                    <Text className="font-bold text-lg">{formattedTotal}</Text>
                </View>

                <Button className="w-full" onPress={() => router.push('/checkout')}>
                    Proceed to Checkout
                </Button>
            </View>
        </SafeAreaView>
    );
}
    */
