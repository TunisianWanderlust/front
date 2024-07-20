import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity, // Importing TouchableOpacity
} from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { UserContext } from './UserC';
import { changePassword } from '../services/UserService';

export default function ChangePasswordScreen({ route }) {
  const { userId } = route.params;

  const { user } = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe :', error.message);
    }
  };

  return (
    <LinearGradient
    colors={[ '#507BE4','#37A9B4','#5CC7D2','#89A6ED',  ]}
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
          <Text style={styles.title}>Change Password</Text>

          <PaperTextInput
            style={styles.input}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder="Ancien mot de passe"
            secureTextEntry
            mode="outlined"
            label="Ancien mot de passe"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
          />

          <PaperTextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nouveau mot de passe"
            secureTextEntry
            mode="outlined"
            label="Nouveau mot de passe"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
          />

          <PaperTextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirmer le nouveau mot de passe"
            secureTextEntry
            mode="outlined"
            label="Confirmer le nouveau mot de passe"
            theme={{ colors: { primary: '#6200ee', underlineColor: 'transparent' } }}
          />

          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <LinearGradient
              colors={['#37A9B4', '#5CC7D2', '#89A6ED', '#507BE4']}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Changer le mot de passe</Text>
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
  button: {
    marginTop: 20,
  },
  gradientButton: {
    borderRadius: 200,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
