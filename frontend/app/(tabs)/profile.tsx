import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { userId, username, isLoggedIn, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [result, setResult] = useState('');

  useFocusEffect(useCallback(() => {
    if (isLoggedIn && userId) loadProfile();
  }, [isLoggedIn, userId]));

  const loadProfile = async () => {
    try {
      const res = await userAPI.getById(userId!);
      setProfile(res.data);
      setForm(res.data);
    } catch (e: any) {
      console.log('Error:', e.response?.data || e.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await userAPI.update(userId!, {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
        profileImageUrl: form.profileImageUrl,
        defaultAddress: form.defaultAddress,
      });
      setProfile(res.data);
      setResult(JSON.stringify(res.data, null, 2));
      setEditing(false);
      Alert.alert('Success', 'Profile updated');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/auth');
  };

  if (!isLoggedIn) {
    return (
      <View style={s.center}>
        <Text style={{ marginBottom: 20 }}>Please login first</Text>
        <TouchableOpacity style={s.btn} onPress={() => router.push('/auth')}>
          <Text style={s.btnText}>Login / Register</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{username?.[0]?.toUpperCase()}</Text>
        </View>
        <Text style={s.username}>{username}</Text>
        <Text style={s.role}>{profile?.role} | ID: {userId}</Text>
      </View>

      {editing ? (
        <View style={s.form}>
          {['firstname', 'lastname', 'email', 'phone', 'bio', 'profileImageUrl', 'defaultAddress'].map((field) => (
            <View key={field}>
              <Text style={s.label}>{field}</Text>
              <TextInput style={s.input} value={form[field] || ''} onChangeText={(v) => setForm({ ...form, [field]: v })}
                placeholder={field} />
            </View>
          ))}
          <View style={s.btnRow}>
            <TouchableOpacity style={s.btn} onPress={handleUpdate}>
              <Text style={s.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btn, { backgroundColor: '#999' }]} onPress={() => setEditing(false)}>
              <Text style={s.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={s.form}>
          {profile && Object.entries(profile).map(([key, val]) => (
            <View key={key} style={s.row}>
              <Text style={s.rowLabel}>{key}:</Text>
              <Text style={s.rowValue}>{val != null ? String(val) : '-'}</Text>
            </View>
          ))}
          <TouchableOpacity style={[s.btn, { marginTop: 16 }]} onPress={() => setEditing(true)}>
            <Text style={s.btnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={[s.btn, { backgroundColor: '#FF3B30', margin: 16 }]} onPress={handleLogout}>
        <Text style={s.btnText}>Logout</Text>
      </TouchableOpacity>

      {result ? (
        <View style={s.resultBox}>
          <Text style={{ fontWeight: '700', marginBottom: 4 }}>API Response:</Text>
          <Text style={{ fontSize: 11 }}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  username: { fontSize: 20, fontWeight: '700' },
  role: { fontSize: 13, color: '#666', marginTop: 2 },
  form: { backgroundColor: '#fff', margin: 12, padding: 14, borderRadius: 10 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginTop: 4, backgroundColor: '#f9f9f9' },
  row: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  rowLabel: { width: 130, fontWeight: '600', color: '#333' },
  rowValue: { flex: 1, color: '#666' },
  btn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  resultBox: { margin: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8 },
});
