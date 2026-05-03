import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { itemAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PendingApprovalsScreen() {
  const { isLoggedIn, role } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    if (isLoggedIn) loadItems();
  }, [isLoggedIn]));

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await itemAPI.getAll(0);
      setItems(res.data.content || []);
    } catch (e: any) {
      console.log('Error:', e.response?.data || e.message);
    }
    setLoading(false);
  };

  const handleAction = (action: string, id: number) => {
    Alert.alert('Mock Feature', `${action} listing #${id} is not implemented yet.`);
  };

  if (!isLoggedIn) {
    return (
      <View style={s.centerContainer}>
        <Text style={s.centerTitle}>Sign in Required</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={s.headerContainer}>
      <Text style={s.pageTitle}>Pending Approvals</Text>
      <Text style={s.pageSubtitle}>Review and manage new seller listings to ensure quality and sustainability standards.</Text>
      
      <View style={s.actionRow}>
        <TouchableOpacity style={s.filterBtn}>
          <FontAwesome name="filter" size={14} color="#3D2C23" style={{ marginRight: 8 }} />
          <Text style={s.filterBtnText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.sortBtn}>
          <FontAwesome name="sort" size={14} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={s.sortBtnText}>Sort</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      style={s.container}
      data={items}
      ListHeaderComponent={renderHeader}
      keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadItems} colors={['#694528']} />}
      renderItem={({ item }) => (
        <View style={s.card}>
          <View style={s.cardImgPlaceholder}>
            <View style={s.timeBadge}>
              <FontAwesome name="clock-o" size={12} color="#3D2C23" style={{ marginRight: 4 }} />
              <Text style={s.timeText}>2h ago</Text>
            </View>
            <FontAwesome name="image" size={48} color="#D3CEC4" />
          </View>
          
          <View style={s.cardContent}>
            <View style={s.cardHeaderRow}>
              <View style={s.tagBadge}>
                <Text style={s.tagText}>{item.categoryName || 'Item'}</Text>
              </View>
              <Text style={s.cardPrice}>${item.originalPrice || '0.00'}</Text>
            </View>
            
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.cardDesc} numberOfLines={2}>{item.description || 'No description provided.'}</Text>
            
            <View style={s.sellerRow}>
              <View style={s.sellerAvatar}>
                <Text style={s.sellerInitials}>{item.sellerUsername ? item.sellerUsername.substring(0, 2).toUpperCase() : 'U'}</Text>
              </View>
              <Text style={s.sellerName}>Seller: {item.sellerUsername}</Text>
            </View>

            <View style={s.btnRow}>
              <TouchableOpacity style={s.rejectBtn} onPress={() => handleAction('Reject', item.id)}>
                <FontAwesome name="times" size={14} color="#3D2C23" style={{ marginRight: 8 }} />
                <Text style={s.rejectBtnText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.approveBtn} onPress={() => handleAction('Approve', item.id)}>
                <FontAwesome name="check" size={14} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={s.approveBtnText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListEmptyComponent={<Text style={s.emptyText}>No pending approvals.</Text>}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F4' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerTitle: { fontSize: 18, color: '#3D2C23' },
  
  headerContainer: { padding: 16, paddingTop: 40 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#3D2C23', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#7A7571', marginBottom: 16, lineHeight: 20 },
  
  actionRow: { flexDirection: 'row', gap: 12 },
  filterBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: '#D3CEC4', borderRadius: 8, backgroundColor: '#F0EBE1' },
  filterBtnText: { color: '#3D2C23', fontWeight: '500' },
  sortBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, backgroundColor: '#694528' },
  sortBtnText: { color: '#FFF', fontWeight: '500' },
  
  card: { backgroundColor: '#FFF', marginHorizontal: 16, marginBottom: 16, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E0DCD6' },
  cardImgPlaceholder: { height: 160, backgroundColor: '#FFDCA8', justifyContent: 'center', alignItems: 'center' },
  timeBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timeText: { fontSize: 10, fontWeight: '600', color: '#3D2C23' },
  
  cardContent: { padding: 16 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tagBadge: { backgroundColor: '#F0EBE1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 10, color: '#3D2C23', fontWeight: '500' },
  cardPrice: { fontSize: 16, fontWeight: '600', color: '#694528' },
  
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#3D2C23', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#7A7571', marginBottom: 12, lineHeight: 18 },
  
  sellerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sellerAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#D3CEC4', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  sellerInitials: { fontSize: 10, fontWeight: '600', color: '#3D2C23' },
  sellerName: { fontSize: 13, color: '#3D2C23' },
  
  btnRow: { flexDirection: 'row', gap: 12 },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: '#F0EBE1', borderRadius: 8 },
  rejectBtnText: { color: '#3D2C23', fontWeight: '600' },
  approveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: '#694528', borderRadius: 8 },
  approveBtnText: { color: '#FFF', fontWeight: '600' },
  
  emptyText: { textAlign: 'center', marginTop: 40, color: '#7A7571' },
});
