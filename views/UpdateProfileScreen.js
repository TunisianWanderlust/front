import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { UserContext } from './UserC';
import { updateProfile } from '../services/UserService';
import { launchImageLibrary } from 'react-native-image-picker';
import UserModel from '../models/User';

export default function UpdateProfileScreen({ route }) {
  const { userId } = route.params; // Récupérez l'ID de l'utilisateur passé
  const { user } = useContext(UserContext);
  
  // Vérifiez si l'utilisateur existe
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  // Créez une instance de UserModel
  const currentUser = new UserModel(
    user.id,
    user.fullName,
    user.email,
    user.telephone ? String(user.telephone) : '', // Convertir en chaîne
    user.image,
    user.role
  );
  
 // Vérifiez ici
  

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [telephone, setTelephone] = useState(currentUser.telephone || '');
  const [image, setImage] = useState(null);

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response.assets[0]);
      }
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('telephone', telephone);

      if (image) {
        formData.append('source', {
          uri: image.uri,
          type: image.type,
          name: image.fileName || 'photo.jpg',
        });
      }

      const successMessage = await updateProfile(userId, formData, user.token);
      console.log(successMessage);
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nom complet :</Text>
      <TextInput 
        value={fullName} 
        onChangeText={setFullName} 
        style={styles.input}
      />
      <Text>Adresse e-mail :</Text>
      <TextInput 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
      />
      <Text>Numéro de téléphone :</Text>
      <TextInput 
        value={telephone} 
        onChangeText={setTelephone} 
        style={styles.input} 
        keyboardType="phone-pad" // Définit le clavier pour les numéros de téléphone
        maxLength={15} // Limite la longueur du numéro
      />
      
      <Button title="Choisir une image" onPress={handleImagePicker} />
      
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 100, height: 100, marginVertical: 10 }}
        />
      )}

      <Button title="Mettre à jour le profil" onPress={handleUpdateProfile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
