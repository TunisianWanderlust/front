// AddPublication.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import { UserContext } from './UserC';
import { addPublication } from '../services/PublicationService';

const AddPublication = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [nomVille, setNomVille] = useState('');
  const { user } = useContext(UserContext);

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
      await addPublication(formData);
      Alert.alert('Succès', 'Publication ajoutée avec succès.');
      navigation.goBack();
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
      <TextInput
        style={styles.input}
        value={nomVille}
        onChangeText={setNomVille}
        placeholder="Entrez le nom de la ville"
      />
      <Button title="Choisir une image" onPress={handleImagePick} />
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      <Button title="Ajouter Publication" onPress={handleSubmit} />
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
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default AddPublication;
