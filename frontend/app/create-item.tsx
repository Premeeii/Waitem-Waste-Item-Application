import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { itemAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CreateItemScreen() {
  const { userId } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [condition, setCondition] = useState('');
  const [addressText, setAddressText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !categoryId) {
      Alert.alert('Error', 'Title and Category ID are required');
      return;
    }
    setLoading(true);
    try {
      const data: any = {
        sellerId: userId,
        categoryId: parseInt(categoryId),
        title,
        description: description || undefined,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : undefined,
        imageUrl: imageUrl || undefined,
        quantity: quantity ? parseInt(quantity) : 1,
        condition: condition || undefined,
        addressText: addressText || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
      };
      const res = await itemAPI.create(data);
      setResult(JSON.stringify(res.data, null, 2));
      Alert.alert('Success', 'Item created!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      const msg = e.response?.data?.message || JSON.stringify(e.response?.data) || e.message;
      setResult(`Error: ${msg}`);
      Alert.alert('Error', msg);
    }
    setLoading(false);
  };

  const fields = [
    { label: 'Title *', value: title, setter: setTitle, placeholder: 'Item title' },
    { label: 'Category ID *', value: categoryId, setter: setCategoryId, placeholder: 'e.g. 1', keyboard: 'numeric' as const },
    { label: 'Description', value: description, setter: setDescription, placeholder: 'Description', multiline: true },
    { label: 'Original Price', value: originalPrice, setter: setOriginalPrice, placeholder: '0.00', keyboard: 'numeric' as const },
    { label: 'Discounted Price', value: discountedPrice, setter: setDiscountedPrice, placeholder: '0.00', keyboard: 'numeric' as const },
    { label: 'Image URL', value: imageUrl, setter: setImageUrl, placeholder: 'https://...' },
    { label: 'Quantity', value: quantity, setter: setQuantity, placeholder: '1', keyboard: 'numeric' as const },
    { label: 'Condition', value: condition, setter: setCondition, placeholder: 'e.g. Good, Like New' },
    { label: 'Address', value: addressText, setter: setAddressText, placeholder: 'Pickup address' },
    { label: 'Latitude', value: latitude, setter: setLatitude, placeholder: 'e.g. 13.7563', keyboard: 'numeric' as const },
    { label: 'Longitude', value: longitude, setter: setLongitude, placeholder: 'e.g. 100.5018', keyboard: 'numeric' as const },
  ];

  return (
    <ScrollView style={s.container}>
      {fields.map((f) => (
        <View key={f.label}>
          <Text style={s.label}>{f.label}</Text>
          <TextInput style={[s.input, f.multiline && { height: 80 }]} value={f.value} onChangeText={f.setter}
            placeholder={f.placeholder} keyboardType={f.keyboard || 'default'} multiline={f.multiline} />
        </View>
      ))}

      <TouchableOpacity style={s.btn} onPress={handleCreate} disabled={loading}>
        <Text style={s.btnText}>{loading ? 'Creating...' : 'Create Item'}</Text>
      </TouchableOpacity>

      {result ? (
        <View style={s.resultBox}>
          <Text style={{ fontWeight: '700', marginBottom: 4 }}>API Response:</Text>
          <Text style={{ fontSize: 11 }}>{result}</Text>
        </View>
      ) : null}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 10, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginTop: 4, backgroundColor: '#f9f9f9' },
  btn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  resultBox: { marginTop: 16, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 },
});
