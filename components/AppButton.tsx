import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/appButton';
interface Props {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}
export default function AppButton({title, onPress, disabled}: Props) {
    return(
       <TouchableOpacity
       style = {[styles.button, disabled && styles.buttonDisabled]}
       onPress={onPress}
       disabled={disabled}
       >
        <Text style={styles.text}>{title}</Text>
       </TouchableOpacity>
    );
}

