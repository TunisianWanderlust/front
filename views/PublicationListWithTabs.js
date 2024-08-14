import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PublicationList from './PublicationList'; // Assurez-vous que le chemin est correct

const Tab = createBottomTabNavigator();

const PublicationListWithTabs = ({ route, navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Publications" component={PublicationList} initialParams={route.params} />
      {/* Vous pouvez ajouter d'autres écrans ici si nécessaire */}
    </Tab.Navigator>
  );
};

export default PublicationListWithTabs;
