import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ProfileScreen() {
  const { userId, username, isLoggedIn, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});

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
        <Text style={s.centerTitle}>Sign in Required</Text>
        <TouchableOpacity style={s.primaryBtn} onPress={() => router.push('/auth')}>
          <Text style={s.primaryBtnText}>Sign In / Register</Text>
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
        <Text style={s.role}>{profile?.role} • ID: {userId}</Text>
      </View>

      {editing ? (
        <View style={s.form}>
          <Text style={s.sectionTitle}>Edit Profile</Text>
          {['firstname', 'lastname', 'email', 'phone', 'bio', 'defaultAddress'].map((field) => (
            <View key={field} style={s.inputContainer}>
              <Text style={s.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
              <TextInput 
                style={s.input} 
                value={form[field] || ''} 
                onChangeText={(v) => setForm({ ...form, [field]: v })}
                placeholderTextColor="#A8A39D"
              />
            </View>
          ))}
          <View style={s.btnRow}>
            <TouchableOpacity style={s.saveBtn} onPress={handleUpdate}>
              <Text style={s.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} onPress={() => setEditing(false)}>
              <Text style={s.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={s.form}>
          <Text style={s.sectionTitle}>Personal Information</Text>
          {profile && ['firstname', 'lastname', 'email', 'phone', 'defaultAddress'].map((key) => (
            <View key={key} style={s.row}>
              <Text style={s.rowLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <Text style={s.rowValue}>{profile[key] || '-'}</Text>
            </View>
          ))}
          <TouchableOpacity style={s.editBtn} onPress={() => setEditing(true)}>
            <FontAwesome name="pencil" size={14} color="#694528" style={{ marginRight: 8 }} />
            <Text style={s.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={16} color="#D84C4C" style={{ marginRight: 8 }} />
        <Text style={s.logoutBtnText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerTitle: { fontSize: 18, color: '#3D2C23', marginBottom: 16 },
  header: { alignItems: 'center', padding: 32, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0DCD6' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#694528', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#FFF', fontSize: 32, fontWeight: '700' },
  username: { fontSize: 22, fontWeight: '700', color: '#3D2C23' },
  role: { fontSize: 14, color: '#7A7571', marginTop: 4 },
  
  form: { backgroundColor: '#FFF', margin: 16, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E0DCD6' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#3D2C23', marginBottom: 16 },
  
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#3D2C23', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#D3CEC4', borderRadius: 8, padding: 12, color: '#3D2C23', backgroundColor: '#FFF' },
  
  row: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0EBE1' },
  rowLabel: { width: 120, fontWeight: '600', color: '#3D2C23' },
  rowValue: { flex: 1, color: '#7A7571' },
  
  primaryBtn: { backgroundColor: '#694528', padding: 12, borderRadius: 8, alignItems: 'center' },
  primaryBtnText: { color: '#FFF', fontWeight: '600' },
  
  editBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, marginTop: 16, borderRadius: 8, borderWidth: 1, borderColor: '#694528' },
  editBtnText: { color: '#694528', fontWeight: '600' },
  
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  saveBtn: { flex: 1, backgroundColor: '#694528', padding: 14, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '600' },
  cancelBtn: { flex: 1, backgroundColor: '#F0EBE1', padding: 14, borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: '#3D2C23', fontWeight: '600' },
  
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 16, marginBottom: 32, padding: 16, borderRadius: 8, backgroundColor: '#FFEBEB' },
  logoutBtnText: { color: '#D84C4C', fontWeight: '700', fontSize: 16 },
});
