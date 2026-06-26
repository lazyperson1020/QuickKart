import { Text, TextInput, View, TouchableOpacity } from 'react-native'; // Imported TouchableOpacity
import { styles } from '../styles/appInput';

interface Props {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    error?: string;
    isPassword?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
}

export default function AppInput({
    label, 
    value, 
    onChangeText, 
    secureTextEntry, 
    error,
    isPassword,         
    showPassword,
    onTogglePassword
}: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrapper, error && styles.errorBorder]}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isPassword ? !showPassword : secureTextEntry}
                    style={styles.input}
                    placeholder={label}
                    autoCapitalize="none"
                />
                {isPassword && onTogglePassword && (
                    <TouchableOpacity onPress={onTogglePassword} activeOpacity={0.6} style={styles.iconContainer}>
                        <Text style={{ fontSize: 18 }}>{showPassword ? "🔒" : "👁️"}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}