import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
      <View style={s.header}>
        <Text style={s.headerTitle}>{otherUser}</Text>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => {
          const isMe = item.senderId === userId;
          return (
            <View style={[s.msgRow, isMe && s.msgRowMe]}>
              <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleOther]}>
                {!isMe && <Text style={s.sender}>{item.senderUsername}</Text>}
                <Text style={[s.msgText, isMe ? s.textMe : s.textOther]}>{item.content}</Text>
                <Text style={[s.time, isMe ? s.timeMe : s.timeOther]}>
                  {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={s.empty}>No messages yet. Say hi!</Text>}
      />

      <View style={s.inputRow}>
        <TextInput 
          style={s.input} 
          value={input} 
          onChangeText={setInput} 
          placeholder="Type a message..."
          placeholderTextColor="#A8A39D"
          multiline 
        />
        <TouchableOpacity style={[s.sendBtn, !input.trim() && { opacity: 0.5 }]} onPress={handleSend} disabled={loading || !input.trim()}>
          <FontAwesome name="paper-plane" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F4' },
  header: { padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0DCD6', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#3D2C23' },
  
  msgRow: { paddingHorizontal: 16, marginVertical: 4, alignItems: 'flex-start' },
  msgRowMe: { alignItems: 'flex-end' },
  
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  bubbleMe: { backgroundColor: '#694528', borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0DCD6', borderBottomLeftRadius: 4 },
  
  sender: { fontSize: 11, fontWeight: '700', color: '#694528', marginBottom: 4 },
  
  msgText: { fontSize: 15, lineHeight: 20 },
  textMe: { color: '#FFF' },
  textOther: { color: '#3D2C23' },
  
  time: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  timeMe: { color: 'rgba(255,255,255,0.7)' },
  timeOther: { color: '#A8A39D' },
  
  empty: { textAlign: 'center', marginTop: 40, color: '#7A7571' },
  
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E0DCD6', alignItems: 'flex-end', gap: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#E0DCD6', borderRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, maxHeight: 100, backgroundColor: '#F8F7F4', color: '#3D2C23', minHeight: 44 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#694528', justifyContent: 'center', alignItems: 'center' },
});
