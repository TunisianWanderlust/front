/*import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { UserContext } from './UserC';

export default function AcceuilScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);

  if (!user) {
    console.log('Aucun utilisateur trouvé dans le contexte.');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  console.log('Utilisateur trouvé:', user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue, {user.fullName}!</Text>
      <Button
        title="Mettre à jour le profil"
        onPress={() => navigation.navigate('UpdateProfile', { userId: user.id })}
      />
      <Button
        title="Changer le mot de passe"
        onPress={() => navigation.navigate('ChangePassword', { userId: user.id })}
      />
      <Button
        title="Se déconnecter"
        onPress={async () => {
          await logout();
          navigation.navigate('Signin'); // Vérifiez que le nom de l'écran de connexion est correct
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
*/
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar, Menu, Divider } from 'react-native-paper';
import { UserContext } from './UserC';

export default function AcceuilScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  if (!user) {
    console.log('Aucun utilisateur trouvé dans le contexte.');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  console.log('Utilisateur trouvé:', user);

  return (
    <View style={styles.container}>
      <Appbar.Header>
      <View style={styles.appbarTitle}>
          <Text style={styles.title}> {user.fullName}!</Text>
        </View>
       
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
          style={styles.menu}
        >
          <Menu.Item
            title="Mettre à jour le profil"
            onPress={() => {
              closeMenu();
              navigation.navigate('UpdateProfile', { userId: user.id });
            }}
          />
          <Menu.Item
            title="Changer le mot de passe"
            onPress={() => {
              closeMenu();
              navigation.navigate('ChangePassword', { userId: user.id });
            }}
          />
          <Divider />
          <Menu.Item
            title="Se déconnecter"
            onPress={async () => {
              closeMenu();
              await logout();
              navigation.navigate('Signin');
            }}
          />
        </Menu>
      </Appbar.Header>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    marginTop: 56, 
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  appbarTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', 
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
