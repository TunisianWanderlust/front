import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { UserProvider } from './views/UserC';
import Home from './views/Home';
import SigninScreen from './views/SigninScreen';
import SignupScreen from './views/signupScreen';
import AcceuilScreen from './views/AcceuilScreen';
import UpdateProfileScreen from './views/UpdateProfileScreen';
import ChangePasswordScreen from './views/ChangePasswordScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <PaperProvider>
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
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Acceuil" component={AcceuilScreen} />
            <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </PaperProvider>
  );
}

export default App;
