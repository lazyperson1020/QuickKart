import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: {
        marginBottom: 6,
        fontWeight: "500",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#110808",
        borderRadius: 8,
        backgroundColor: "transparent",
        height: 48,
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        fontSize: 16,
        height: "100%",
    },
    iconContainer: {
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
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