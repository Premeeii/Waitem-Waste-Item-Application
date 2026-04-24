import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { categoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CategoriesScreen() {
  const { isLoggedIn } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'FOOD_WASTE' | 'SECOND_HAND'>('FOOD_WASTE');

  useFocusEffect(useCallback(() => {
    if (isLoggedIn) loadCategories();
  }, [isLoggedIn]));

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.content || []);
    } catch (e: any) {
      console.log('Error:', e.response?.data || e.message);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Name is required'); return; }
    try {
      await categoryAPI.create({ name, type });
      Alert.alert('Success', 'Category created');
      setName('');
      loadCategories();
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete', 'Delete this category?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await categoryAPI.delete(id);
          loadCategories();
        } catch (e: any) {
          Alert.alert('Error', e.response?.data?.message || e.message);
        }
      }},
    ]);
  };

  if (!isLoggedIn) return <View style={s.center}><Text>Please login first</Text></View>;

  return (
    <View style={s.container}>
      <View style={s.form}>
        <Text style={s.formTitle}>Create Category</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Category name" />
        <View style={s.typeRow}>
          <TouchableOpacity style={[s.typeBtn, type === 'FOOD_WASTE' && s.typeBtnActive]}
            onPress={() => setType('FOOD_WASTE')}>
            <Text style={[s.typeBtnText, type === 'FOOD_WASTE' && { color: '#fff' }]}>🍔 FOOD_WASTE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.typeBtn, type === 'SECOND_HAND' && s.typeBtnActive]}
            onPress={() => setType('SECOND_HAND')}>
            <Text style={[s.typeBtnText, type === 'SECOND_HAND' && { color: '#fff' }]}>📦 SECOND_HAND</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.createBtn} onPress={handleCreate}>
          <Text style={s.createBtnText}>Create</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadCategories} />}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{item.name}</Text>
              <Text style={s.cardSub}>Type: {item.type} | ID: {item.id}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={{ color: '#FF3B30', fontWeight: '700' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={s.empty}>No categories</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { backgroundColor: '#fff', margin: 12, padding: 14, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  formTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#f9f9f9' },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  typeBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#007AFF', alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#007AFF' },
  typeBtnText: { fontWeight: '600', color: '#007AFF' },
  createBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  createBtnText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', margin: 4, marginHorizontal: 12, padding: 14, borderRadius: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardSub: { fontSize: 13, color: '#666', marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' },
});
