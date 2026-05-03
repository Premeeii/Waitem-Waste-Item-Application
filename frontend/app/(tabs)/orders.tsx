import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ActiveOrdersScreen() {
  const { isLoggedIn } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');

  const mockOrders = [
    {
      id: 'ORD-4921',
      status: 'New',
      timePlaced: 'Placed 2 hours ago',
      total: 42.50,
      itemCount: 3,
      buyer: { name: 'Sarah Jenkins', email: 'sarah.j@example.com' },
      items: [
        { name: 'Organic Sourdough Loaf x2', price: 16.00 },
        { name: 'Local Honey (16oz) x1', price: 14.50 },
        { name: 'Artisan Strawberry Jam x1', price: 12.00 }
      ],
      actionLabel: 'Confirm Order'
    },
    {
      id: 'ORD-4918',
      status: 'Confirmed',
      timePlaced: 'Placed Yesterday',
      total: 28.00,
      itemCount: 1,
      buyer: { name: 'Michael Chen', email: '123 Market St, Apt 4B' },
      items: [
        { name: 'Vintage Wooden Bowl Set x1', price: 28.00 }
      ],
      actionLabel: 'Print Label',
      actionLabel2: 'Mark Shipped'
    },
    {
      id: 'ORD-4902',
      status: 'Shipped',
      timePlaced: 'Placed 3 days ago',
      total: 115.00,
      itemCount: 4,
      buyer: { name: 'Emily Rodriguez', email: 'Tracking: TRK9928174' },
      items: [],
      note: 'Order is currently in transit to destination.',
      actionLabel: 'View Details'
    }
  ];

  const handleAction = (action: string, orderId: string) => {
    Alert.alert('Mock Feature', `${action} for ${orderId} is not implemented yet.`);
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
      <View style={s.topNav}>
        <View style={s.logoGroup}>
          <View style={s.userAvatar}><FontAwesome name="user" size={16} color="#FFF" /></View>
          <Text style={s.navTitle}>TerraMarket</Text>
        </View>
        <TouchableOpacity><FontAwesome name="bell-o" size={20} color="#3D2C23" /></TouchableOpacity>
      </View>

      <Text style={s.pageTitle}>Active Orders</Text>
      <Text style={s.pageSubtitle}>Manage and process customer purchases.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll} contentContainerStyle={s.filterScrollContent}>
        {['All', 'New', 'Confirmed', 'Shipped'].map(filter => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity 
              key={filter} 
              style={[s.filterPill, isActive && s.activeFilterPill]}
              onPress={() => setActiveFilter(filter)}
            >
              {filter === 'New' && <FontAwesome name="star-o" size={12} color={isActive ? '#FFF' : '#D84C4C'} style={{ marginRight: 6 }} />}
              {filter === 'Confirmed' && <FontAwesome name="check-circle-o" size={12} color={isActive ? '#FFF' : '#61412A'} style={{ marginRight: 6 }} />}
              {filter === 'Shipped' && <FontAwesome name="truck" size={12} color={isActive ? '#FFF' : '#7A7571'} style={{ marginRight: 6 }} />}
              <Text style={[s.filterPillText, isActive && s.activeFilterPillText]}>{filter}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <FlatList
      style={s.container}
      data={mockOrders.filter(o => activeFilter === 'All' || o.status === activeFilter)}
      ListHeaderComponent={renderHeader}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View>
              <View style={[s.statusBadge, item.status === 'New' ? s.badgeNew : item.status === 'Confirmed' ? s.badgeConfirmed : s.badgeShipped]}>
                {item.status === 'New' && <FontAwesome name="star-o" size={10} color="#D84C4C" style={{ marginRight: 4 }} />}
                {item.status === 'Confirmed' && <FontAwesome name="file-text-o" size={10} color="#61412A" style={{ marginRight: 4 }} />}
                {item.status === 'Shipped' && <FontAwesome name="truck" size={10} color="#7A7571" style={{ marginRight: 4 }} />}
                <Text style={[s.statusText, item.status === 'New' ? s.textNew : item.status === 'Confirmed' ? s.textConfirmed : s.textShipped]}>
                  {item.status === 'New' ? 'New Order' : item.status}
                </Text>
              </View>
              <Text style={s.orderId}>#{item.id}</Text>
              <Text style={s.timeText}>{item.timePlaced}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.totalText}>${item.total.toFixed(2)}</Text>
              <Text style={s.itemCountText}>{item.itemCount} Items</Text>
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.buyerRow}>
            <View style={s.buyerAvatar}>
              <FontAwesome name="user-o" size={16} color="#3D2C23" />
            </View>
            <View>
              <Text style={s.buyerName}>{item.buyer.name}</Text>
              <Text style={s.buyerEmail}>{item.buyer.email}</Text>
            </View>
          </View>

          <View style={s.divider} />

          {item.items.length > 0 && (
            <View style={s.itemsContainer}>
              {item.items.map((cartItem, idx) => (
                <View key={idx} style={s.itemRow}>
                  <Text style={s.itemName}>{cartItem.name}</Text>
                  <Text style={s.itemPrice}>${cartItem.price.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}

          {item.note && <Text style={s.noteText}>{item.note}</Text>}

          <View style={s.actionContainer}>
            {item.actionLabel2 ? (
              <View style={s.doubleActionRow}>
                <TouchableOpacity style={s.secondaryBtn} onPress={() => handleAction(item.actionLabel, item.id)}>
                  <FontAwesome name="print" size={14} color="#3D2C23" style={{ marginRight: 8 }} />
                  <Text style={s.secondaryBtnText}>{item.actionLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.primaryBtnAlt} onPress={() => handleAction(item.actionLabel2!, item.id)}>
                  <FontAwesome name="truck" size={14} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={s.primaryBtnText}>{item.actionLabel2}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[s.primaryBtn, item.actionLabel === 'View Details' && s.outlineBtn]} 
                onPress={() => handleAction(item.actionLabel, item.id)}
              >
                {item.actionLabel === 'Confirm Order' && <FontAwesome name="check" size={14} color="#FFF" style={{ marginRight: 8 }} />}
                {item.actionLabel === 'View Details' && <FontAwesome name="eye" size={14} color="#3D2C23" style={{ marginRight: 8 }} />}
                <Text style={[s.primaryBtnText, item.actionLabel === 'View Details' && s.outlineBtnText]}>{item.actionLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
      ListEmptyComponent={<Text style={s.emptyText}>No orders found.</Text>}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F4' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerTitle: { fontSize: 18, color: '#3D2C23' },
  
  headerContainer: { padding: 16, paddingTop: 40 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  logoGroup: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#3D2C23', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  navTitle: { fontSize: 18, fontWeight: '700', color: '#694528' },
  
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#3D2C23', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: '#7A7571', marginBottom: 16 },
  
  filterScroll: { marginBottom: 8 },
  filterScrollContent: { gap: 8 },
  filterPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#D3CEC4', backgroundColor: '#FFF' },
  activeFilterPill: { backgroundColor: '#694528', borderColor: '#694528' },
  filterPillText: { color: '#3D2C23', fontWeight: '500', fontSize: 14 },
  activeFilterPillText: { color: '#FFF' },
  
  card: { backgroundColor: '#FFF', marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E0DCD6' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 8 },
  badgeNew: { backgroundColor: '#FFEBEB' },
  badgeConfirmed: { backgroundColor: '#EFEAE5' },
  badgeShipped: { backgroundColor: '#F0F0F0' },
  statusText: { fontSize: 10, fontWeight: '600' },
  textNew: { color: '#D84C4C' },
  textConfirmed: { color: '#61412A' },
  textShipped: { color: '#7A7571' },
  
  orderId: { fontSize: 18, fontWeight: '700', color: '#3D2C23', marginBottom: 2 },
  timeText: { fontSize: 12, color: '#7A7571' },
  
  totalText: { fontSize: 20, fontWeight: '600', color: '#694528', marginBottom: 2 },
  itemCountText: { fontSize: 12, color: '#7A7571', textAlign: 'right' },
  
  divider: { height: 1, backgroundColor: '#F0EBE1', marginVertical: 12 },
  
  buyerRow: { flexDirection: 'row', alignItems: 'center' },
  buyerAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0EBE1', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  buyerName: { fontSize: 14, fontWeight: '600', color: '#3D2C23', marginBottom: 2 },
  buyerEmail: { fontSize: 13, color: '#7A7571' },
  
  itemsContainer: { marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemName: { fontSize: 13, color: '#3D2C23', flex: 1, marginRight: 8 },
  itemPrice: { fontSize: 13, color: '#694528', fontWeight: '500' },
  
  noteText: { fontStyle: 'italic', color: '#7A7571', fontSize: 13, marginBottom: 12 },
  
  actionContainer: { marginTop: 4 },
  primaryBtn: { flexDirection: 'row', backgroundColor: '#694528', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
  
  outlineBtn: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D3CEC4' },
  outlineBtnText: { color: '#3D2C23' },
  
  doubleActionRow: { flexDirection: 'row', gap: 12 },
  secondaryBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#F0EBE1', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  secondaryBtnText: { color: '#3D2C23', fontWeight: '600', fontSize: 14 },
  primaryBtnAlt: { flex: 1, flexDirection: 'row', backgroundColor: '#4A5D4E', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  
  emptyText: { textAlign: 'center', marginTop: 40, color: '#7A7571' },
});
