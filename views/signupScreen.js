/*
import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton } from 'react-native-paper';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    setLoading(true);
    setError('');

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
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground source={require('../assets/aa.png')} style={styles.background}>
        <Text style={styles.heading}>Inscrivez-vous !</Text>
        <View style={styles.formContainer}>
          <PaperTextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Entrez votre nom complet"
            mode="outlined"
            label="Nom complet"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
          />

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

          <PaperTextInput
            style={styles.input}
            value={telephone}
            onChangeText={setTelephone}
            placeholder="Entrez votre numéro de téléphone"
            keyboardType="phone-pad"
            mode="outlined"
            label="Numéro de téléphone"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
          />

          <PaperButton
            mode="contained"
            onPress={handleImagePicker}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Choisir une image
          </PaperButton>

          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{ width: 100, height: 100, marginVertical: 10 }}
            />
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {loading ? (
            <ActivityIndicator size="large" color="#6200ee" />
          ) : (
            <PaperButton
              mode="contained"
              onPress={handleSignup}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              S'inscrire
            </PaperButton>
          )}

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('Signin')}
          >
            <Text style={styles.signInButtonText}>
              <Text style={styles.blackText}>Vous avez déjà un compte ? </Text>
              <Text style={styles.blueText}>Se connecter</Text>
            </Text>
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
    alignItems: 'center'
  },
  input: {
    height: 50,
    marginBottom: 29,
    width: '100%',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#0170B8',
    paddingVertical: 12,
    paddingHorizontal: 74,
    borderRadius: 250,
    height: 64,
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButton: {
    marginTop: 20,
  },
  signInButtonText: {
    color: 'black',
  },
  blackText: {
    color: 'black',
  },
  blueText: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 22,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
*/

/*import React, { useState, useContext } from 'react';
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
*/

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
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
      console.log('FormData:', formData);
      const response = await signup(formData);
      console.log('Response from server:', response);

      if (response && response.user && response.user.id) {
        const _id = response.user.id;
        const userModel = new UserModel(_id, fullName, email, '', telephone);
        await login(userModel, "");
        navigation.navigate('Acceuil', { userId: userModel.id });
      } else {
        console.error('Signup failed: Invalid response from server.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
    }
};
  return (
    <ImageBackground source={require('../assets/ok.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        
        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full Name"
            placeholderTextColor="#000"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#000"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#000"
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="call-outline" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={telephone}
            onChangeText={setTelephone}
            placeholder="Phone Number"
            placeholderTextColor="#000"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Choose Image</Text>
          </LinearGradient>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image.uri }}
            style={styles.imagePreview}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

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
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: 'center',
  },
});

/*
const handleSignup = async () => {
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
      console.log('FormData:', formData);
      const response = await signup(formData);
      console.log('Response from server:', response);

      const userId = response?.user?.id ?? null;
      if (userId) {
        const userModel = new UserModel(userId, fullName, email, '', telephone);
        await login(userModel, "");
        navigation.navigate('Acceuil', { userId: userModel.id });
      } else {
        console.error('Signup failed: Invalid response from server.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
    }
};

*/

/*
import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
  ImageBackground,
  ScrollView,
} from 'react-native';
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

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

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
    <ImageBackground source={require('../assets/aa.png')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.background,
              {
                transform: [
                  {
                    translateY: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 125],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.content}>
              <Text style={styles.title}>Sign Up</Text>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                placeholder="Telephone"
                value={telephone}
                onChangeText={setTelephone}
                keyboardType="phone-pad"
              />

              <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
                <Text style={styles.buttonText}>Choose Image</Text>
              </TouchableOpacity>

              {image && (
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: 100, height: 100, marginVertical: 10 }}
                />
              )}

              <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
              <Text style={styles.heading}>Connectez-vous !</Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
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
    padding: 30,
  },
  content: {
    // Padding moved to .background
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
  heading: {
    fontSize: 24, // Adjust font size as needed
    fontWeight: 'bold',
    color: '#3FA9ED', // Adjust text color if needed
    marginBottom: 16,
    alignItems:'center'
     // Space between heading and input field
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});
*/
