import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../firebase/Config';
import { ref, onValue, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../stores/themeStore';

export default function ListaTareasScreen() {
  const [tareas, setTareas] = useState<any[]>([]);
  const [orden, setOrden] = useState<'fecha' | 'prioridad'>('fecha');
  const navigation = useNavigation<any>();

  // Consumo tema y toggle desde Zustand
  const theme = useThemeStore((state: { theme: any; }) => state.theme);
  const toggleTheme = useThemeStore((state: { toggleTheme: any; }) => state.toggleTheme);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const tareasRef = ref(db, `tareas/${user.uid}`);
    onValue(tareasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedTareas = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...value,
        }));
        setTareas(parsedTareas);
      } else {
        setTareas([]);
      }
    });
  }, []);

  const irAEditar = (tarea: any) => {
    navigation.navigate('EditarTarea', {
      tareaId: tarea.id,
      tareaData: {
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        prioridad: tarea.prioridad,
        fechaCumplir: tarea.fechaCumplir,
      },
    });
  };

  const eliminarTarea = (id: string) => {
    Alert.alert(
      '¿Eliminar tarea?',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const user = auth.currentUser;
            if (!user) return;
            try {
              const tareaRef = ref(db, `tareas/${user.uid}/${id}`);
              await remove(tareaRef);
              Alert.alert('Tarea eliminada correctamente');
            } catch (error: any) {
              Alert.alert('Error al eliminar la tarea', error.message);
            }
          },
        },
      ]
    );
  };

  const convertirPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta':
        return 3;
      case 'Media':
        return 2;
      case 'Baja':
        return 1;
      default:
        return 0;
    }
  };

  const tareasOrdenadas = [...tareas].sort((a, b) => {
    if (orden === 'fecha') {
      return a.fechaCumplir - b.fechaCumplir;
    } else {
      return convertirPrioridad(b.prioridad) - convertirPrioridad(a.prioridad);
    }
  });

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.titulo}>📝 Mis Tareas</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>{theme === 'light' ? '🌞' : '🌙'}</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View>
      </View>

      <Text style={styles.ordenLabel}>Ordenar por:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={orden}
          onValueChange={(value) => setOrden(value)}
          style={styles.picker}
          dropdownIconColor={theme === 'light' ? '#666' : '#ccc'}
          mode="dropdown"
        >
          <Picker.Item label="📅 Fecha de cumplimiento" value="fecha" />
          <Picker.Item label="🚦 Prioridad" value="prioridad" />
        </Picker>
      </View>

      <FlatList
        data={tareasOrdenadas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tareaCard}>
            <Text style={styles.tituloTarea}>📌 {item.titulo}</Text>
            <Text style={styles.detalle}>⚡ Prioridad: {item.prioridad}</Text>
            <Text style={styles.detalle}>
              🕒 Fecha: {new Date(item.fechaCumplir).toLocaleString()}
            </Text>

            <View style={styles.botones}>
              <TouchableOpacity onPress={() => irAEditar(item)} style={styles.botonEditar}>
                <Text style={styles.botonTexto}>✏️ Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => eliminarTarea(item.id)} style={styles.botonEliminar}>
                <Text style={styles.botonTexto}>🗑️ Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'light' ? '#eaf0ff' : '#121212',
      padding: 20,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    titulo: {
      fontSize: 26,
      fontWeight: '800',
      color: theme === 'light' ? '#3f51b5' : '#90caf9',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    switchLabel: {
      fontSize: 18,
      marginRight: 6,
      color: theme === 'light' ? '#3f51b5' : '#90caf9',
    },
    ordenLabel: {
      fontWeight: '700',
      fontSize: 16,
      marginTop: 15,
      color: theme === 'light' ? '#333' : '#ddd',
    },
    pickerContainer: {
      backgroundColor: theme === 'light' ? '#fff' : '#333',
      marginTop: 5,
      marginBottom: 20,
      borderRadius: 8,
      elevation: 1,
    },
    picker: {
      color: theme === 'light' ? '#000' : '#fff',
      height: 40,
    },
    tareaCard: {
      backgroundColor: theme === 'light' ? '#fff' : '#222',
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
      elevation: 3,
      shadowColor: theme === 'light' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === 'light' ? 0.2 : 0.8,
      shadowRadius: 3,
    },
    tituloTarea: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 6,
      color: theme === 'light' ? '#222' : '#eee',
    },
    detalle: {
      fontSize: 14,
      color: theme === 'light' ? '#555' : '#ccc',
      marginBottom: 4,
    },
    botones: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
      gap: 12,
    },
    botonEditar: {
      backgroundColor: '#1976d2',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    botonEliminar: {
      backgroundColor: '#d32f2f',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    botonTexto: {
      color: '#fff',
      fontWeight: '600',
    },
  });
