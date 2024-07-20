/*import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // Handle sign-in logic here
    console.log('Sign in with email:', email, 'and password:', password);
  };

  return (
    <ImageBackground
      source={require('../assets/sidibou.jpg')}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => {}} // Handle forgot password action
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => {}} // Handle sign-up action
        >
          <Text style={styles.signUpButtonText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 30,
    borderRadius: 10,
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  forgotPasswordButton: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#333',
  },
  signInButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpButton: {
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 14,
    color: '#333',
  },
});


export default SigninScreen;*/
/*
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const SigninScreen = () => {
  return (
    <ImageBackground source={require('../assets/sidibou.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#000"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#000"
            secureTextEntry
          />
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button}>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  forgotPassword: {
    position: 'absolute',
    right: 0,
    bottom: 10,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#3b5998',
  },
  button: {
    marginTop: 20,
  },
  gradient: {
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    color: '#3b5998',
    fontWeight: 'bold',
  },
});

export default SigninScreen;*/
/*
import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const animatedValue = useRef(new Animated.Value(0)).current;

  const handlePan = Animated.event(
    [
      {
        nativeEvent: {
          translationY: animatedValue,
        },
      },
    ],
    {
      useNativeDriver: true,
    }
  );

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.background,
          {
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 200], // Vous pouvez ajuster la valeur 150 selon vos besoins
                }),
              },
            ],
          },
        ]}
        onPanResponderMove={handlePan}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Sign In</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007bff',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30, // Ajout de padding pour que les éléments à l'intérieur soient espacés des bords
  },
  content: {
    // Suppression du padding ici, car il est maintenant dans .background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default SigninScreen;*/

/*
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signin } from '../services/UserService';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from './UserC'; // Assurez-vous que le chemin est correct
import UserModel from '../models/User';

export default function SigninScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(UserContext); // Utilisez seulement 'login'

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

      await login(userModel, token); // Utilisez la fonction de login

      navigation.navigate('Acceuil', { userId: userModel.id });
    } catch (error) {
      console.error('Erreur lors de la connexion :', error.message);
    }
  };

  return (
    <View style={styles.container}>
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

      <Button title="Se connecter" onPress={handleSignin} />
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
*/
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import { signin } from '../services/UserService';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from './UserC'; // Assurez-vous que le chemin est correct
import UserModel from '../models/User';

export default function SigninScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(UserContext); // Utilisez seulement 'login'

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

      await login(userModel, token); // Utilisez la fonction de login

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
        <Text style={styles.heading}>Connectez-vous !</Text>
        <View style={styles.formContainer}>
          <PaperTextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Entrez votre adresse e-mail"
            keyboardType="email-address"
            mode="outlined"
            label="Email"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
          />

          <PaperTextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Entrez votre mot de passe"
            secureTextEntry
            mode="outlined"
            label="Mot de passe"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignin}>
            <LinearGradient
              colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
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
    button: {
    marginTop: 20,
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
