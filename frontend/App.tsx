import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";

function RootNavigation(){
  const { user, loading } = useAuth();

  if(loading) return null // Splash screen
  
  return(
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App(){
  return(
    <AuthProvider>
      <RootNavigation /> 
    </AuthProvider>
  );
}