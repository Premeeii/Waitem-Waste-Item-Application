import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { chatAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ChatScreen() {
  const { userId, isLoggedIn } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    if (isLoggedIn && userId) loadRooms();
  }, [isLoggedIn, userId]));

  const loadRooms = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await chatAPI.getUserRooms(userId);
      setRooms(res.data.content || []);
    } catch (e: any) {
      console.log('Error:', e.response?.data || e.message);
    }
    setLoading(false);
  };

  if (!isLoggedIn) return <View style={s.center}><Text style={s.emptyText}>Please login first</Text></View>;

  return (
    <View style={s.container}>
      <Text style={s.pageTitle}>Messages</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadRooms} colors={['#694528']} />}
        renderItem={({ item }) => {
          const otherUsername = userId === item.buyerId ? item.sellerUsername : item.buyerUsername;
          return (
            <TouchableOpacity style={s.card} onPress={() => router.push({ pathname: '/chat-room', params: { roomId: item.id, otherUser: otherUsername } })}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{otherUsername?.[0]?.toUpperCase() || '?'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{otherUsername}</Text>
                <Text style={s.itemName}>Re: {item.itemTitle}</Text>
                <Text style={s.lastMsg} numberOfLines={1}>{item.lastMessage || 'No messages yet'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                {item.lastMessageAt && <Text style={s.time}>{new Date(item.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>}
                <FontAwesome name="angle-right" size={16} color="#D3CEC4" style={{ marginTop: 8 }} />
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={s.empty}>No chats yet. Start a conversation from an item detail page!</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F4' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#3D2C23', padding: 16, paddingTop: 40, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0DCD6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#FFF', padding: 16, marginHorizontal: 16, marginTop: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E0DCD6' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0EBE1', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#694528', fontWeight: '700', fontSize: 20 },
  name: { fontWeight: '700', fontSize: 16, color: '#3D2C23' },
  itemName: { fontSize: 13, color: '#694528', marginTop: 2, fontWeight: '500' },
  lastMsg: { fontSize: 13, color: '#7A7571', marginTop: 4 },
  time: { fontSize: 11, color: '#A8A39D' },
  empty: { textAlign: 'center', marginTop: 40, color: '#7A7571', paddingHorizontal: 20 },
  emptyText: { color: '#7A7571' },
});
