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
import { useNavigation } from '@react-navigation/native';

export default function UpdateProfileScreen({ route }) {
  const { userId } = route.params;
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

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
    user.password,
    String(user.telephone || ''), 
    user.image || null,
    user.role
  );

  const [fullName, setFullName] = useState(currentUser.fullName || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [telephone, setTelephone] = useState(currentUser.telephone || ''); 
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
      setImage(null);
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

      navigation.navigate('Acceuil');
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#507BE4', '#37A9B4', '#5CC7D2', '#89A6ED']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
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
          <Text style={styles.title}>Mettre à jour votre profil </Text>

          <PaperTextInput
            style={styles.input}
            placeholder="Nom et prénom"
            value={fullName}
            onChangeText={setFullName}
            label="Nom et prénom"
            mode="outlined"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' },
            roundness: 100 }}
          />

          <PaperTextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            label="E-mail"
            mode="outlined"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' },
            roundness: 100 }}
          />

          <PaperTextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            maxLength={15}
            label="Numéro de téléphone"
            mode="outlined"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' },
            roundness: 100 }}
          />

<View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
            <LinearGradient
              colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Choose Image</Text>
            </LinearGradient>
          </TouchableOpacity>
          </View>

          {/* Image display */}
          {image && (
            <View style={styles.centeredImageContainer}>
              <Image
                source={{ uri: image }}
                style={styles.selectedImage}
              />
            </View>
          )}
 <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
            <LinearGradient
              colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Mettre à jour </Text>
            </LinearGradient>
          </TouchableOpacity>
          </View>
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
  content: {},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
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
  centeredImageContainer: {
    alignItems: 'center',
    marginVertical: 20,  // Space between image and other elements
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
