import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.userContainer}>
          <Image 
            source={{ uri: user.image.replace('127.0.0.1', '192.168.1.21') }} 
            style={styles.userImage}
            onError={(e) => console.log('Erreur lors du chargement de l\'image :', e.nativeEvent.error)} 
          />
          <Text style={styles.userName}>{user.fullName}</Text>
        </View>

        <View style={styles.fieldContainer}>
          {/*<Text style={styles.label}>Nom de la Ville:</Text>*/}
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
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>Choisir une image</Text>
          )}
        </TouchableOpacity>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Entrez la description"
            multiline
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>
          {publicationId ? "Mettre à jour la publication" : "Ajouter Publication"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  userName: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  imagePicker: {
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  imagePickerText: {
    color: '#007BFF',
    fontSize: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 260,
    textAlignVertical: 'top',
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPublication;
