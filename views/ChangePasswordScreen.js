import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity, 
} from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { UserContext } from './UserC';
import { changePassword } from '../services/UserService';

// Composants d'icônes avec paramètres par défaut
const LockIcon = ({ color = "#507BE4", size = 20 }) => (
  <Icon name="lock" size={size} color={color} />
);

const EyeIcon = ({ onPress, isVisible, color = "#507BE4", size = 20 }) => (
  <TouchableOpacity onPress={onPress}>
    <Icon name={isVisible ? "visibility" : "visibility-off"} size={size} color={color} />
  </TouchableOpacity>
);

export default function ChangePasswordScreen({ route, navigation }) {
  const { userId } = route.params;
  const { user } = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChangePassword = async () => {
    try {
      const response = await changePassword(userId, { oldPassword, newPassword, confirmPassword });
      console.log(response);
      navigation.navigate('Acceuil'); // Navigate to Acceuil after success
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe :', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#507BE4', '#37A9B4', '#5CC7D2', '#89A6ED']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
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
          <Text style={styles.title}>Changer le mot de passe</Text>

          <PaperTextInput
            style={styles.input}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Ancien mot de passe"
            secureTextEntry={!passwordVisible} 
            mode="outlined"
            label="Ancien mot de passe"
            left={<PaperTextInput.Icon icon={() => <LockIcon />} />}
            right={<PaperTextInput.Icon icon={() => <EyeIcon onPress={() => setPasswordVisible(!passwordVisible)} isVisible={passwordVisible} />} />}
            theme={{ colors: { primary: '#507BE4', underlineColor: 'transparent' }, roundness: 100 }}
          />

          <PaperTextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nouveau mot de passe"
            secureTextEntry={!passwordVisible} 
            mode="outlined"
            label="Nouveau mot de passe"
            left={<PaperTextInput.Icon icon={() => <LockIcon />} />}
            right={<PaperTextInput.Icon icon={() => <EyeIcon onPress={() => setPasswordVisible(!passwordVisible)} isVisible={passwordVisible} />} />}
            theme={{ colors: { primary: '#507BE4', underlineColor: 'transparent' }, roundness: 100 }}
          />

          <PaperTextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirmer le nouveau mot de passe"
            secureTextEntry={!passwordVisible} 
            mode="outlined"
            label="Confirmer le nouveau mot de passe"
            left={<PaperTextInput.Icon icon={() => <LockIcon />} />}
            right={<PaperTextInput.Icon icon={() => <EyeIcon onPress={() => setPasswordVisible(!passwordVisible)} isVisible={passwordVisible} />} />}
            theme={{ colors: { primary: '#507BE4', underlineColor: 'transparent' }, roundness: 100 }}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
              <LinearGradient
                colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Changer votre mot de passe</Text>
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
    marginTop: 50,
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
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textAlign: 'center',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});
