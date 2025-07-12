import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/Config';

export default function RestablecerScreen() {
    const [correo, setcorreo] = useState("")

    function restablecer() {
        sendPasswordResetEmail(auth, correo)
            .then(() => {


                // Password reset email sent!
                Alert.alert("Mensaje", "Mensaje Enviado")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });

    }
    return (
        <View>
            <Text>RestablecerScreen</Text>
            <TextInput
                placeholder='Ingresar correo'
                onChangeText={(texto) => setcorreo(texto)}
            />
            <Button title='Enviar solicitud' onPress={()=>restablecer()} />
        </View>
    )
}

const styles = StyleSheet.create({})