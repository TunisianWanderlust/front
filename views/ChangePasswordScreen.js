import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { UserContext } from './UserC';
import { changePassword } from '../services/UserService';

export default function ChangePasswordScreen({ route }) {
  const { userId } = route.params; // Récupérez l'ID de l'utilisateur passé

  const { user } = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      const response = await changePassword(userId, { oldPassword, newPassword, confirmPassword });
      console.log(response);
      // Optionally navigate back or show a success message
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe :', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text>Ancien mot de passe :</Text>
      <TextInput
        value={oldPassword}
        onChangeText={setOldPassword}
        style={styles.input}
        secureTextEntry
      />
      <Text>Nouveau mot de passe :</Text>
      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        secureTextEntry
      />
      <Text>Confirmer le nouveau mot de passe :</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Changer le mot de passe" onPress={handleChangePassword} />
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
