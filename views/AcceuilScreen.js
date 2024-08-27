import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Appbar, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { UserContext } from './UserC';
import { Picker } from '@react-native-picker/picker';
import { getVilleById, getVilles } from '../services/VilleService';
import LinearGradient from 'react-native-linear-gradient';

export default function AcceuilScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [villes, setVilles] = useState([]);
  const [selectedVille, setSelectedVille] = useState('');
  const [villeDetails, setVilleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [nomMessage, setNomMessage] = useState('');
  const [descriptionMessage, setDescriptionMessage] = useState('');
  const [imageMessage, setImageMessage] = useState('');

  useEffect(() => {
    const fetchVilles = async () => {
      try {
        const data = await getVilles();
        setVilles(data);

        const tunisVille = data.find(ville => ville.nom.toLowerCase() === 'tunis');
        if (tunisVille) {
          setSelectedVille(tunisVille._id);
        }
      } catch (err) {
        setError('Erreur lors de la récupération des villes : ' + err.message);
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
          const data = await getVilleById(selectedVille);
          setVilleDetails(data);

          if (data.nom) {
            setNomMessage(`Nom récupéré avec succès : ${data.nom}`);
            console.log(`Nom récupéré avec succès : ${data.nom}`);
          } else {
            setNomMessage('Erreur : Nom non disponible');
            console.error('Erreur : Nom non disponible');
          }

          if (data.description) {
            setDescriptionMessage(`Description récupérée avec succès : ${data.description}`);
            console.log(`Description récupérée avec succès : ${data.description}`);
          } else {
            setDescriptionMessage('Erreur : Description non disponible');
            console.error('Erreur : Description non disponible');
          }

          if (data.image) {
            const imageUrl = data.image.replace('127.0.0.1', '192.168.74.1');
            setImageMessage(`Image récupérée avec succès : ${imageUrl}`);
            console.log(`Image récupérée avec succès : ${imageUrl}`);
            setVilleDetails({ ...data, image: imageUrl });
          } else {
            setImageMessage('Erreur : Image non disponible');
            console.error('Erreur : Image non disponible');
          }
        } catch (err) {
          setError('Erreur lors de la récupération de la ville : ' + err.message);
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
      {villeDetails && villeDetails.image && (
        <ImageBackground 
          source={{ uri: villeDetails.image }} 
          style={styles.backgroundImage}
          onError={(e) => console.log('Erreur lors du chargement de l\'image :', e.nativeEvent.error)} 
        >
          <Appbar.Header style={styles.appbarHeader}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedVille}
                onValueChange={(itemValue) => setSelectedVille(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionner une ville" value="" />
                {villes.map((ville) => (
                  <Picker.Item key={ville._id} label={ville.nom} value={ville._id} />
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

          {/* Description Container */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.villeDescription}>{villeDetails.description}</Text>
          </View>

          {/* Button Container */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PublicationList', { nomVille: villeDetails.nom })}>
              <LinearGradient
                colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>c'est partie</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CategoriesScreen', { nomVille: villeDetails.nom })}>
              <LinearGradient
                colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>voir categorie</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </ImageBackground>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  appbarHeader: {
    height: 56,
    justifyContent: 'center',
  },
  menu: {
    marginTop: 56,
    width: 300,
  },
  subMenuItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 8,
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
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    paddingHorizontal: 16,
    marginTop: -100, // Adjust this value if needed to position the description
  },
  villeDescription: {
    fontSize: 22,
    color: '#bdbdbd',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
    textShadowColor: '#333',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  error: {
    color: 'red',
  },
  buttonContainer: {
    marginVertical: 10, // Add some spacing between buttons
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  /*buttonContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },*/
  button: {
    marginVertical: 5,
    marginHorizontal: 5,
  },
  gradientButton: {
    borderRadius: 200,
    padding: 15,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  /*
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },*/
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});
