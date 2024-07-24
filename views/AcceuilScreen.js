
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar, Menu, Divider } from 'react-native-paper';
import { UserContext } from './UserC';

export default function AcceuilScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => {
    setVisible(false);
    setShowSubMenu(false);
  };

  const handleSettings = () => {
    setShowSubMenu(!showSubMenu);
  };

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
      <Appbar.Header style={styles.appbarHeader}>
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
            title="Paramètre"
            onPress={handleSettings}
          />
          {showSubMenu && (
            <>
              <Menu.Item
                title="Mettre à jour le profil"
                onPress={() => {
                  closeMenu();
                  navigation.navigate('UpdateProfile', { userId: user.id });
                }}
                style={styles.subMenuItem}
              />
              <Menu.Item
                title="Changer le mot de passe"
                onPress={() => {
                  closeMenu();
                  navigation.navigate('ChangePassword', { userId: user.id });
                }}
                style={styles.subMenuItem}
              />
              <Divider />
            </>
          )}
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
  appbarHeader: {
    height: 42, // Ajuste la hauteur de l'Appbar
    justifyContent: 'center', // Centre le contenu verticalement
  },
  menu: {
    marginTop: 56,
    width: 300,
  },
  subMenuItem: {
    backgroundColor: '#f0f0f0', // Couleur de fond du cadre
    borderRadius: 4, // Bordure arrondie pour le cadre
    padding: 8, // Espacement intérieur
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
    marginBottom: 10,
  },
});
