import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username and password are required');
      return;
    }
    setLoading(true);
    try {
      let res;
      if (isRegister) {
        res = await authAPI.register({ username, password, firstname, lastname, email, phone });
      } else {
        res = await authAPI.login({ username, password });
      }
      const { token, userId, username: uname, role } = res.data;
      await login(token, userId, uname, role);
      setResult(JSON.stringify(res.data, null, 2));
      Alert.alert('Success', `${isRegister ? 'Registered' : 'Logged in'} as ${uname}`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      setResult(`Error: ${msg}`);
      Alert.alert('Error', msg);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.toggle}>
        <TouchableOpacity style={[s.tab, !isRegister && s.activeTab]} onPress={() => setIsRegister(false)}>
          <Text style={[s.tabText, !isRegister && s.activeTabText]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, isRegister && s.activeTab]} onPress={() => setIsRegister(true)}>
          <Text style={[s.tabText, isRegister && s.activeTabText]}>Register</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.label}>Username *</Text>
      <TextInput style={s.input} value={username} onChangeText={setUsername} placeholder="username" autoCapitalize="none" />

      <Text style={s.label}>Password *</Text>
      <TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="password" secureTextEntry />

      {isRegister && (
        <>
          <Text style={s.label}>First Name</Text>
          <TextInput style={s.input} value={firstname} onChangeText={setFirstname} placeholder="firstname" />
          <Text style={s.label}>Last Name</Text>
          <TextInput style={s.input} value={lastname} onChangeText={setLastname} placeholder="lastname" />
          <Text style={s.label}>Email</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="email" keyboardType="email-address" autoCapitalize="none" />
          <Text style={s.label}>Phone</Text>
          <TextInput style={s.input} value={phone} onChangeText={setPhone} placeholder="phone" keyboardType="phone-pad" />
        </>
      )}

      <TouchableOpacity style={s.btn} onPress={handleSubmit} disabled={loading}>
        <Text style={s.btnText}>{loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}</Text>
      </TouchableOpacity>

      {result ? (
        <View style={s.resultBox}>
          <Text style={s.resultTitle}>API Response:</Text>
          <Text style={s.resultText}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  toggle: { flexDirection: 'row', marginBottom: 20, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#007AFF' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#fff' },
  activeTab: { backgroundColor: '#007AFF' },
  tabText: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  activeTabText: { color: '#fff' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  btn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultBox: { marginTop: 20, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 },
  resultTitle: { fontWeight: '700', marginBottom: 8 },
  resultText: { fontFamily: 'SpaceMono', fontSize: 12 },
});
