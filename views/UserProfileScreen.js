import React, { useEffect, useState, useContext, memo } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';

import { UserContext } from './UserC'; // Assurez-vous que le chemin est correct
import { getPublicationsByUserId } from '../services/PublicationService';

const UserProfileScreen = () => {
  const { user } = useContext(UserContext); // Obtenir l'utilisateur du contexte
  const userId = user ? user.id : null; // Obtenir l'ID utilisateur
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const publicationsResponse = await getPublicationsByUserId(userId); // Récupérer les publications de l'utilisateur
      setPublications(publicationsResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
        <Button title="Réessayer" onPress={fetchData} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.publicationsContainer}>
        <Text style={styles.publicationsTitle}>Publications</Text>
        <FlatList
          data={publications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PublicationCard image={item.image} description={item.description} />
          )}
        />
      </View>
    </View>
  );
};

const PublicationCard = memo(({ image, description }) => (
  <View style={styles.publicationCard}>
    <Image source={{ uri: image }} style={styles.publicationImage} accessibilityLabel="Publication Image" />
    <Text style={styles.publicationDescription}>{description}</Text>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  publicationsContainer: {
    flex: 1,
  },
  publicationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  publicationCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  publicationImage: {
    width: '100%',
    height: 200,
  },
  publicationDescription: {
    padding: 8,
    fontSize: 16,
  },
});

export default UserProfileScreen;
