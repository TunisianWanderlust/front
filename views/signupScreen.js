import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { signup } from '../services/UserService';
import UserModel from '../models/User';
import { launchImageLibrary } from 'react-native-image-picker';
import { UserContext } from './UserC';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const [image, setImage] = useState(null);
  const { login } = useContext(UserContext);

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

  const handleSignup = async () => {
    console.log("Bouton S'inscrire pressé");

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('telephone', telephone);

    if (image) {
      formData.append('source', {
        uri: image.uri,
        type: image.type,
        name: image.fileName || 'photo.jpg',
      });
    }

    try {
      const response = await signup(formData);
      console.log('Réponse de l\'inscription:', response);

      const _id = response._id;

      const userModel = new UserModel(
        _id,
        fullName,
        email,
        '',
        telephone
      );

      await login(userModel, "");

      navigation.navigate('Acceuil', { _id });
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error.message);
      console.error('Payload:', formData);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom complet :</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Entrez votre nom complet"
      />

      <Text style={styles.label}>Adresse e-mail :</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Entrez votre adresse e-mail"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Mot de passe :</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Entrez votre mot de passe"
        secureTextEntry
      />

      <Text style={styles.label}>Numéro de téléphone :</Text>
      <TextInput
        style={styles.input}
        value={telephone}
        onChangeText={setTelephone}
        placeholder="Entrez votre numéro de téléphone"
        keyboardType="phone-pad"
      />

      <Button title="Choisir une image" onPress={handleImagePicker} />

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 100, height: 100, marginVertical: 10 }}
        />
      )}

      <Button title="S'inscrire" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
