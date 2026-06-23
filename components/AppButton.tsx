import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/appButton';
import { useSinglePress } from '../hooks/useSinglePress';
interface Props {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}
export default function AppButton({title, onPress, disabled}: Props) {
    const handlePress = useSinglePress(onPress);
    return(
       <TouchableOpacity
       style = {[styles.button, disabled && styles.buttonDisabled]}
       onPress={handlePress}
       disabled={disabled}
       >
        <Text style={styles.text}>{title}</Text>
       </TouchableOpacity>
    );
}

