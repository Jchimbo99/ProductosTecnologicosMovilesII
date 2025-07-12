import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/Config';
import { onValue, ref } from 'firebase/database';
import { useThemeStore } from '../stores/themeStore';

export default function TareasScreen({ navigation }: any) {
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);

  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        leer(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  function leer(uid: string) {
    const userRef = ref(db, 'usuarios/' + uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setNombre(data?.nombre || '');
      setEdad(data?.edad || 0);
    });
  }

  function logout() {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => {
          signOut(auth)
            .then(() => navigation.navigate('Home'))
            .catch(console.log);
        },
      },
    ]);
  }

  const styles = getStyles(theme);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Switch tema arriba derecha */}
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>{theme === 'light' ? '🌞 Claro' : '🌙 Oscuro'}</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      <Text style={styles.header}>👋 Bienvenido, {nombre}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>📛 Nombre: <Text style={styles.infoValue}>{nombre}</Text></Text>
        <Text style={styles.infoText}>🎂 Edad: <Text style={styles.infoValue}>{edad}</Text></Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ListaTareas')}
        >
          <Text style={styles.buttonText}>📋 Ver Lista de Tareas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('CrearTarea')}
        >
          <Text style={styles.buttonText}>➕ Crear Nueva Tarea</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'light' ? '#eaf0ff' : '#121212',
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: 10,
      paddingRight: 10,
    },
    switchLabel: {
      marginRight: 8,
      fontSize: 16,
      color: theme === 'light' ? '#333' : '#eee',
    },
    header: {
      fontSize: 26,
      fontWeight: '800',
      color: theme === 'light' ? '#3f51b5' : '#90caf9',
      textAlign: 'center',
      marginBottom: 20,
    },
    infoBox: {
      backgroundColor: theme === 'light' ? '#fff' : '#222',
      padding: 20,
      borderRadius: 12,
      elevation: theme === 'light' ? 3 : 0,
      marginBottom: 30,
    },
    infoText: {
      fontSize: 18,
      marginBottom: 10,
      color: theme === 'light' ? '#444' : '#ccc',
    },
    infoValue: {
      fontWeight: 'bold',
      color: theme === 'light' ? '#000' : '#fff',
    },
    actionsContainer: {
      gap: 20,
      marginBottom: 40,
    },
    button: {
      backgroundColor: theme === 'light' ? '#3f51b5' : '#90caf9',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      elevation: 2,
      marginBottom: 15,
    },
    secondaryButton: {
      backgroundColor: theme === 'light' ? '#1976d2' : '#42a5f5',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    logoutButton: {
      backgroundColor: '#f44336',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      elevation: 3,
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
  });
