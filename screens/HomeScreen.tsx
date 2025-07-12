import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Switch,
} from "react-native";
import React from "react";
import { useThemeStore } from "../stores/themeStore";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: any) {
    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    const styles = getStyles(theme);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header con fondo azul y logo de tareas */}
            <View style={styles.header}>
                <Text style={styles.logoText}>TaskMaster ✅</Text>
            </View>

            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>
                Elige una opción para comenzar a gestionar tus tareas.
            </Text>

            {/* Switch para cambiar tema */}
            <View style={styles.themeSwitcher}>
                <Text style={styles.themeText}>
                    {theme === 'light' ? '🌞 Modo Claro' : '🌙 Modo Oscuro'}
                </Text>
                <Switch
                    value={theme === 'dark'}
                    onValueChange={toggleTheme}
                    thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.registerButton]}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("Registro")}
                >
                    <Text style={styles.buttonIcon}>📝</Text>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.loginButton]}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.buttonIcon}>🔑</Text>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footer}>© 2025 TaskMaster. Todos los derechos reservados.</Text>
        </ScrollView>
    );
}

const getStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === "light" ? "#f0f4ff" : "#121212",
        },
        header: {
            width: "100%",
            height: 160,
            backgroundColor: theme === "light" ? "#3f51b5" : "#1e40af",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            shadowColor: theme === "light" ? "#3f51b5" : "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: theme === "light" ? 0.5 : 0.9,
            shadowRadius: 10,
            elevation: 8,
        },
        logoText: {
            color: "white",
            fontSize: 38,
            fontWeight: "900",
            letterSpacing: 3,
            fontFamily: "System",
        },
        title: {
            fontSize: 30,
            fontWeight: "800",
            color: theme === "light" ? "#222" : "#eee",
            marginBottom: 6,
            textAlign: "center",
        },
        subtitle: {
            fontSize: 16,
            color: theme === "light" ? "#555" : "#ccc",
            marginBottom: 40,
            textAlign: "center",
            paddingHorizontal: 24,
            lineHeight: 22,
        },
        themeSwitcher: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 30,
        },
        themeText: {
            fontSize: 18,
            color: theme === 'light' ? '#222' : '#eee',
            marginRight: 10,
        },
        buttonsContainer: {
            width: "90%",
            maxWidth: 400,
        },
        button: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme === "light" ? "white" : "#222",
            paddingVertical: 18,
            paddingHorizontal: 25,
            borderRadius: 20,
            marginBottom: 25,
            shadowColor: theme === "light" ? "#000" : "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: theme === "light" ? 0.15 : 0.7,
            shadowRadius: 10,
            elevation: 5,
        },
        buttonIcon: {
            fontSize: 36,
            marginRight: 20,
            color: theme === "light" ? "#222" : "#eee",
        },
        buttonText: {
            fontSize: 22,
            fontWeight: "700",
            color: theme === "light" ? "#222" : "#eee",
        },
        registerButton: {
            borderLeftWidth: 8,
            borderLeftColor: "#4CAF50", 
        },
        loginButton: {
            borderLeftWidth: 8,
            borderLeftColor: "#2196F3", 
        },
        footer: {
            marginTop: 40,
            color: theme === "light" ? "#aaa" : "#666",
            fontSize: 14,
            textAlign: "center",
        },
    });
