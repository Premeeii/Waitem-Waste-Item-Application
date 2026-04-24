import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { itemAPI, orderAPI, chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [pickupNote, setPickupNote] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (id) loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const res = await itemAPI.getById(id!);
      setItem(res.data);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  const handleBuy = async () => {
    if (!item) return;
    try {
      const res = await orderAPI.create({
        buyerId: userId,
        itemId: item.id,
        totalPrice: item.discountedPrice || item.originalPrice,
        pickupAddress: item.addressText,
        pickupLatitude: item.latitude,
        pickupLongitude: item.longitude,
        pickupNote: pickupNote || undefined,
      });
      setResult(JSON.stringify(res.data, null, 2));
      Alert.alert('Success', `Order created! Pickup code: ${res.data.pickupCode}`);
      loadItem();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  const handleChat = async () => {
    if (!item) return;
    try {
      const res = await chatAPI.getOrCreateRoom(userId!, item.sellerId, item.id);
      router.push({ pathname: '/chat-room', params: { roomId: res.data.id, otherUser: item.sellerUsername } });
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Delete this item?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await itemAPI.delete(id!);
          Alert.alert('Deleted');
          router.back();
        } catch (e: any) {
          Alert.alert('Error', e.response?.data?.message || e.message);
        }
      }},
    ]);
  };

  if (!item) return <View style={s.center}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>{item.title}</Text>
      <Text style={s.badge}>{item.categoryType} • {item.categoryName}</Text>
      <Text style={s.status}>Status: {item.status}</Text>

      <View style={s.priceRow}>
        {item.discountedPrice != null && <Text style={s.price}>฿{item.discountedPrice}</Text>}
        {item.originalPrice != null && (
          <Text style={[s.price, item.discountedPrice && s.strike]}>฿{item.originalPrice}</Text>
        )}
      </View>

      <View style={s.infoBox}>
        <InfoRow label="Seller" value={item.sellerUsername} />
        <InfoRow label="Quantity" value={item.quantity} />
        <InfoRow label="Condition" value={item.condition} />
        <InfoRow label="Description" value={item.description} />
        <InfoRow label="Address" value={item.addressText} />
        <InfoRow label="Location" value={item.latitude && item.longitude ? `${item.latitude}, ${item.longitude}` : null} />
        <InfoRow label="Image URL" value={item.imageUrl} />
        <InfoRow label="Expiry" value={item.expiryDate} />
        <InfoRow label="Created" value={item.createdAt} />
      </View>

      {item.status === 'AVAILABLE' && item.sellerId !== userId && (
        <View style={s.buySection}>
          <Text style={s.sectionTitle}>Buy This Item</Text>
          <TextInput style={s.input} value={pickupNote} onChangeText={setPickupNote}
            placeholder="Pickup note (optional)" multiline />
          <TouchableOpacity style={s.buyBtn} onPress={handleBuy}>
            <Text style={s.buyBtnText}>🛒 Buy Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.sellerId !== userId && (
        <TouchableOpacity style={s.chatBtn} onPress={handleChat}>
          <Text style={s.chatBtnText}>💬 Chat with Seller</Text>
        </TouchableOpacity>
      )}

      {item.sellerId === userId && (
        <TouchableOpacity style={s.deleteBtn} onPress={handleDelete}>
          <Text style={s.deleteBtnText}>🗑 Delete My Item</Text>
        </TouchableOpacity>
      )}

      {result ? (
        <View style={s.resultBox}>
          <Text style={{ fontWeight: '700', marginBottom: 4 }}>Order Response:</Text>
          <Text style={{ fontSize: 11 }}>{result}</Text>
        </View>
      ) : null}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  if (value == null || value === '') return null;
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}:</Text>
      <Text style={s.rowValue}>{String(value)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  badge: { fontSize: 13, color: '#007AFF', fontWeight: '600', marginBottom: 4 },
  status: { fontSize: 14, color: '#666', marginBottom: 8 },
  priceRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  price: { fontSize: 24, fontWeight: '700', color: '#FF3B30' },
  strike: { textDecorationLine: 'line-through', color: '#999', fontWeight: '400', fontSize: 18 },
  infoBox: { backgroundColor: '#f9f9f9', padding: 14, borderRadius: 10, marginBottom: 16 },
  row: { flexDirection: 'row', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#eee' },
  rowLabel: { width: 100, fontWeight: '600', color: '#333' },
  rowValue: { flex: 1, color: '#666' },
  buySection: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#f9f9f9' },
  buyBtn: { backgroundColor: '#FF3B30', padding: 14, borderRadius: 8, alignItems: 'center' },
  buyBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  chatBtn: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  chatBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  deleteBtn: { backgroundColor: '#FF3B30', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  deleteBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  resultBox: { padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8, marginTop: 8 },
});
