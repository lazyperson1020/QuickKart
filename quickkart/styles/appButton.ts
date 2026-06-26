import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    text: {
        color: colors.text,
        fontWeight: "600",
    },
});
