
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient'; 
import { signin } from '../services/UserService';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from './UserC'; 
import UserModel from '../models/User';

export default function SigninScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(UserContext); 

  const handleSignin = async () => {
    try {
      const response = await signin({ email, password });
      console.log('Réponse de la connexion:', response);

      const token = response.token;
      if (typeof token !== 'string') {
        throw new Error('Le token doit être une chaîne de caractères.');
      }

      const decodedToken = jwtDecode(token);
      console.log('Décodage du token:', decodedToken);

      const currentUser = decodedToken.user;
      console.log('Utilisateur trouvé:', currentUser);

      const userModel = new UserModel(
        currentUser.id,
        currentUser.fullName || '',
        currentUser.email || '',
        '',
        currentUser.telephone || '',
        currentUser.image || '',
        currentUser.role || 'tourist'
      );

      await login(userModel, token); 

      navigation.navigate('Acceuil', { userId: userModel.id });
    } catch (error) {
      console.error('Erreur lors de la connexion :', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground source={require('../assets/cc.png')} style={styles.background}>
        {/*<Text style={styles.heading}>Connectez-vous !</Text>*/}
        <View style={styles.formContainer}>
          <PaperTextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Entrez votre adresse e-mail"
            keyboardType="email-address"
            mode="outlined"
            label="Email"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' },
            roundness: 100  }}
          />

          <PaperTextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Entrez votre mot de passe"
            secureTextEntry
            mode="outlined"
            label="Mot de passe"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' },
            roundness: 100  }}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignin}>
            <LinearGradient
              colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Se connecter</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <View style={styles.signUpContainer}>
              <Text style={styles.blackText}>Vous n'avez pas de compte ? </Text>
              <LinearGradient
                colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientTextContainer}
              >
                <Text style={styles.gradientText}>S'inscrire</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3FA9ED',
    marginBottom: 16,
    alignItems: 'center',
  },
  input: {
    height: 50,
    marginBottom: 29,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Pour centrer les boutons horizontalement
    alignItems: 'center', // Pour centrer les boutons verticalement
    marginBottom: 10,
  },
  button: {
    marginHorizontal: 5, // Pour ajouter un espace entre les boutons
  },
 /* button: {
    marginTop: 16,
    borderRadius: 200,
    paddingVertical: 12,
    paddingHorizontal: 74,
    height: 64,
    justifyContent: 'center',
  },*/
  gradientButton: {
    borderRadius: 200,
    padding: 15,
    alignItems: 'center',
    width: 320,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  signUpButton: {
    marginTop: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blackText: {
    color: 'black',
  },
  gradientTextContainer: {
    padding: 5,
    borderRadius: 5,
  },
  gradientText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
