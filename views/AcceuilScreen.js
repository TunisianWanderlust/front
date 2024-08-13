import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Button } from 'react-native';
import { Appbar, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { UserContext } from './UserC';
import { Picker } from '@react-native-picker/picker';
import { getVilleById, getVilles } from '../services/VilleService';

export default function AcceuilScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [villes, setVilles] = useState([]);
  const [selectedVille, setSelectedVille] = useState(''); // Ville par défaut
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

        // Assurez-vous que l'ID de Tunis est utilisé comme valeur par défaut
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

          // Message pour le nom
          if (data.nom) {
            setNomMessage(`Nom récupéré avec succès : ${data.nom}`);
            console.log(`Nom récupéré avec succès : ${data.nom}`);
          } else {
            setNomMessage('Erreur : Nom non disponible');
            console.error('Erreur : Nom non disponible');
          }

          // Message pour la description
          if (data.description) {
            setDescriptionMessage(`Description récupérée avec succès : ${data.description}`);
            console.log(`Description récupérée avec succès : ${data.description}`);
          } else {
            setDescriptionMessage('Erreur : Description non disponible');
            console.error('Erreur : Description non disponible');
          }

          // Message pour l'image
          if (data.image) {
            const imageUrl = data.image.replace('127.0.0.1', '192.168.1.21'); // Replace with your machine's local IP address
            setImageMessage(`Image récupérée avec succès : ${imageUrl}`);
            console.log(`Image récupérée avec succès : ${imageUrl}`);
            setVilleDetails({ ...data, image: imageUrl }); // Update villeDetails with the correct image URL
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
          <ScrollView contentContainerStyle={styles.villeContainer}>
            <Text style={styles.villeDescription}>{villeDetails.description}</Text>
            <Button 
              title="Voir les publications" 
              onPress={() => navigation.navigate('PublicationList', { nomVille: villeDetails.nom })} 
              style={styles.button}
            />

          </ScrollView>
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
    resizeMode: 'cover', // Utiliser le mode de redimensionnement approprié
    justifyContent: 'center', // Centrer le contenu si nécessaire
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
  villeContainer: {
    flex: 1,
    justifyContent: 'center', // Centrer verticalement le contenu
    alignItems: 'center', // Centrer horizontalement le contenu
    padding: 16,
  },
  villeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center', // Centrer le texte horizontalement
    marginBottom: 8,
  },
  error: {
    color: 'red',
  },
  button: {
    marginTop: 20,
  },
});



/*
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
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

  const [nomMessage, setNomMessage] = useState('');
  const [descriptionMessage, setDescriptionMessage] = useState('');
  const [imageMessage, setImageMessage] = useState('');

  useEffect(() => {
    const fetchVilles = async () => {
      try {
        const data = await getVilles();
        setVilles(data);
        if (data.find(ville => ville.nom === 'tunis')) {
          setSelectedVille('tunis'); // Assurez-vous que Tunis est dans la liste des villes
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
          const data = await getVilleByNom(selectedVille);
          setVilleDetails(data);

          // Message pour le nom
          if (data.nom) {
            setNomMessage(`Nom récupéré avec succès : ${data.nom}`);
            console.log(`Nom récupéré avec succès : ${data.nom}`);
          } else {
            setNomMessage('Erreur : Nom non disponible');
            console.error('Erreur : Nom non disponible');
          }

          // Message pour la description
          if (data.description) {
            setDescriptionMessage(`Description récupérée avec succès : ${data.description}`);
            console.log(`Description récupérée avec succès : ${data.description}`);
          } else {
            setDescriptionMessage('Erreur : Description non disponible');
            console.error('Erreur : Description non disponible');
          }

          // Message pour l'image
          if (data.image) {
            setImageMessage(`Image récupérée avec succès : ${data.image}`);
            console.log(`Image récupérée avec succès : ${data.image}`);
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
          <Text style={styles.villeNom}>{villeDetails.nom}</Text>
          <Image source={{ uri: villeDetails.image }} style={styles.villeImage} />
          <Text style={styles.villeDescription}>{villeDetails.description}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appbarHeader: {
    backgroundColor: '#6200ee',
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 50,
    width: 200,
    color: '#fff',
  },
  menu: {
    marginTop: 40,
  },
  subMenuItem: {
    paddingLeft: 20,
  },
  villeContainer: {
    padding: 20,
  },
  villeNom: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  villeImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  villeDescription: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
*/

/*import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Button, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getVilles } from '../services/VilleService';
import VilleModel from '../models/Ville';

const AcceuilScreen = () => {
  const [villes, setVilles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVilles = async () => {
      try {
        const data = await getVilles();
        // Assurez-vous que data contient les URLs complètes des images
        const updatedData = data.map(ville => new VilleModel(
          ville._id,
          ville.nom,
          ville.description,
          ville.image // Utilisez l'URL d'image complète fournie par votre backend
        ));
        setVilles(updatedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVilles();
  }, []);

  const selectImage = (index) => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets[0]) {
        const updatedVilles = [...villes];
        updatedVilles[index].image = response.assets[0].uri;
        setVilles(updatedVilles);
      } else {
        Alert.alert('Erreur', 'Erreur lors du choix de l\'image');
      }
    });
  };

  const renderVille = ({ item, index }) => (
    <View style={styles.villeContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        onError={() => console.log(`Erreur de chargement de l'image pour ${item.nom}`)}
      />
      <Text style={styles.nom}>{item.nom}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Button
        title="Changer l'image"
        onPress={() => selectImage(index)}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Erreur : {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={villes}
        renderItem={renderVille}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  villeContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  nom: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});

export default AcceuilScreen;


*/


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

/*import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Appbar, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { UserContext } from './UserC';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
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

  const [nomMessage, setNomMessage] = useState('');
  const [descriptionMessage, setDescriptionMessage] = useState('');
  const [imageMessage, setImageMessage] = useState('');
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    const fetchVilles = async () => {
      try {
        const data = await getVilles();
        setVilles(data);
        if (data.find(ville => ville.nom === 'tunis')) {
          setSelectedVille('tunis'); // Assurez-vous que Tunis est dans la liste des villes
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
          const data = await getVilleByNom(selectedVille);
          setVilleDetails(data);

          // Message pour le nom
          if (data.nom) {
            setNomMessage(`Nom récupéré avec succès : ${data.nom}`);
            console.log(`Nom récupéré avec succès : ${data.nom}`);
          } else {
            setNomMessage('Erreur : Nom non disponible');
            console.error('Erreur : Nom non disponible');
          }

          // Message pour la description
          if (data.description) {
            setDescriptionMessage(`Description récupérée avec succès : ${data.description}`);
            console.log(`Description récupérée avec succès : ${data.description}`);
          } else {
            setDescriptionMessage('Erreur : Description non disponible');
            console.error('Erreur : Description non disponible');
          }

          // Message pour l'image
          if (data.image) {
            setImageMessage(`Image récupérée avec succès : ${data.image}`);
            console.log(`Image récupérée avec succès : ${data.image}`);
            
            // Assurez-vous que l'URL est correcte
            console.log('URL de l\'image:', data.image);
            
            // Assurez-vous que l'image est bien accessible
            const response = await axios.get(data.image, { responseType: 'arraybuffer' });
            const base64 = Buffer.from(response.data, 'binary').toString('base64');
            setImageUri(`data:image/jpeg;base64,${base64}`);
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
          <Text style={styles.villeNom}>{villeDetails.nom}</Text>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.villeImage} />
          ) : (
            <Text style={styles.error}>Image non disponible</Text>
          )}
          <Text style={styles.villeDescription}>{villeDetails.description}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appbarHeader: {
    backgroundColor: '#6200ee',
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 50,
    width: 200,
    color: '#fff',
  },
  menu: {
    marginTop: 40,
  },
  subMenuItem: {
    paddingLeft: 20,
  },
  villeContainer: {
    padding: 20,
  },
  villeNom: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  villeImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  villeDescription: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});*/

/*
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Appbar, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { UserContext } from './UserC';
import { Picker } from '@react-native-picker/picker';
import { getVilleById, getVilles } from '../services/VilleService';

export default function AcceuilScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const [visible, setVisible] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [villes, setVilles] = useState([]);
  const [selectedVille, setSelectedVille] = useState(''); // Ville par défaut
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
        if (data.length > 0) {
          setSelectedVille(data[0]._id); // Assurez-vous que la première ville est sélectionnée par défaut
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

          // Message pour le nom
          if (data.nom) {
            setNomMessage(`Nom récupéré avec succès : ${data.nom}`);
            console.log(`Nom récupéré avec succès : ${data.nom}`);
          } else {
            setNomMessage('Erreur : Nom non disponible');
            console.error('Erreur : Nom non disponible');
          }

          // Message pour la description
          if (data.description) {
            setDescriptionMessage(`Description récupérée avec succès : ${data.description}`);
            console.log(`Description récupérée avec succès : ${data.description}`);
          } else {
            setDescriptionMessage('Erreur : Description non disponible');
            console.error('Erreur : Description non disponible');
          }

          // Message pour l'image
          if (data.image) {
            setImageMessage(`Image récupérée avec succès : ${data.image}`);
            console.log(`Image récupérée avec succès : ${data.image}`);
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
      {villeDetails && (
        <ScrollView style={styles.villeContainer}>
          <Text style={styles.villeNom}>{villeDetails.nom}</Text>
          <Image 
            source={{ uri: villeDetails.image }} 
            style={styles.villeImage} 
            onError={() => {
              console.error('Erreur lors du chargement de l\'image:', villeDetails.image);
              setImageMessage('Erreur : Image non disponible');
            }}
          />
          <Text style={styles.villeDescription}>{villeDetails.description}</Text>
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
  villeContainer: {
    padding: 16,
  },
  villeNom: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  villeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  villeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  error: {
    color: 'red',
  },
});
*/
/*
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Appbar, Menu, Divider, ActivityIndicator } from 'react-native-paper';
import { UserContext } from './UserC';
import { Picker } from '@react-native-picker/picker';
import { getVilleById, getVilles } from '../services/VilleService';

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
        if (data.length > 0) {
          setSelectedVille(data[0]._id); // Assurez-vous que la première ville est sélectionnée par défaut
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

          // Message pour le nom
          if (data.nom) {
            setNomMessage(`Nom récupéré avec succès : ${data.nom}`);
            console.log(`Nom récupéré avec succès : ${data.nom}`);
          } else {
            setNomMessage('Erreur : Nom non disponible');
            console.error('Erreur : Nom non disponible');
          }

          // Message pour la description
          if (data.description) {
            setDescriptionMessage(`Description récupérée avec succès : ${data.description}`);
            console.log(`Description récupérée avec succès : ${data.description}`);
          } else {
            setDescriptionMessage('Erreur : Description non disponible');
            console.error('Erreur : Description non disponible');
          }

          // Message pour l'image
          if (data.image) {
            setImageMessage(`Image récupérée avec succès : ${data.image}`);
            console.log(`Image récupérée avec succès : ${data.image}`);
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
      {villeDetails && (
        <ScrollView style={styles.villeContainer}>
          <Text style={styles.villeNom}>{villeDetails.nom}</Text>
          <Image 
            source={{ uri: villeDetails.image }} 
            style={styles.villeImage} 
            onError={() => {
              console.error('Erreur lors du chargement de l\'image:', villeDetails.image);
              setImageMessage('Erreur : Image non disponible');
            }}
          />
          <Text style={styles.villeDescription}>{villeDetails.description}</Text>
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
  villeContainer: {
    padding: 16,
  },
  villeNom: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  villeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  villeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  error: {
    color: 'red',
  },
});*/

/* abir 


import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Appbar, Menu, Divider } from 'react-native-paper';
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
          {villeDetails.image ? (
            <Image
              source={{ uri: villeDetails.image }}
              style={styles.villeImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.error}>Aucune image disponible</Text>
          )}
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
    width: 200, // Ajuste la largeur de l'image
    height: 200, // Ajuste la hauteur de l'image
  },
  error: {
    color: 'red',
  },
});


*/
