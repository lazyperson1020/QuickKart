import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    logo: {
        width: 150,          
        height: 150,         
        marginBottom: 24,    
        borderRadius: 75,    
        alignSelf:'center',
        
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        marginBottom: 32,
    },
    form: {
        marginBottom: 24,
    },
    formError: {
        color: colors.error,
        marginBottom: 12,
        textAlign: "center",
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    signupText: {
        fontSize: 14,
        color: colors.text,
    },
    signupLink: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: "600",
    },
});
