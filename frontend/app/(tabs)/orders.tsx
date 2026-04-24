import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OrdersScreen() {
  const { userId, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'buyer' | 'seller'>('buyer');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  useFocusEffect(useCallback(() => {
    if (isLoggedIn && userId) loadOrders();
  }, [isLoggedIn, userId, viewMode, statusFilter]));

  const loadOrders = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = viewMode === 'buyer'
        ? await orderAPI.buyerHistory(userId, statusFilter)
        : await orderAPI.sellerHistory(userId, statusFilter);
      setOrders(res.data.content || []);
    } catch (e: any) {
      console.log('Error:', e.response?.data || e.message);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      Alert.alert('Success', `Order status updated to ${status}`);
      loadOrders();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  if (!isLoggedIn) return <View style={s.center}><Text>Please login first</Text></View>;

  const statuses = [undefined, 'PENDING', 'COMPLETED', 'CANCELLED_BY_BUYER', 'CANCELLED_BY_SELLER', 'NO_SHOW'];

  return (
    <View style={s.container}>
      <View style={s.toggleRow}>
        <TouchableOpacity style={[s.tab, viewMode === 'buyer' && s.activeTab]} onPress={() => setViewMode('buyer')}>
          <Text style={[s.tabText, viewMode === 'buyer' && s.activeText]}>As Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, viewMode === 'seller' && s.activeTab]} onPress={() => setViewMode('seller')}>
          <Text style={[s.tabText, viewMode === 'seller' && s.activeText]}>As Seller</Text>
        </TouchableOpacity>
      </View>

      <FlatList horizontal data={statuses} style={{ maxHeight: 44, marginBottom: 4 }} contentContainerStyle={{ paddingHorizontal: 8, gap: 6 }}
        keyExtractor={(item) => item || 'ALL'} renderItem={({ item }) => (
          <TouchableOpacity style={[s.chip, statusFilter === item && s.chipActive]}
            onPress={() => setStatusFilter(item)}>
            <Text style={[s.chipText, statusFilter === item && { color: '#fff' }]}>{item || 'ALL'}</Text>
          </TouchableOpacity>
        )} />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadOrders} />}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.cardTitle}>{item.itemTitle}</Text>
            <Text style={s.sub}>Buyer: {item.buyerUsername} | Seller: {item.sellerUsername}</Text>
            <Text style={s.sub}>Status: <Text style={{ fontWeight: '700', color: statusColor(item.status) }}>{item.status}</Text></Text>
            <Text style={s.sub}>Total: ฿{item.totalPrice} | Pickup Code: {item.pickupCode}</Text>
            {item.pickupAddress && <Text style={s.sub}>📍 {item.pickupAddress}</Text>}
            {item.pickupNote && <Text style={s.sub}>📝 {item.pickupNote}</Text>}
            <Text style={s.sub}>Created: {item.createdAt}</Text>

            {item.status === 'PENDING' && (
              <View style={s.btnRow}>
                <TouchableOpacity style={[s.smallBtn, { backgroundColor: '#34C759' }]} onPress={() => updateStatus(item.id, 'COMPLETED')}>
                  <Text style={s.smallBtnText}>Complete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.smallBtn, { backgroundColor: '#FF3B30' }]}
                  onPress={() => updateStatus(item.id, viewMode === 'buyer' ? 'CANCELLED_BY_BUYER' : 'CANCELLED_BY_SELLER')}>
                  <Text style={s.smallBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>No orders found</Text>}
      />
    </View>
  );
}

function statusColor(status: string) {
  switch (status) {
    case 'PENDING': return '#FF9500';
    case 'COMPLETED': return '#34C759';
    case 'CANCELLED_BY_BUYER': case 'CANCELLED_BY_SELLER': return '#FF3B30';
    case 'NO_SHOW': return '#8E8E93';
    default: return '#333';
  }
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  toggleRow: { flexDirection: 'row', margin: 12, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#007AFF' },
  tab: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#fff' },
  activeTab: { backgroundColor: '#007AFF' },
  tabText: { fontWeight: '600', color: '#007AFF' },
  activeText: { color: '#fff' },
  chip: { backgroundColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, justifyContent: 'center' },
  chipActive: { backgroundColor: '#007AFF' },
  chipText: { fontSize: 12, fontWeight: '600' },
  card: { backgroundColor: '#fff', margin: 8, marginHorizontal: 12, padding: 14, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  sub: { fontSize: 13, color: '#666', marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  smallBtn: { flex: 1, padding: 8, borderRadius: 6, alignItems: 'center' },
  smallBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
