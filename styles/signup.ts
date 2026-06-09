import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 24,
        textAlign: "center",
    },
    formError: {
        color: colors.error,
        marginBottom: 12,
        textAlign: "center",
    },
    loginLinkContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
    },
    loginLinkText: {
        color: colors.primary,
        fontWeight: "500",
        textDecorationLine: "underline",
    },
});
