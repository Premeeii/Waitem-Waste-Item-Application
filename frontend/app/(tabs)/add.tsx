import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Modal } from 'react-native';
import { router } from 'expo-router';
import { itemAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function AddListingScreen() {
  const { userId, isLoggedIn } = useAuth();
  
  // Shared state
  const [activeCategory, setActiveCategory] = useState('Second-hand');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [addressText, setAddressText] = useState('');
  const [quantity, setQuantity] = useState('1');

  // Modal State
  const [isPublishModalVisible, setPublishModalVisible] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Category specific state
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [condition, setCondition] = useState('Like New');
  const [expiryDate, setExpiryDate] = useState('');

  if (!isLoggedIn) {
    return (
      <View style={s.centerContainer}>
        <Text style={s.centerTitle}>Sign in Required</Text>
        <Text style={s.centerSubtitle}>Please sign in to add new listings.</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.push('/auth')}>
          <Text style={s.btnText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const openPublishModal = () => {
    if (!title || !price || !addressText || !quantity) {
      Alert.alert('Error', 'Title, Price, Quantity, and Pickup Location are required');
      return;
    }
    setPublishStatus('idle');
    setPublishModalVisible(true);
  };

  const confirmPublish = async () => {
    setPublishStatus('loading');
    try {
      const isFood = activeCategory === 'Food Waste';
      const categoryId = isFood ? 2 : 1; 
      
      let formattedExpiry = null;
      if (isFood && expiryDate) {
        // Simple formatting to match Spring Boot LocalDateTime (YYYY-MM-DDTHH:mm:ss)
        formattedExpiry = expiryDate.includes('T') ? expiryDate : `${expiryDate}T23:59:59`;
      }
      
      const data: any = {
        sellerId: userId,
        categoryId: categoryId,
        title,
        description,
        originalPrice: price ? parseFloat(price) : null,
        discountedPrice: isFood && discountedPrice ? parseFloat(discountedPrice) : null,
        condition: isFood ? 'Fresh/Edible' : condition,
        expiryDate: formattedExpiry,
        addressText,
        quantity: parseInt(quantity, 10) || 1,
      };

      await itemAPI.create(data);
      setPublishStatus('success');
    } catch (error: any) {
      setPublishStatus('error');
    }
  };

  const handleMockUpload = () => {
    Alert.alert('Mock Feature', 'Photo upload is not implemented yet.');
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Text style={s.pageTitle}>Add New Listing</Text>
      <Text style={s.pageSubtitle}>Share your items with the community.</Text>

      <Text style={s.label}>Category</Text>
      <View style={s.categoryRow}>
        {['Second-hand', 'Food Waste'].map(cat => (
          <TouchableOpacity 
            key={cat} 
            style={[s.catPill, activeCategory === cat && s.activeCatPill]}
            onPress={() => setActiveCategory(cat)}
          >
            {activeCategory === cat && <FontAwesome name="check" size={12} color="#FFF" style={{ marginRight: 8 }} />}
            <Text style={[s.catPillText, activeCategory === cat && s.activeCatPillText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.label}>Photos</Text>
      <TouchableOpacity style={s.uploadBox} onPress={handleMockUpload}>
        <View style={s.uploadIconWrapper}>
          <FontAwesome name="camera" size={20} color="#FFF" />
        </View>
        <Text style={s.uploadText}>Upload photos</Text>
        <Text style={s.uploadSubtext}>PNG, JPG up to 5MB</Text>
      </TouchableOpacity>

      <Text style={s.label}>Title</Text>
      <View style={s.inputWrapper}>
        <TextInput 
          style={s.input} 
          placeholder={activeCategory === 'Food Waste' ? "e.g. Excess Bakery Bread" : "What are you listing?"} 
          placeholderTextColor="#A8A39D"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {activeCategory === 'Second-hand' ? (
        <View style={s.row}>
          <View style={s.col}>
            <Text style={s.label}>Price</Text>
            <View style={s.inputWrapper}>
              <Text style={s.prefix}>$</Text>
              <TextInput 
                style={[s.input, { paddingLeft: 8 }]} 
                placeholder="0.00" 
                placeholderTextColor="#A8A39D"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>
          <View style={s.col}>
            <Text style={s.label}>Condition</Text>
            <TouchableOpacity style={[s.inputWrapper, { justifyContent: 'space-between' }]} onPress={() => Alert.alert('Mock Feature', 'Dropdown not implemented')}>
              <Text style={{ color: '#3D2C23', fontSize: 16 }}>{condition}</Text>
              <FontAwesome name="angle-down" size={20} color="#7A7571" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={s.row}>
            <View style={s.col}>
              <Text style={s.label}>Original Price</Text>
              <View style={s.inputWrapper}>
                <Text style={s.prefix}>$</Text>
                <TextInput 
                  style={[s.input, { paddingLeft: 8 }]} 
                  placeholder="0.00" 
                  placeholderTextColor="#A8A39D"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
            </View>
            <View style={s.col}>
              <Text style={s.label}>Discounted Price</Text>
              <View style={s.inputWrapper}>
                <Text style={s.prefix}>$</Text>
                <TextInput 
                  style={[s.input, { paddingLeft: 8 }]} 
                  placeholder="0.00" 
                  placeholderTextColor="#A8A39D"
                  keyboardType="numeric"
                  value={discountedPrice}
                  onChangeText={setDiscountedPrice}
                />
              </View>
            </View>
          </View>
          
          <Text style={s.label}>Expiry Date (YYYY-MM-DD)</Text>
          <View style={s.inputWrapper}>
            <TextInput 
              style={s.input} 
              placeholder="e.g. 2026-12-31" 
              placeholderTextColor="#A8A39D"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
          </View>
        </>
      )}

      <View style={s.row}>
        <View style={s.col}>
          <Text style={s.label}>Quantity</Text>
          <View style={s.inputWrapper}>
            <TextInput 
              style={s.input} 
              placeholder="1" 
              placeholderTextColor="#A8A39D"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>
        </View>
      </View>

      <Text style={s.label}>Pickup Location</Text>
      <View style={s.inputWrapper}>
        <TextInput 
          style={s.input} 
          placeholder="Address or meeting point" 
          placeholderTextColor="#A8A39D"
          value={addressText}
          onChangeText={setAddressText}
        />
      </View>

      <Text style={s.label}>Description</Text>
      <View style={[s.inputWrapper, { alignItems: 'flex-start' }]}>
        <TextInput 
          style={[s.input, { height: 100, textAlignVertical: 'top' }]} 
          placeholder="Describe your item, its history, or ingredients..." 
          placeholderTextColor="#A8A39D"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <TouchableOpacity style={s.publishBtn} onPress={openPublishModal}>
        <Text style={s.publishBtnText}>Publish Listing</Text>
      </TouchableOpacity>

      <Modal visible={isPublishModalVisible} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            {publishStatus === 'idle' && (
              <>
                <Text style={s.modalTitle}>Publish Listing</Text>
                <Text style={s.modalText}>Are you sure you want to publish this {activeCategory} listing?</Text>
                <View style={s.modalBtnRow}>
                  <TouchableOpacity style={s.modalCancelBtn} onPress={() => setPublishModalVisible(false)}>
                    <Text style={s.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.modalConfirmBtn} onPress={confirmPublish}>
                    <Text style={s.modalConfirmText}>Publish</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {publishStatus === 'loading' && (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text style={s.modalText}>Publishing...</Text>
              </View>
            )}
            {publishStatus === 'success' && (
              <>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                  <FontAwesome name="check-circle" size={48} color="#4A5D4E" />
                </View>
                <Text style={[s.modalTitle, { textAlign: 'center' }]}>Published Successfully</Text>
                <Text style={[s.modalText, { textAlign: 'center' }]}>Your listing is now live on TerraMarket!</Text>
                <TouchableOpacity style={[s.modalConfirmBtn, { width: '100%', marginTop: 12, backgroundColor: '#694528' }]} onPress={() => {
                  setPublishModalVisible(false);
                  
                  // Reset form
                  setTitle('');
                  setDescription('');
                  setAddressText('');
                  setPrice('');
                  setDiscountedPrice('');
                  setExpiryDate('');
                  setQuantity('1');

                  router.push('/');
                }}>
                  <Text style={s.modalConfirmText}>Go to Home</Text>
                </TouchableOpacity>
              </>
            )}
            {publishStatus === 'error' && (
              <>
                <Text style={s.modalTitle}>Error</Text>
                <Text style={s.modalText}>Could not publish the listing. Please try again.</Text>
                <TouchableOpacity style={[s.modalCancelBtn, { marginTop: 12 }]} onPress={() => setPublishModalVisible(false)}>
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

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F4' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#F8F7F4' },
  centerTitle: { fontSize: 24, fontWeight: '700', color: '#3D2C23', marginBottom: 8 },
  centerSubtitle: { fontSize: 16, color: '#7A7571', textAlign: 'center', marginBottom: 24 },
  btn: { backgroundColor: '#694528', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 },
  btnText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  
  pageTitle: { fontSize: 24, fontWeight: '700', color: '#3D2C23', marginBottom: 4, marginTop: 40 },
  pageSubtitle: { fontSize: 14, color: '#7A7571', marginBottom: 24 },
  
  label: { fontSize: 14, fontWeight: '600', color: '#3D2C23', marginBottom: 8, marginTop: 16 },
  
  uploadBox: { borderWidth: 2, borderColor: '#D3CEC4', borderStyle: 'dashed', borderRadius: 12, padding: 32, alignItems: 'center', backgroundColor: '#F8F7F4' },
  uploadIconWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#8C6C50', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  uploadText: { fontSize: 16, fontWeight: '600', color: '#694528', marginBottom: 4 },
  uploadSubtext: { fontSize: 12, color: '#7A7571' },
  
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D3CEC4', borderRadius: 8, backgroundColor: '#FFF', paddingHorizontal: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#3D2C23' },
  prefix: { fontSize: 16, color: '#3D2C23', fontWeight: '500' },
  
  categoryRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  catPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: '#D3CEC4', backgroundColor: '#FFF' },
  activeCatPill: { backgroundColor: '#694528', borderColor: '#694528' },
  catPillText: { color: '#3D2C23', fontWeight: '500', fontSize: 14 },
  activeCatPillText: { color: '#FFF' },
  
  row: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },
  
  publishBtn: { backgroundColor: '#694528', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 32 },
  publishBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '85%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#3D2C23', marginBottom: 8 },
  modalText: { fontSize: 15, color: '#7A7571', marginBottom: 24, lineHeight: 22 },
  modalBtnRow: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: '#F0EBE1', alignItems: 'center' },
  modalCancelText: { color: '#3D2C23', fontWeight: '600', fontSize: 15 },
  modalConfirmBtn: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: '#4A5D4E', alignItems: 'center' },
  modalConfirmText: { color: '#FFF', fontWeight: '600', fontSize: 15 },
});
