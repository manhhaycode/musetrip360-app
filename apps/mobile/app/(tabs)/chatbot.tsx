/*import { useCreateConversation, useCreateMessage, useGetConversationMessages } from '@musetrip360/ai-bot/lib/api/hooks/useChat';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatbotTab() {
    const [input, setInput] = useState('');
    const [conversationId, setConversationId] = useState<string | null>(null);

    const createConversation = useCreateConversation();
    const sendMessage = useCreateMessage();
    const getMessages = useGetConversationMessages();

    // Tạo conversation mới khi vào tab
    useEffect(() => {
        if (!conversationId && !createConversation.isPending) {
            createConversation.mutateAsync({ title: 'Chatbot AI' }).then(conv => {
                setConversationId(conv.id);
                getMessages.mutate({ conversationId: conv.id, page: 1, pageSize: 20 });
            });
        }
    }, [conversationId]);

    // Gửi tin nhắn
    const handleSend = async () => {
        if (!conversationId || input.trim() === '') return;
        await sendMessage.mutateAsync({ conversationId, content: input });
        setInput('');
        getMessages.mutate({ conversationId, page: 1, pageSize: 20 });
    };

    const messages = getMessages.data?.data?.list || [];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={80}
            >
                <View style={{ flex: 1, padding: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Chatbot AI</Text>
                    {getMessages.isPending ? (
                        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 32 }} />
                    ) : (
                        <FlatList
                            data={messages}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <View style={{ marginBottom: 12, alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                    <Text style={{
                                        backgroundColor: item.role === 'user' ? '#007AFF' : '#f1f1f1',
                                        color: item.role === 'user' ? '#fff' : '#222',
                                        padding: 10,
                                        borderRadius: 16,
                                        fontSize: 16,
                                    }}>
                                        {item.content}
                                    </Text>
                                </View>
                            )}
                            inverted
                            contentContainerStyle={{ flexDirection: 'column-reverse' }}
                        />
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Nhập tin nhắn..."
                            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 16, padding: 10, marginRight: 8 }}
                            editable={!sendMessage.isPending}
                        />
                        <Button title="Gửi" onPress={handleSend} disabled={sendMessage.isPending || input.trim() === ''} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
*/
