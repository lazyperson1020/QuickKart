import React, { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView, Platform, Text, TextInput,
  TouchableOpacity, View, Image, Animated, StyleSheet, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth } from '../../../firebase.native';
import { validateLogin } from '../../utils/validators';

const PURPLE = '#35035C';
const SALMON = '#E05832';
const BG = '#FFFFFF';

// Floating label input — label rides up to sit on the border when focused/filled
function FloatingLabelInput({
  label, value, onChangeText, error, isPassword, ...props
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  error?: string; isPassword?: boolean; [key: string]: any;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [17, -10] });
  const fontSize   = anim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const labelBg    = anim.interpolate({ inputRange: [0, 1], outputRange: ['transparent', BG] });

  const borderColor = error ? '#DC2626' : isFocused ? PURPLE : '#E0E0E0';
  const labelColor  = error ? '#DC2626' : isFocused ? PURPLE : '#999';

  return (
    <View style={s.fieldWrap}>
      {/* Floating label */}
      <Animated.Text
        pointerEvents="none"
        style={[s.floatLabel, {
          transform: [{ translateY }],
          fontSize,
          backgroundColor: labelBg,
          color: labelColor,
          paddingHorizontal: isFocused || value ? 4 : 0,
        }]}
      >
        {label}
      </Animated.Text>

      <View style={[s.inputRow, { borderColor }]}>
        <TextInput
          {...props}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showSecret}
          style={s.textInput}
          placeholderTextColor="transparent"
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowSecret(v => !v)} hitSlop={10} style={s.eyeBtn}>
            <Ionicons name={showSecret ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={s.fieldError}>{error}</Text> : null}
    </View>
  );
}

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<any>({});
  const [formError, setFormError] = useState('');

  const handleLogin = async () => {
    const validationError = validateLogin(email, password);
    setError(validationError || {});
    if (Object.keys(validationError || {}).length > 0) {
      setFormError('Please fix the highlighted fields.');
      return;
    }
    setFormError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e: any) {
      setFormError(e.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: BG }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={require('../../../assets/quickkart-icon-v2.png')}
          style={s.logo}
          resizeMode="contain"
        />

        {/* Heading */}
        <Text style={s.heading}>Welcome to QuickKart</Text>
        <Text style={s.subheading}>Please login to your account</Text>

        {/* Form */}
        <View style={s.form}>
          <FloatingLabelInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={error.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FloatingLabelInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={error.password}
            isPassword
          />
        </View>

        {formError ? <Text style={s.formError}>{formError}</Text> : null}

        {/* Login button */}
        <TouchableOpacity
          style={[s.btn, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        {/* Sign Up link */}
        <View style={s.footer}>
          <Text style={s.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={s.footerLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: BG,
    justifyContent: 'center',
  },
  logo: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginBottom: 32,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: '#888',
    marginBottom: 36,
  },
  form: {
    marginBottom: 8,
  },
  fieldWrap: {
    marginBottom: 24,
    position: 'relative',
  },
  floatLabel: {
    position: 'absolute',
    left: 14,
    zIndex: 10,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: BG,
    paddingHorizontal: 14,
    height: 56,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    paddingTop: 10,
  },
  eyeBtn: {
    paddingLeft: 8,
  },
  fieldError: {
    color: '#DC2626',
    fontSize: 11,
    marginTop: 5,
    marginLeft: 2,
  },
  formError: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  btn: {
    backgroundColor: SALMON,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: SALMON,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    fontSize: 14,
    color: SALMON,
    fontWeight: '700',
  },
});
