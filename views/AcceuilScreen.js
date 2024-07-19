import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { UserContext } from './UserC';

export default function AcceuilScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);

  if (!user) {
    console.log('Aucun utilisateur trouvé dans le contexte.');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  console.log('Utilisateur trouvé:', user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue, {user.fullName}!</Text>
      <Button
        title="Mettre à jour le profil"
        onPress={() => navigation.navigate('UpdateProfile', { userId: user.id })}
      />
      <Button
        title="Changer le mot de passe"
        onPress={() => navigation.navigate('ChangePassword', { userId: user.id })}
      />
      <Button
        title="Se déconnecter"
        onPress={async () => {
          await logout();
          navigation.navigate('Signin'); // Vérifiez que le nom de l'écran de connexion est correct
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});


/*import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { UserContext } from './UserC'; // Assurez-vous que le chemin est correct

export default function AcceuilScreen({ navigation }) {
  const { user } = useContext(UserContext); // Extrait l'utilisateur du contexte

  if (!user) {
    console.log('Aucun utilisateur trouvé dans le contexte.');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  console.log('Utilisateur trouvé:', user); // Affiche l'utilisateur dans la console

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue, {user.fullName}!</Text>
      <Button
        title="Mettre à jour le profil"
        onPress={() => navigation.navigate('UpdateProfile', { userId: user.id })}
      />
      <Button
        title="Changer le mot de passe"
        onPress={() => navigation.navigate('ChangePassword', { userId: user.id })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
*/

/*import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { UserContext } from './UserC'; // Assurez-vous que le chemin est correct

export default function AcceuilScreen({ navigation }) {
  const { user } = useContext(UserContext); // Extrait l'utilisateur du contexte

  // Vérifiez si l'utilisateur est défini
  if (!user) {
    console.log('Aucun utilisateur trouvé dans le contexte.');
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  console.log('Utilisateur trouvé:', user); // Affiche l'utilisateur dans la console

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue, {user.fullName}!</Text>
      <Button
        title="Mettre à jour le profil"
        onPress={() => navigation.navigate('UpdateProfile', { userId: user.id })} // Passe l'ID de l'utilisateur
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});*/
