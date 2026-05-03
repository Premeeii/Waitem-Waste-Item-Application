import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, RefreshControl, Image, ScrollView, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { itemAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function DiscoverScreen() {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

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
      <View style={s.centerContainer}>
        <FontAwesome name="leaf" size={48} color="#61412A" style={{ marginBottom: 20 }} />
        <Text style={s.centerTitle}>Welcome to TerraMarket</Text>
        <Text style={s.centerSubtitle}>Sign in to discover local, sustainable goods.</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.push('/auth')}>
          <Text style={s.btnText}>Sign In / Register</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={s.headerContainer}>
      <View style={s.topNav}>
        <TouchableOpacity><FontAwesome name="bars" size={24} color="#3D2C23" /></TouchableOpacity>
        <Text style={s.navTitle}>TerraMarket</Text>
        <TouchableOpacity><FontAwesome name="shopping-cart" size={24} color="#3D2C23" /></TouchableOpacity>
      </View>

      <Text style={s.pageTitle}>Discover</Text>
      <Text style={s.pageSubtitle}>Find local, sustainable goods.</Text>

      <View style={s.searchContainer}>
        <FontAwesome name="search" size={18} color="#7A7571" style={s.searchIcon} />
        <TextInput 
          style={s.searchInput} 
          placeholder="Search marketplace..." 
          placeholderTextColor="#A8A39D"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onSubmitEditing={handleSearch}
        />
      </View>

      <View style={s.banner}>
        <Text style={s.bannerTag}>FEATURED</Text>
        <Text style={s.bannerTitle}>Sustainable Deals</Text>
        <Text style={s.bannerSubtitle}>Up to 40% off rescued produce and upcycled home goods.</Text>
        <TouchableOpacity style={s.bannerBtn}>
          <Text style={s.bannerBtnText}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.categoryScroll} contentContainerStyle={s.categoryScrollContent}>
        {['All', 'Second-hand', 'Food Waste', 'Crafts'].map(cat => (
          <TouchableOpacity 
            key={cat} 
            style={[s.catPill, activeCategory === cat && s.activeCatPill]}
            onPress={() => setActiveCategory(cat)}
          >
            {activeCategory === cat && <FontAwesome name="check" size={12} color="#FFF" style={{ marginRight: 6 }} />}
            <Text style={[s.catPillText, activeCategory === cat && s.activeCatPillText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <FlatList
      style={s.container}
      data={items}
      numColumns={2}
      columnWrapperStyle={s.row}
      ListHeaderComponent={renderHeader}
      keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadItems} colors={['#694528']} />}
      renderItem={({ item }) => (
        <TouchableOpacity style={s.card} onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id } })}>
          <View style={s.cardImgPlaceholder}>
            <View style={s.tagBadge}>
              <FontAwesome name="recycle" size={10} color="#3D2C23" style={{ marginRight: 4 }} />
              <Text style={s.tagText}>{item.categoryName || 'Item'}</Text>
            </View>
            <FontAwesome name="image" size={40} color="#D3CEC4" />
          </View>
          <View style={s.cardContent}>
            <Text style={s.cardTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={s.cardSeller}>{item.sellerUsername}</Text>
            <View style={s.cardFooter}>
              <Text style={s.cardPrice}>${item.originalPrice || '0.00'}</Text>
              <TouchableOpacity style={s.addBtn} onPress={() => Alert.alert('Added to cart')}>
                <FontAwesome name="plus" size={12} color="#3D2C23" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={s.emptyText}>No items found in this category.</Text>}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F4' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F8F7F4' },
  centerTitle: { fontSize: 24, fontWeight: '700', color: '#3D2C23', marginBottom: 8 },
  centerSubtitle: { fontSize: 16, color: '#7A7571', textAlign: 'center', marginBottom: 24 },
  btn: { backgroundColor: '#694528', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 },
  btnText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  headerContainer: { padding: 16, paddingBottom: 8 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 40 },
  navTitle: { fontSize: 20, fontWeight: '700', color: '#694528', fontStyle: 'italic' },
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#3D2C23', marginBottom: 4 },
  pageSubtitle: { fontSize: 15, color: '#7A7571', marginBottom: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F7F4', borderWidth: 1, borderColor: '#E0DCD6', borderRadius: 24, paddingHorizontal: 16, marginBottom: 20 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#3D2C23' },
  banner: { backgroundColor: '#4A3B32', borderRadius: 12, padding: 20, marginBottom: 20 },
  bannerTag: { color: '#FFF', fontSize: 10, fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 12, overflow: 'hidden' },
  bannerTitle: { color: '#FFF', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  bannerSubtitle: { color: '#E0DCD6', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  bannerBtn: { backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  bannerBtnText: { color: '#4A3B32', fontWeight: '700', fontSize: 14 },
  categoryScroll: { marginBottom: 16 },
  categoryScrollContent: { gap: 8 },
  catPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E0DCD6', backgroundColor: '#FFF' },
  activeCatPill: { backgroundColor: '#694528', borderColor: '#694528' },
  catPillText: { color: '#3D2C23', fontWeight: '500', fontSize: 14 },
  activeCatPillText: { color: '#FFF' },
  row: { paddingHorizontal: 12, justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E0DCD6' },
  cardImgPlaceholder: { height: 140, backgroundColor: '#F0EBE1', justifyContent: 'center', alignItems: 'center' },
  tagBadge: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 10, fontWeight: '600', color: '#3D2C23' },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#3D2C23', marginBottom: 4, height: 40 },
  cardSeller: { fontSize: 12, color: '#7A7571', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: 18, fontWeight: '700', color: '#694528' },
  addBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F0EBE1', justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#7A7571', fontSize: 15 },
});
