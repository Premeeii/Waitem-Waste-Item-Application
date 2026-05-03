import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, StyleSheet, Image, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { itemAPI, orderAPI, chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [pickupNote, setPickupNote] = useState('');
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
      Alert.alert('Success', `Order created! Pickup code: ${res.data.pickupCode}`, [
        { text: 'View Orders', onPress: () => router.push('/orders') },
        { text: 'OK', onPress: () => loadItem() }
      ]);
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
    setDeleteStatus('idle');
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    setDeleteStatus('loading');
    try {
      await itemAPI.delete(id!);
      setDeleteStatus('success');
    } catch (e: any) {
      setDeleteStatus('error');
    }
  };

  if (!item) return <View style={s.center}><Text style={{color: '#7A7571'}}>Loading...</Text></View>;

  return (
    <ScrollView style={s.container}>
      <View style={s.imagePlaceholder}>
        <FontAwesome name="image" size={64} color="#D3CEC4" />
      </View>

      <View style={s.content}>
        <View style={s.headerRow}>
          <View style={s.tagBadge}>
            <Text style={s.tagText}>{item.categoryName}</Text>
          </View>
          <Text style={s.statusText}>{item.status}</Text>
        </View>

        <Text style={s.title}>{item.title}</Text>
        
        <View style={s.priceRow}>
          {item.discountedPrice != null && <Text style={s.price}>${item.discountedPrice}</Text>}
          {item.originalPrice != null && (
            <Text style={[s.price, item.discountedPrice && s.strike]}>${item.originalPrice}</Text>
          )}
        </View>

        <View style={s.sellerCard}>
          <View style={s.sellerAvatar}>
            <Text style={s.sellerAvatarText}>{item.sellerUsername?.substring(0,2).toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.sellerName}>{item.sellerUsername}</Text>
            <Text style={s.sellerSubtitle}>Seller</Text>
          </View>
          {item.sellerId !== userId && (
            <TouchableOpacity style={s.iconBtn} onPress={handleChat}>
              <FontAwesome name="comment-o" size={20} color="#694528" />
            </TouchableOpacity>
          )}
        </View>

        <View style={s.detailsBox}>
          <Text style={s.sectionTitle}>Details</Text>
          <InfoRow label="Condition" value={item.condition} />
          <InfoRow label="Quantity" value={item.quantity} />
          <InfoRow label="Address" value={item.addressText} />
        </View>

        <View style={s.detailsBox}>
          <Text style={s.sectionTitle}>Description</Text>
          <Text style={s.descText}>{item.description || 'No description provided.'}</Text>
        </View>

        {item.status === 'AVAILABLE' && item.sellerId !== userId && (
          <View style={s.buySection}>
            <TextInput 
              style={s.input} 
              value={pickupNote} 
              onChangeText={setPickupNote}
              placeholder="Add a note for pickup (optional)" 
              placeholderTextColor="#A8A39D"
            />
            <TouchableOpacity style={s.buyBtn} onPress={handleBuy}>
              <Text style={s.buyBtnText}>Purchase Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.sellerId === userId && (
          <TouchableOpacity style={s.deleteBtn} onPress={handleDelete}>
            <FontAwesome name="trash" size={16} color="#D84C4C" style={{ marginRight: 8 }} />
            <Text style={s.deleteBtnText}>Delete Listing</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </View>

      <Modal visible={isDeleteModalVisible} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            {deleteStatus === 'idle' && (
              <>
                <Text style={s.modalTitle}>Delete Listing</Text>
                <Text style={s.modalText}>Are you sure you want to delete this listing?</Text>
                <View style={s.modalBtnRow}>
                  <TouchableOpacity style={s.modalCancelBtn} onPress={() => setDeleteModalVisible(false)}>
                    <Text style={s.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.modalConfirmBtn} onPress={confirmDelete}>
                    <Text style={s.modalConfirmText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {deleteStatus === 'loading' && (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text style={s.modalText}>Deleting...</Text>
              </View>
            )}
            {deleteStatus === 'success' && (
              <>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                  <FontAwesome name="check-circle" size={48} color="#4A5D4E" />
                </View>
                <Text style={[s.modalTitle, { textAlign: 'center' }]}>Deleted Successfully</Text>
                <Text style={[s.modalText, { textAlign: 'center' }]}>This item has been removed from the marketplace.</Text>
                <TouchableOpacity style={[s.modalConfirmBtn, { width: '100%', marginTop: 12 }]} onPress={() => {
                  setDeleteModalVisible(false);
                  router.back();
                }}>
                  <Text style={s.modalConfirmText}>Go Back</Text>
                </TouchableOpacity>
              </>
            )}
            {deleteStatus === 'error' && (
              <>
                <Text style={s.modalTitle}>Error</Text>
                <Text style={s.modalText}>Could not delete the item. Please try again.</Text>
                <TouchableOpacity style={[s.modalCancelBtn, { marginTop: 12 }]} onPress={() => setDeleteModalVisible(false)}>
                  <Text style={s.modalCancelText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: any }) {
  if (value == null || value === '') return null;
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{String(value)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F7F4' },
  imagePlaceholder: { height: 250, backgroundColor: '#E0DCD6', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tagBadge: { backgroundColor: '#F0EBE1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagText: { color: '#3D2C23', fontWeight: '600', fontSize: 12 },
  statusText: { fontSize: 13, color: '#694528', fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '700', color: '#3D2C23', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 20 },
  price: { fontSize: 28, fontWeight: '700', color: '#694528' },
  strike: { textDecorationLine: 'line-through', color: '#A8A39D', fontWeight: '400', fontSize: 18 },
  
  sellerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E0DCD6', marginBottom: 24 },
  sellerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D3CEC4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sellerAvatarText: { color: '#3D2C23', fontWeight: '700', fontSize: 16 },
  sellerName: { fontSize: 16, fontWeight: '600', color: '#3D2C23' },
  sellerSubtitle: { fontSize: 12, color: '#7A7571' },
  iconBtn: { padding: 10, backgroundColor: '#F0EBE1', borderRadius: 20 },
  
  detailsBox: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#3D2C23', marginBottom: 12 },
  row: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0EBE1' },
  rowLabel: { width: 100, color: '#7A7571', fontWeight: '500' },
  rowValue: { flex: 1, color: '#3D2C23', fontWeight: '500' },
  descText: { fontSize: 15, color: '#3D2C23', lineHeight: 24 },
  
  buySection: { marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#D3CEC4', borderRadius: 8, padding: 14, marginBottom: 12, backgroundColor: '#FFF', color: '#3D2C23' },
  buyBtn: { backgroundColor: '#694528', padding: 16, borderRadius: 8, alignItems: 'center' },
  buyBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  
  deleteBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#D84C4C', marginTop: 16 },
  deleteBtnText: { color: '#D84C4C', fontWeight: '600', fontSize: 16 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '85%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#3D2C23', marginBottom: 8 },
  modalText: { fontSize: 15, color: '#7A7571', marginBottom: 24, lineHeight: 22 },
  modalBtnRow: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: '#F0EBE1', alignItems: 'center' },
  modalCancelText: { color: '#3D2C23', fontWeight: '600', fontSize: 15 },
  modalConfirmBtn: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: '#D84C4C', alignItems: 'center' },
  modalConfirmText: { color: '#FFF', fontWeight: '600', fontSize: 15 },
});
