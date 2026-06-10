import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import { auth } from '@/firebase';
import { validateLogin } from '@/utils/validators';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View, Image } from 'react-native';
import { styles } from '@/styles/login';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>({});
    const [formError, setFormError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleLogin = async () => {
        const validationError = validateLogin(email, password);
        setError(validationError || {});
        if (Object.keys(validationError || {}).length > 0) {
            setFormError("Please fix the highlighted fields.");
            return;
        }
        setFormError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/");
        } catch (e: any) {
            setFormError(e.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.container}>
                <Image source={require('../../assets/quickkart-icon-v2.png')} style={styles.logo} resizeMode="contain"/>
                <Text style={styles.title}>Welcome to QuickKart</Text>
                <Text style={styles.subtitle}>Please login to your account</Text>
                <View style={styles.form}>
                    <AppInput label="Email" value={email} onChangeText={setEmail} error={error.email} />
                    <AppInput 
                        label="Password" 
                        value={password} 
                        onChangeText={setPassword} 
                        error={error.password}
                        isPassword={true}
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                </View>
                {formError ? <Text style={styles.formError}>{formError}</Text> : null}
                <AppButton title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => router.push("/(auth)/signup" as any)}>
                        <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}