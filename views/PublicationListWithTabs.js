import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PublicationList from './PublicationList';
import AddPublication from './AddPublication';
import UserProfileScreen from './UserProfileScreen';
import AcceuilScreen from './AcceuilScreen';
import { UserContext } from './UserC';

const Tab = createBottomTabNavigator();

const PublicationListWithTabs = ({ route, navigation }) => {
  const { user } = useContext(UserContext);
  const userId = user ? user.id : null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Acceuil':
              iconName = 'arrow-back';
              break;
            case 'Publications':
              iconName = 'home';
              break;
            case 'AddPublication':
              iconName = 'add-circle';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarLabel: () => null, // Masquer les labels
      })}
    >
      
      <Tab.Screen 
        name="Publications" 
        component={PublicationList} 
        initialParams={route.params} 
      />
      
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
        initialParams={{ userId }}
      />
            <Tab.Screen
        name="Acceuil"
        component={AcceuilScreen}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              style={styles.navButton}
              onPress={() => navigation.navigate('Acceuil')}
            >
              <Icon name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingVertical: 1,
    marginBottom:15,
    // Ajustez le fond ou d'autres styles de la barre ici si nécessaire
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Ajuster l'espacement du bas pour centrer le bouton
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Ajuster l'espacement du bas pour centrer le bouton
  },
});

export default PublicationListWithTabs;
