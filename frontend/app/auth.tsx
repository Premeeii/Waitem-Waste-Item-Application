import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function AuthScreen() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!username || !password) {
      setErrorMsg('Username and password are required');
      return;
    }
    
    if (isRegister && !email) {
      setErrorMsg('Email is required for registration');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isRegister) {
        res = await authAPI.register({ username, password, email, firstname: '', lastname: '', phone: '' });
      } else {
        res = await authAPI.login({ username, password });
      }
      const { token, userId, username: uname, role } = res.data;
      await login(token, userId, uname, role);
      router.push('/');
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      setErrorMsg(msg);
    }
    setLoading(false);
  };

  const handleMockSocialLogin = (provider: string) => {
    Alert.alert('Mock Feature', `Sign in with ${provider} is not implemented yet.`);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.header}>
        <FontAwesome name="leaf" size={40} color="#61412A" />
        <Text style={s.logoText}>TerraMarket</Text>
      </View>

      <Text style={s.title}>{isRegister ? 'Create an account' : 'Welcome back'}</Text>
      <Text style={s.subtitle}>
        {isRegister ? 'Join our sustainable community' : 'Sign in to your account to continue'}
      </Text>

      <TouchableOpacity style={s.socialBtn} onPress={() => handleMockSocialLogin('Google')}>
        <FontAwesome name="google" size={20} color="#333" style={s.socialIcon} />
        <Text style={s.socialBtnText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.socialBtn} onPress={() => handleMockSocialLogin('Apple')}>
        <FontAwesome name="apple" size={20} color="#333" style={s.socialIcon} />
        <Text style={s.socialBtnText}>Continue with Apple</Text>
      </TouchableOpacity>

      <View style={s.dividerRow}>
        <View style={s.dividerLine} />
        <Text style={s.dividerText}>OR SIGN IN WITH USERNAME</Text>
        <View style={s.dividerLine} />
      </View>

      {errorMsg ? <Text style={s.errorText}>{errorMsg}</Text> : null}

      <View style={s.inputContainer}>
        <Text style={s.label}>Username</Text>
        <View style={s.inputWrapper}>
          <FontAwesome name="user-o" size={16} color="#7A7571" style={s.inputIcon} />
          <TextInput style={s.input} value={username} onChangeText={setUsername} placeholder="username" autoCapitalize="none" placeholderTextColor="#A8A39D" />
        </View>
      </View>

      {isRegister && (
        <View style={s.inputContainer}>
          <Text style={s.label}>Email address</Text>
          <View style={s.inputWrapper}>
            <FontAwesome name="envelope-o" size={16} color="#7A7571" style={s.inputIcon} />
            <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="email" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#A8A39D" />
          </View>
        </View>
      )}

      <View style={s.inputContainer}>
        <View style={s.passwordHeader}>
          <Text style={s.label}>Password</Text>
          {!isRegister && <Text style={s.forgotPassword}>Forgot password?</Text>}
        </View>
        <View style={s.inputWrapper}>
          <FontAwesome name="lock" size={18} color="#7A7571" style={s.inputIcon} />
          <TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry placeholderTextColor="#A8A39D" />
          <FontAwesome name="eye-slash" size={18} color="#7A7571" style={s.inputIconRight} />
        </View>
      </View>

      <TouchableOpacity style={s.btn} onPress={handleSubmit} disabled={loading}>
        <Text style={s.btnText}>{loading ? 'Loading...' : isRegister ? 'Sign Up' : 'Sign In'}</Text>
      </TouchableOpacity>

      <View style={s.footer}>
        <Text style={s.footerText}>
          {isRegister ? 'Already have an account? ' : 'New to TerraMarket? '}
        </Text>
        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
          <Text style={s.footerLink}>{isRegister ? 'Sign In' : 'Create an account'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8F7F4' },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  logoText: { fontSize: 20, fontWeight: '600', color: '#3D2C23', marginTop: 8 },
  title: { fontSize: 28, fontWeight: '700', color: '#3D2C23', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#7A7571', textAlign: 'center', marginBottom: 32 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderWidth: 1, borderColor: '#E0DCD6', borderRadius: 8, backgroundColor: '#FFF', marginBottom: 12 },
  socialIcon: { marginRight: 10 },
  socialBtnText: { fontSize: 16, color: '#3D2C23', fontWeight: '500' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0DCD6' },
  dividerText: { marginHorizontal: 12, fontSize: 12, color: '#7A7571', fontWeight: '500', letterSpacing: 0.5 },
  errorText: { color: '#D84C4C', fontSize: 14, fontWeight: '500', marginBottom: 16, textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#3D2C23', marginBottom: 8 },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgotPassword: { fontSize: 13, color: '#694528', fontWeight: '500' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E0DCD6', borderRadius: 8, backgroundColor: '#FFF', paddingHorizontal: 12 },
  inputIcon: { marginRight: 10 },
  inputIconRight: { marginLeft: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#3D2C23' },
  btn: { backgroundColor: '#694528', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { fontSize: 14, color: '#7A7571' },
  footerLink: { fontSize: 14, color: '#694528', fontWeight: '600' },
});
