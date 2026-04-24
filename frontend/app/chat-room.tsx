import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ChatRoomScreen() {
  const { roomId, otherUser } = useLocalSearchParams<{ roomId: string; otherUser: string }>();
  const { userId } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (roomId) {
      loadMessages();
      // Poll for new messages every 3 seconds (simple alternative to WebSocket on mobile)
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  const loadMessages = async () => {
    try {
      const res = await chatAPI.getMessages(roomId!, 0, 100);
      setMessages(res.data.content || []);
    } catch (e: any) {
      console.log('Error:', e.response?.data || e.message);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      await chatAPI.sendMessage({
        chatRoomId: roomId!,
        senderId: userId!,
        content: input.trim(),
      });
      setInput('');
      loadMessages();
    } catch (e: any) {
      console.log('Send error:', e.response?.data || e.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item }) => {
          const isMe = item.senderId === userId;
          return (
            <View style={[s.msgRow, isMe && s.msgRowMe]}>
              <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleOther]}>
                {!isMe && <Text style={s.sender}>{item.senderUsername}</Text>}
                <Text style={[s.msgText, isMe && { color: '#fff' }]}>{item.content}</Text>
                <Text style={[s.time, isMe && { color: 'rgba(255,255,255,0.7)' }]}>
                  {new Date(item.createdAt).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={s.empty}>No messages yet. Say hi!</Text>}
      />

      <View style={s.inputRow}>
        <TextInput style={s.input} value={input} onChangeText={setInput} placeholder="Type a message..."
          multiline onSubmitEditing={handleSend} />
        <TouchableOpacity style={s.sendBtn} onPress={handleSend} disabled={loading || !input.trim()}>
          <Text style={s.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  msgRow: { paddingHorizontal: 12, marginVertical: 2, alignItems: 'flex-start' },
  msgRowMe: { alignItems: 'flex-end' },
  bubble: { maxWidth: '75%', padding: 10, borderRadius: 16, marginVertical: 2 },
  bubbleMe: { backgroundColor: '#007AFF', borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: '#e5e5ea', borderBottomLeftRadius: 4 },
  sender: { fontSize: 11, fontWeight: '700', color: '#007AFF', marginBottom: 2 },
  msgText: { fontSize: 15 },
  time: { fontSize: 10, color: '#999', marginTop: 4, textAlign: 'right' },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
  inputRow: { flexDirection: 'row', padding: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 100 },
  sendBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, borderRadius: 20, justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontWeight: '700' },
});
