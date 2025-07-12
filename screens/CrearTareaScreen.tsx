import React, { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { ref, push, set } from 'firebase/database';
import { auth, db } from '../firebase/Config';
import { useThemeStore } from '../stores/themeStore';

export default function CrearTareaScreen() {
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('Media');
  const [fechaHoraCumplir, setFechaHoraCumplir] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  function onChange(event: any, selectedDate?: Date) {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFechaHoraCumplir(selectedDate);
    }
  }

  function showMode(currentMode: 'date' | 'time') {
    setShowDatePicker(true);
    setMode(currentMode);
  }

  async function guardar() {
    if (titulo.trim() === '' || descripcion.trim() === '') {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('Usuario no autenticado');
      return;
    }

    try {
      const tareasRef = ref(db, 'tareas/' + user.uid);
      const nuevaTareaRef = push(tareasRef);

      await set(nuevaTareaRef, {
        titulo,
        descripcion,
        prioridad,
        completada: false,
        fechaCumplir: fechaHoraCumplir.getTime(),
        fechaCumplirLegible: fechaHoraCumplir.toLocaleString(),
        fechaCreacion: Date.now(),
      });

      alert('Tarea guardada con éxito');
      setTitulo('');
      setDescripcion('');
      setPrioridad('Media');
      setFechaHoraCumplir(new Date());
    } catch (error: any) {
      alert('Error guardando tarea: ' + error.message);
    }
  }

  const styles = getStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { backgroundColor: styles.container.backgroundColor }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Switch para cambiar tema */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{theme === 'light' ? '🌞 Claro' : '🌙 Oscuro'}</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            thumbColor={theme === 'dark' ? '#f4f3f4' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#4f90ff' }}
            ios_backgroundColor="#3e3e3e"
          />
        </View>

        <Text style={styles.label}>Título</Text>
        <TextInput
          placeholder="Escribe el título"
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholderTextColor={theme === 'light' ? '#999' : '#aaa'}
          selectionColor={theme === 'light' ? '#4f90ff' : '#90caf9'}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          placeholder="Escribe la descripción"
          style={[styles.input, styles.textArea]}
          multiline
          value={descripcion}
          onChangeText={setDescripcion}
          placeholderTextColor={theme === 'light' ? '#999' : '#aaa'}
          selectionColor={theme === 'light' ? '#4f90ff' : '#90caf9'}
        />

        <Text style={styles.label}>Prioridad</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={prioridad}
            onValueChange={(itemValue) => setPrioridad(itemValue)}
            style={styles.picker}
            dropdownIconColor={theme === 'light' ? '#4f90ff' : '#90caf9'}
          >
            <Picker.Item label="Alta" value="Alta" />
            <Picker.Item label="Media" value="Media" />
            <Picker.Item label="Baja" value="Baja" />
          </Picker>
        </View>

        <Text style={styles.label}>Fecha y hora para cumplir la tarea</Text>
        <View style={styles.dateButtonsContainer}>
          <Button
            title="Seleccionar fecha"
            onPress={() => showMode('date')}
            color={theme === 'light' ? '#4f90ff' : '#90caf9'}
          />
          <Button
            title="Seleccionar hora"
            onPress={() => showMode('time')}
            color={theme === 'light' ? '#4f90ff' : '#90caf9'}
          />
        </View>
        <Text style={styles.fechaText}>
          {fechaHoraCumplir.toLocaleString()}
        </Text>

        {showDatePicker && (
          <DateTimePicker
            value={fechaHoraCumplir}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            textColor={theme === 'light' ? '#111827' : '#f9fafb'}
          />
        )}

        <View style={styles.saveButtonContainer}>
          <Button
            title="Guardar tarea"
            onPress={guardar}
            color={theme === 'light' ? '#4f90ff' : '#90caf9'}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
      padding: 24,
      backgroundColor: theme === 'light' ? '#f9fafc' : '#121212',
      flexGrow: 1,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: 24,
    },
    switchLabel: {
      marginRight: 12,
      fontSize: 18,
      fontWeight: '600',
      color: theme === 'light' ? '#374151' : '#d1d5db', // gris oscuro / gris claro
    },
    label: {
      fontWeight: '700',
      fontSize: 19,
      marginTop: 24,
      marginBottom: 10,
      color: theme === 'light' ? '#111827' : '#e5e7eb', // casi negro / gris claro
    },
    input: {
      backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 18,
      fontSize: 18,
      borderWidth: 1,
      borderColor: theme === 'light' ? '#d1d5db' : '#374151',
      color: theme === 'light' ? '#111827' : '#f9fafb',
      shadowColor: theme === 'light' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: theme === 'light' ? 0.05 : 0.3,
      shadowRadius: 6,
      elevation: 3,
    },
    textArea: {
      height: 130,
      textAlignVertical: 'top',
    },
    pickerContainer: {
      borderRadius: 14,
      marginTop: 12,
      marginBottom: 28,
      backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
      overflow: 'hidden',
      shadowColor: theme === 'light' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme === 'light' ? 0.07 : 0.35,
      shadowRadius: 7,
      elevation: 4,
    },
    picker: {
      height: 52,
      width: '100%',
      color: theme === 'light' ? '#111827' : '#f9fafb',
    },
    dateButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      marginBottom: 12,
    },
    fechaText: {
      marginTop: 14,
      fontSize: 17,
      fontWeight: '500',
      color: theme === 'light' ? '#374151' : '#d1d5db',
      textAlign: 'center',
    },
    saveButtonContainer: {
      marginTop: 36,
      borderRadius: 14,
      overflow: 'hidden',
      elevation: 2,
    },
  });
