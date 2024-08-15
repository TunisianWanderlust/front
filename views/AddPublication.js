import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';

import { UserContext } from './UserC';
import { addPublication, updatePublication } from '../services/PublicationService';
import { getVilles } from '../services/VilleService';

const AddPublication = ({ navigation, route }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [nomVille, setNomVille] = useState('');
  const [publicationId, setPublicationId] = useState(route.params?.publicationId || null);
  const [villes, setVilles] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchVilles = async () => {
      try {
        const villesData = await getVilles();
        setVilles(villesData);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de récupérer les villes');
        console.error(error);
      }
    };

    fetchVilles();
  }, []);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        Alert.alert('Opération annulée', 'Vous avez annulé la sélection d\'image.');
      } else if (response.errorCode) {
        Alert.alert('Erreur', `Erreur lors de la sélection de l'image: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      } else {
        Alert.alert('Erreur', 'Aucune image sélectionnée.');
      }
    });
  };

  const handleSubmit = async () => {
    console.log('Description:', description);
    console.log('Nom de la Ville:', nomVille);
    console.log('User ID:', user?.id);

    if (!description || !nomVille || !user?.id || !image) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }

    const formData = new FormData();
    formData.append('source', {
      uri: image.uri,
      type: image.type,
      name: image.fileName || 'photo.jpg',
    });
    formData.append('description', description);
    formData.append('nomVille', nomVille);
    formData.append('userId', user.id);

    try {
      if (publicationId) {
        await updatePublication(publicationId, formData);
      } else {
        await addPublication(formData);
      }

      Alert.alert(
        'Succès',
        publicationId ? 'Publication mise à jour avec succès.' : 'Publication ajoutée avec succès.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('PublicationList'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', `Erreur lors de l'ajout de la publication: ${error.message}`);
      console.error('Erreur lors de l\'ajout de la publication:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Entrez la description"
      />
      <Text style={styles.label}>Nom de la Ville:</Text>
      <Picker
        selectedValue={nomVille}
        style={styles.picker}
        onValueChange={(itemValue) => setNomVille(itemValue)}
      >
        <Picker.Item label="Sélectionner une ville" value="" />
        {villes.map((ville) => (
          <Picker.Item key={ville._id} label={ville.nom} value={ville.nom} />
        ))}
      </Picker>
      <Button title="Choisir une image" onPress={handleImagePick} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <Button title={publicationId ? "Mettre à jour la publication" : "Ajouter Publication"} onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default AddPublication;
