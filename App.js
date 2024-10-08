import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { UserProvider } from './views/UserC';
import Home from './views/Home';
import SigninScreen from './views/SigninScreen';
import SignupScreen from './views/signupScreen';
import AcceuilScreen from './views/AcceuilScreen';
import UpdateProfileScreen from './views/UpdateProfileScreen';
import ChangePasswordScreen from './views/ChangePasswordScreen';
import PublicationListWithTabs from './views/PublicationListWithTabs';
import AddPublication from './views/AddPublication';
import UserProfileScreen from './views/UserProfileScreen';
import CategoriesScreen from './views/CategoriesScreen';
import CategorieDescriptionScreen from './views/CategorieDescriptionScreen';


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
            <Stack.Screen name="PublicationList" component={PublicationListWithTabs} />
            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
            <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
            <Stack.Screen name="CategorieDescriptionScreen" component={CategorieDescriptionScreen} />

          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </PaperProvider>
  );
}

export default App;
