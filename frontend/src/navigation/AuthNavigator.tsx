import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../components/Auth/LoginScreen';
import SignupScreen from '../components/Auth/SignupScreen';
import EmailConfirmationScreen from '../components/Auth/EmailConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator(){
    return(
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Signup" component={SignupScreen}/>
            <Stack.Screen name="EmailConfirmation" component={EmailConfirmationScreen}/>
        </Stack.Navigator>
    )
}