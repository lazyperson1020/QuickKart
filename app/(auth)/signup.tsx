import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import { auth, db } from '@/firebase';
import { validateSignUp } from '@/utils/validators';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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
            await setDoc(doc(db, "users", user.uid), { name, contact, email, createdAt: new Date() });
            router.replace("/");
        }catch{
        console.log("Creating user...");
        const { user } = await createUserWithEmailAndPassword(auth,email,password);
        console.log("User UID:", user.uid);
        await setDoc(doc(db, "users", user.uid),{name,contact,email,createdAt: new Date(),});
        console.log("Firestore write successful");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create an Account</Text>
            <AppInput label="Name" value={name} onChangeText={setName} error={error.name} />
            <AppInput label="Contact" value={contact} onChangeText={setContact} error={error.contact} />
            <AppInput label="Email" value={email} onChangeText={setEmail} error={error.email} />
            <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry error={error.password} />
            <AppInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry error={error.confirmPassword} />
            {formError ? <Text style={styles.formError}>{formError}</Text> : null}
            <AppButton title={loading ? "Creating account..." : "Sign Up"} onPress={handleSignUp} disabled={loading} />
            <View style={styles.loginLinkContainer}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login" as any)}>
                    <Text style={styles.loginLinkText}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

