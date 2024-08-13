import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Button } from 'react-native';
import { getPublicationsByNomVille } from '../services/PublicationService'; // Adjust the import if necessary

export default function PublicationList({ route, navigation }) {
  const { nomVille } = route.params;
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await getPublicationsByNomVille(nomVille);
        setPublications(data);
      } catch (err) {
        setError('Erreur lors de la récupération des publications : ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [nomVille]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={publications}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())} // Handle undefined IDs
        renderItem={({ item }) => (
          <View style={styles.publicationContainer}>
            <Text style={styles.date}>{new Date(item.datePub).toLocaleDateString()}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {item.image ? (
              <Image 
                source={{ uri: item.image.replace('127.0.0.1', '192.168.1.21') }} 
                style={styles.image}
                onError={(e) => console.log('Erreur lors du chargement de l\'image :', e.nativeEvent.error)} 
              />
            ) : (
              <Text>Aucune image disponible</Text>
            )}

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  publicationContainer: {
    marginBottom: 16,
  },
  image: {
    width: '80%',
    height: 200,
    resizeMode: 'cover',
  },
  description: {
    fontSize: 16,
    marginVertical: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: 'red',
  },
});
