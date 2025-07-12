import {
    StyleSheet, Text, View, TextInput, Button, Switch
} from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/Config';
import { ref, set } from 'firebase/database';
import { useThemeStore } from '../stores/themeStore';

export default function RegistroScreen({ navigation }: any) {
    const theme = useThemeStore(state => state.theme);
    const toggleTheme = useThemeStore(state => state.toggleTheme);

    const [correo, setcorreo] = useState('');
    const [contraseña, setcontrasenia] = useState('');
    const [nombre, setnombre] = useState('');
    const [edad, setedad] = useState('');

    function registro() {
        createUserWithEmailAndPassword(auth, correo, contraseña)
            .then((userCredential) => {
                const user = userCredential.user;
                guardar(user.uid);
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.log(error.code);
            });
    }

    function guardar(uid: string) {
        set(ref(db, 'usuarios/' + uid), {
            nombre,
            correo,
            edad,
        });
    }

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>

            <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>{theme === 'light' ? '🌞 Claro' : '🌙 Oscuro'}</Text>
                <Switch
                    value={theme === 'dark'}
                    onValueChange={toggleTheme}
                    thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                />
            </View>

            <Text style={styles.title}>Registro de Usuario</Text>

            <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor={theme === 'light' ? '#999' : '#ccc'}
                onChangeText={setcorreo}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Contraseña"
                placeholderTextColor={theme === 'light' ? '#999' : '#ccc'}
                onChangeText={setcontrasenia}
                style={styles.input}
                secureTextEntry
            />

            <TextInput
                placeholder="Nombre completo"
                placeholderTextColor={theme === 'light' ? '#999' : '#ccc'}
                onChangeText={setnombre}
                style={styles.input}
            />

            <TextInput
                placeholder="Edad"
                placeholderTextColor={theme === 'light' ? '#999' : '#ccc'}
                onChangeText={setedad}
                style={styles.input}
                keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
                <Button
                    title="Registrarse"
                    onPress={registro}
                    color={theme === 'light' ? '#3f51b5' : '#90caf9'}
                />
            </View>
        </View>
    );
}

const getStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === 'light' ? '#e9f0ff' : '#121212',
            padding: 20,
            justifyContent: 'center',
        },
        switchRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 20,
        },
        switchLabel: {
            marginRight: 10,
            fontSize: 16,
            color: theme === 'light' ? '#333' : '#eee',
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            marginBottom: 30,
            color: theme === 'light' ? '#333' : '#eee',
            textAlign: 'center',
        },
        input: {
            backgroundColor: theme === 'light' ? '#fff' : '#222',
            fontSize: 18,
            width: '100%',
            padding: 12,
            borderRadius: 10,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: theme === 'light' ? '#ccc' : '#444',
            color: theme === 'light' ? '#000' : '#fff',
        },
        buttonContainer: {
            width: '100%',
            marginTop: 10,
        },
    });
