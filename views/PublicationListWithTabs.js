import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assurez-vous que ce chemin est correct
import PublicationList from './PublicationList'; // Assurez-vous que le chemin est correct
import AddPublication from './AddPublication'; // Assurez-vous que le chemin est correct
import UserProfileScreen from './UserProfileScreen'; // Assurez-vous que le chemin est correct
import { UserContext } from './UserC'; // Assurez-vous que le chemin est correct

const Tab = createBottomTabNavigator();

const PublicationListWithTabs = ({ route, navigation }) => {
  const { user } = useContext(UserContext); // Obtenir l'utilisateur du contexte
  const userId = user ? user.id : null; // Obtenir l'ID utilisateur

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen name="Publications" component={PublicationList} initialParams={route.params} />
      <Tab.Screen
        name="AddPublication"
        component={AddPublication}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={styles.addButton}
              onPress={() => navigation.navigate('AddPublication')}
            >
              <Icon name="add-circle" size={40} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        initialParams={{ userId }} // Passer l'ID utilisateur en paramètre
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingVertical: 5,
  },
  tabBarItem: {
    marginHorizontal: 10,
  },
  tabBarLabel: {
    fontSize: 12,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
  },
});

export default PublicationListWithTabs;
