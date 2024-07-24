import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { UserContext } from './UserC';
import { Picker } from '@react-native-picker/picker';
import { getVilleByNom, getVilles } from '../services/VilleService';

export default function AcceuilScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [villes, setVilles] = useState([]);
  const [selectedVille, setSelectedVille] = useState('tunis'); // Ville par défaut
  const [villeDetails, setVilleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVilles = async () => {
      try {
        const data = await getVilles();
        setVilles(data);
        if (data.find(ville => ville.nom === 'tunis')) {
          setSelectedVille('tunis'); // Assurez-vous que Tunis est dans la liste des villes
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchVilles();
  }, []);

  useEffect(() => {
    if (selectedVille) {
      const fetchVilleDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getVilleByNom(selectedVille);
          setVilleDetails(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchVilleDetails();
    }
  }, [selectedVille]);

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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedVille}
            onValueChange={(itemValue) => setSelectedVille(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner une ville" value="" />
            {villes.map((ville) => (
              <Picker.Item key={ville._id} label={ville.nom} value={ville.nom} />
            ))}
          </Picker>
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

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {villeDetails && (
        <ScrollView style={styles.villeContainer}>
          <Text style={styles.villeDescription}>{villeDetails.description}</Text>
          <Text style={styles.villeImage}>{villeDetails.image}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbarHeader: {
    height: 56, // Ajuste la hauteur de l'Appbar
    justifyContent: 'center', // Centre le contenu verticalement
    //backgroundColor: '#6200ee', // Couleur d'arrière-plan
  },
  menu: {
    marginTop: 56,
    width: 300,
  },
  subMenuItem: {
    backgroundColor: '#f0f0f0', // Couleur de fond du cadre
    borderRadius: 4, // Bordure arrondie
    padding: 8, // Espacement intérieur
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  picker: {
    height: 50,
    width: '70%',
  },
  villeContainer: {
    padding: 16,
  },
  villeDescription: {
    fontSize: 14,
    color: '#666',
  },
  villeImage: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: 'red',
  },
});



/*
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
*/