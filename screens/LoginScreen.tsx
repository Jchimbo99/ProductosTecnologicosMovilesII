import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity, Switch } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/Config';
import { useThemeStore } from '../stores/themeStore';

export default function LoginScreen({ navigation }: any) {
    const [correo, setcorreo] = useState("")
    const [contraseña, setcontrasenia] = useState("")

    const theme = useThemeStore(state => state.theme);
    const toggleTheme = useThemeStore(state => state.toggleTheme);

    const styles = getStyles(theme);

    function login() {
        signInWithEmailAndPassword(auth, correo, contraseña)
            .then((userCredential) => {
                const user = userCredential.user;
                navigation.navigate("Tareas")
            })
            .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;

                if (errorCode === "auth/invalid-credential") {
                    errorCode = "Credenciales inválidas";
                    errorMessage = "Verifica tu correo y contraseña.";
                } else if (errorCode === "auth/missing-password") {
                    errorCode = "Contraseña requerida";
                    errorMessage = "Por favor ingresa tu contraseña.";
                } else {
                    errorCode = "Error de autenticación";
                    errorMessage = "Verifica tus credenciales e intenta nuevamente.";
                }

                Alert.alert(errorCode, errorMessage);
                console.log(errorCode, errorMessage);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            {/* Switch tema arriba */}
            <View style={styles.themeSwitcher}>
                <Text style={styles.themeText}>{theme === 'light' ? '🌞 Claro' : '🌙 Oscuro'}</Text>
                <Switch
                    value={theme === 'dark'}
                    onValueChange={toggleTheme}
                    thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </View>

            <TextInput
                placeholder="Correo electrónico"
                onChangeText={setcorreo}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme === 'light' ? '#666' : '#aaa'}
            />

            <TextInput
                placeholder="Contraseña"
                onChangeText={setcontrasenia}
                style={styles.input}
                secureTextEntry
                placeholderTextColor={theme === 'light' ? '#666' : '#aaa'}
            />

            <View style={styles.buttonContainer}>
                <Button title="Entrar" onPress={login} color="#3f51b5" />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Restablecer")}>
                <Text style={styles.forgotText}>¿Olvidaste la contraseña?</Text>
            </TouchableOpacity>
        </View>
    )
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === 'light' ? '#e9f0ff' : '#121212',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    themeSwitcher: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    themeText: {
        fontSize: 16,
        color: theme === 'light' ? '#222' : '#eee',
        marginRight: 8,
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 30,
        color: theme === 'light' ? '#333' : '#eee',
    },
    input: {
        backgroundColor: theme === 'light' ? '#fff' : '#222',
        fontSize: 18,
        width: '100%',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme === 'light' ? '#ccc' : '#555',
        color: theme === 'light' ? '#000' : '#fff',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 10,
        marginBottom: 15,
    },
    forgotText: {
        color: '#3f51b5',
        textDecorationLine: 'underline',
        fontSize: 16,
    },
});
