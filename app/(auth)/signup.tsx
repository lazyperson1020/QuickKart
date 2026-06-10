import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import { auth, db } from '@/firebase';
import { validateSignUp } from '@/utils/validators';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '@/styles/signup';

export default function SignupScreen() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>({});
    const [formError, setFormError] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = async () => {
        const validationError = validateSignUp(name, contact, email, password, confirmPassword);
        setError(validationError || {});
        if (Object.keys(validationError || {}).length > 0) {
            setFormError("Please fix the highlighted fields.");
            return;
        }
        
        setFormError("");
        setLoading(true);
        
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User UID Created:", user.uid);
            
            await setDoc(doc(db, "users", user.uid), { 
                name, 
                contact, 
                email, 
                createdAt: new Date() 
            });
            console.log("Firestore account write successful");
            
            router.replace("/");
        } catch (e: any) {
            console.error("Signup exception failed:", e);
            setFormError(e.message || "Failed to create an account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Create an Account</Text>
                
                <AppInput label="Name" value={name} onChangeText={setName} error={error.name} />
                <AppInput label="Contact" value={contact} onChangeText={setContact} error={error.contact} />
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

                <AppInput 
                    label="Confirm Password" 
                    value={confirmPassword} 
                    onChangeText={setConfirmPassword} 
                    error={error.confirmPassword}
                    isPassword={true}
                    showPassword={showConfirmPassword}
                    onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                {formError ? <Text style={styles.formError}>{formError}</Text> : null}
                
                <AppButton title={loading ? "Creating account..." : "Sign Up"} onPress={handleSignUp} disabled={loading} />
                
                <View style={styles.loginLinkContainer}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/(auth)/login" as any)}>
                        <Text style={styles.loginLinkText}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}