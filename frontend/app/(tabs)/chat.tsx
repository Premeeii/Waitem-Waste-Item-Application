import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { chatAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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

  if (!isLoggedIn) return <View style={s.center}><Text>Please login first</Text></View>;

  return (
    <View style={s.container}>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadRooms} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => router.push({ pathname: '/chat-room', params: { roomId: item.id, otherUser: userId === item.buyerId ? item.sellerUsername : item.buyerUsername } })}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>
                {(userId === item.buyerId ? item.sellerUsername : item.buyerUsername)?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{userId === item.buyerId ? item.sellerUsername : item.buyerUsername}</Text>
              <Text style={s.itemName}>Re: {item.itemTitle}</Text>
              {item.lastMessage && <Text style={s.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>}
            </View>
            {item.lastMessageAt && <Text style={s.time}>{new Date(item.lastMessageAt).toLocaleTimeString()}</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={s.empty}>No chats yet. Start a conversation from an item detail page!</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 14, marginHorizontal: 12, marginTop: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  name: { fontWeight: '700', fontSize: 15 },
  itemName: { fontSize: 12, color: '#007AFF' },
  lastMsg: { fontSize: 13, color: '#666', marginTop: 2 },
  time: { fontSize: 11, color: '#999' },
  empty: { textAlign: 'center', marginTop: 40, color: '#999', paddingHorizontal: 20 },
});
