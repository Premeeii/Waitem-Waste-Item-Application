import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, RefreshControl } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { itemAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ItemsScreen() {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useFocusEffect(useCallback(() => {
    if (isLoggedIn) loadItems();
  }, [isLoggedIn]));

  const loadItems = async (p = 0) => {
    setLoading(true);
    try {
      const res = await itemAPI.getAll(p);
      setItems(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(p);
    } catch (e: any) {
      console.log('Error:', e.response?.data || e.message);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) { loadItems(); return; }
    setLoading(true);
    try {
      const res = await itemAPI.search(searchKeyword);
      setItems(res.data.content || []);
    } catch (e: any) {
      console.log('Search error:', e.response?.data || e.message);
    }
    setLoading(false);
  };

  if (!isLoggedIn) {
    return (
      <View style={s.center}>
        <Text style={s.title}>Welcome to Waitem</Text>
        <Text style={{ marginBottom: 20, color: '#666' }}>Please login to continue</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.push('/auth')}>
          <Text style={s.btnText}>Login / Register</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.searchRow}>
        <TextInput style={s.searchInput} value={searchKeyword} onChangeText={setSearchKeyword}
          placeholder="Search items..." onSubmitEditing={handleSearch} />
        <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={s.actionRow}>
        <TouchableOpacity style={s.actionBtn} onPress={() => router.push('/create-item')}>
          <Text style={s.actionBtnText}>+ Create Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#34C759' }]} onPress={() => loadItems()}>
          <Text style={s.actionBtnText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => loadItems()} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card} onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id } })}>
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.cardSub}>Seller: {item.sellerUsername} | Category: {item.categoryName}</Text>
            <Text style={s.cardSub}>Type: {item.categoryType} | Status: {item.status}</Text>
            <View style={s.priceRow}>
              {item.discountedPrice && <Text style={s.price}>฿{item.discountedPrice}</Text>}
              {item.originalPrice && <Text style={[s.price, item.discountedPrice && s.strikethrough]}>฿{item.originalPrice}</Text>}
            </View>
            {item.addressText && <Text style={s.cardSub}>📍 {item.addressText}</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={s.empty}>No items found</Text>}
      />

      {totalPages > 1 && (
        <View style={s.pagination}>
          <TouchableOpacity disabled={page <= 0} onPress={() => loadItems(page - 1)}>
            <Text style={[s.pageBtn, page <= 0 && { color: '#ccc' }]}>◀ Prev</Text>
          </TouchableOpacity>
          <Text>Page {page + 1} / {totalPages}</Text>
          <TouchableOpacity disabled={page >= totalPages - 1} onPress={() => loadItems(page + 1)}>
            <Text style={[s.pageBtn, page >= totalPages - 1 && { color: '#ccc' }]}>Next ▶</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  btn: { backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  searchRow: { flexDirection: 'row', padding: 12, gap: 8 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  searchBtn: { backgroundColor: '#007AFF', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  actionRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 8 },
  actionBtn: { flex: 1, backgroundColor: '#007AFF', padding: 10, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: '#fff', margin: 8, marginHorizontal: 12, padding: 14, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#666', marginTop: 2 },
  priceRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  price: { fontSize: 16, fontWeight: '700', color: '#FF3B30' },
  strikethrough: { textDecorationLine: 'line-through', color: '#999', fontWeight: '400' },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, alignItems: 'center' },
  pageBtn: { color: '#007AFF', fontWeight: '600' },
});
