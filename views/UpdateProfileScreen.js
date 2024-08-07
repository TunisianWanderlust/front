import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { UserContext } from './UserC';
import { updateProfile } from '../services/UserService';
import { launchImageLibrary } from 'react-native-image-picker';
import UserModel from '../models/User';
import { useNavigation } from '@react-navigation/native'; // Importez le hook useNavigation

export default function UpdateProfileScreen({ route }) {
  const { userId } = route.params;
  const { user } = useContext(UserContext);
  const navigation = useNavigation(); // Utilisez le hook useNavigation

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const currentUser = new UserModel(
    user.id,
    user.fullName,
    user.email,
    String(user.telephone || ''),
    user.image || null,
    user.role
  );

  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [telephone, setTelephone] = useState(String(currentUser.telephone || ''));
  const [image, setImage] = useState(currentUser.image || null);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (user && user.image && user.image.startsWith('http')) {
      setImage(user.image);
    } else {
      setImage(null); // Utiliser une image par défaut si l'URL est incorrecte
    }
  }, [user]);

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response.assets[0].uri);
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
          uri: image,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }

      const successMessage = await updateProfile(userId, formData, user.token);
      console.log(successMessage);

      // Navigation vers AcceuilScreen après la mise à jour
      navigation.navigate('Acceuil');
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#507BE4', '#37A9B4', '#5CC7D2', '#89A6ED']}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image
          source={image ? { uri: image } : require('../assets/userr.png')}
          style={styles.userImage}
        />
      </View>
      <Animated.View
        style={[
          styles.background,
          {
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 120],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Update Profile</Text>

          <PaperTextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            label="Full Name"
            mode="outlined"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
          />

          <PaperTextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            label="Email"
            mode="outlined"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
          />

          <PaperTextInput
            style={styles.input}
            placeholder="Phone Number"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            maxLength={15}
            label="Phone Number"
            mode="outlined"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
          />

          <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
            <LinearGradient
              colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Choose Image</Text>
            </LinearGradient>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100, marginVertical: 10 }}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <LinearGradient
              colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Update Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
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
    // Styles pour le conteneur de contenu
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginBottom: 10,
  },
  gradientButton: {
    borderRadius: 200,
    padding: 15,
    width: 320,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});
