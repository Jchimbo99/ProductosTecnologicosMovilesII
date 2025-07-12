import { Button, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, db } from '../firebase/Config';
import { ref, update } from 'firebase/database';

export default function EditarTareaScreen({ route, navigation }: any) {
  const { tareaId, tareaData } = route.params || {};

  if (!tareaData || !tareaId) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>
          Error: No se proporcionaron los datos necesarios de la tarea.
        </Text>
      </View>
    );
  }

  const [titulo, setTitulo] = useState(tareaData?.titulo || '');
  const [descripcion, setDescripcion] = useState(tareaData?.descripcion || '');
  const [prioridad, setPrioridad] = useState(tareaData?.prioridad || 'Media');
  const [fechaHoraCumplir, setFechaHoraCumplir] = useState(
    tareaData?.fechaCumplir ? new Date(tareaData.fechaCumplir) : new Date()
  );

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

  async function editar() {
    const user = auth.currentUser;
    if (!user) {
      alert('Usuario no autenticado');
      return;
    }

    try {
      const tareaRef = ref(db, `tareas/${user.uid}/${tareaId}`);
      await update(tareaRef, {
        titulo,
        descripcion,
        prioridad,
        fechaCumplir: fechaHoraCumplir.getTime(),
        fechaCumplirLegible: fechaHoraCumplir.toLocaleString(),
      });

      alert('Tarea actualizada correctamente');
      navigation.goBack();
    } catch (error: any) {
      alert('Error actualizando la tarea: ' + error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Text style={styles.label}>Prioridad</Text>
      <Picker selectedValue={prioridad} onValueChange={setPrioridad} style={styles.picker}>
        <Picker.Item label="Alta" value="Alta" />
        <Picker.Item label="Media" value="Media" />
        <Picker.Item label="Baja" value="Baja" />
      </Picker>

      <Text style={styles.label}>Fecha para cumplir</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button title="Seleccionar fecha" onPress={() => showMode('date')} />
        <Button title="Seleccionar hora" onPress={() => showMode('time')} />
      </View>
      <Text style={{ marginTop: 10, fontSize: 16 }}>{fechaHoraCumplir.toLocaleString()}</Text>

      {showDatePicker && (
        <DateTimePicker
          value={fechaHoraCumplir}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <Button title="Actualizar tarea" onPress={editar} color="#2196f3" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4ff' },
  label: { fontWeight: '700', fontSize: 16, marginTop: 15, marginBottom: 5 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  picker: {
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 20,
  },
});
