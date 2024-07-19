import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './views/Home'; 
import SigninScreen from './views/SigninScreen'; 
import SignupScreen from './views/signupScreen';
import AcceuilScreen from './views/AcceuilScreen';
import UpdateProfileScreen from './views/UpdateProfileScreen';
import { UserProvider } from './views/UserC';
import ChangePasswordScreen from './views/ChangePasswordScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
  <UserProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen}/>
        <Stack.Screen name="Acceuil" component={AcceuilScreen}/>
        <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen}/>
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  </UserProvider>
  );
}

export default App;