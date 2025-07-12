import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegistroScreen from "../screens/RegistroScreen";
import RestablecerScreen from "../screens/RestablecerScreen";
import TareasScreen from "../screens/TareasScreen";
import CrearTareaScreen from "../screens/CrearTareaScreen";
import ListaTareasScreen from "../screens/ListaTareasScreen";
import EditarTareaScreen from "../screens/EditarTareaScreen";
import DetalleTareaScreen from '../screens/DetalleTareaScreen';



const Stack = createStackNavigator()

function MyStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registro" component={RegistroScreen} />
            <Stack.Screen name="Tareas" component={TareasScreen} />
            <Stack.Screen name="Restablecer" component={RestablecerScreen} />
            <Stack.Screen name="CrearTarea" component={CrearTareaScreen} />
            <Stack.Screen name="ListaTareas" component={ListaTareasScreen} />
            <Stack.Screen name="EditarTarea" component={EditarTareaScreen} />
            <Stack.Screen name="DetalleTarea" component={DetalleTareaScreen} />




        </Stack.Navigator>
    )
}

export default function Navegador() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    )
}