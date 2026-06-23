import React, { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView, Platform, Text, TextInput,
  TouchableOpacity, View, Image, Animated, StyleSheet, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '@/firebase';
import { validateSignUp } from '@/utils/validators';

const PURPLE = '#35035C';
const SALMON = '#E05832';
const BG = '#FFFFFF';

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

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName]                     = useState('');
  const [contact, setContact]               = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState<any>({});
  const [formError, setFormError]           = useState('');

  const handleSignUp = async () => {
    const validationError = validateSignUp(name, contact, email, password, confirmPassword);
    setError(validationError || {});
    if (Object.keys(validationError || {}).length > 0) {
      setFormError('Please fix the highlighted fields.');
      return;
    }
    setFormError('');
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', user.uid), { name, contact, email, createdAt: new Date() });
      router.replace('/');
    } catch (e: any) {
      setFormError(e.message || 'Failed to create an account. Please try again.');
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
          source={require('../../assets/quickkart-icon-v2.png')}
          style={s.logo}
          resizeMode="contain"
        />

        <Text style={s.heading}>Create an Account</Text>
        <Text style={s.subheading}>Join QuickKart and start shopping</Text>

        <View style={s.form}>
          <FloatingLabelInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            error={error.name}
            autoCapitalize="words"
          />
          <FloatingLabelInput
            label="Phone Number"
            value={contact}
            onChangeText={setContact}
            error={error.contact}
            keyboardType="phone-pad"
          />
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
          <FloatingLabelInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={error.confirmPassword}
            isPassword
          />
        </View>

        {formError ? <Text style={s.formError}>{formError}</Text> : null}

        <TouchableOpacity
          style={[s.btn, loading && { opacity: 0.7 }]}
          onPress={handleSignUp}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>{loading ? 'Creating account...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <View style={s.footer}>
          <Text style={s.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
            <Text style={s.footerLink}> Log In</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: BG,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 24,
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
    marginBottom: 32,
  },
  form: {
    marginBottom: 8,
  },
  fieldWrap: {
    marginBottom: 22,
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
