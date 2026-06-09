import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: {
        marginBottom: 6,
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderColor: "#110808",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    errorBorder: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        marginTop: 4,
        fontSize: 12,
    },
});
