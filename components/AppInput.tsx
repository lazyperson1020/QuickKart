import { Text, TextInput, View } from 'react-native';
import { styles } from '../styles/appInput';

interface Props{
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    error?: string;
}

export default function AppInput({label, value, onChangeText, secureTextEntry, error}: Props) {
    return (
        <View style = {styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                style={[styles.input, error && styles.errorBorder]}
                placeholder={label}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

