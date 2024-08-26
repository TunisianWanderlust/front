import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { getDescriptionsByVilleAndCategorie } from '../services/CategorieDescriptioService';

// Fonction pour transformer l'URL de l'image
const transformImageUrl = (url) => {
  return url ? url.replace('127.0.0.1', '192.168.74.1') : ''; // Remplacez avec l'IP correcte
};

const CategorieDescriptionScreen = ({ route }) => {
  const { ville, categorie } = route.params; // Obtention des paramètres de la route
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDescriptions = async () => {
      try {
        const data = await getDescriptionsByVilleAndCategorie(ville, categorie);
        setDescriptions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDescriptions();
  }, [ville, categorie]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  if (error) {
    return <Text style={styles.error}>{`Erreur: ${error}`}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={descriptions}
        keyExtractor={item => item._id ? item._id.toString() : Math.random().toString()} // Fallback to a random string if '_id' is missing
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image
                  source={{ uri: transformImageUrl(item.image) }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder} />
              )}
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{item.nom}</Text>
              </View>
            </View>
            <ScrollView style={styles.descriptionContainer}>
              <Text style={styles.description}>{item.description}</Text>
            </ScrollView>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    height: 300, // Fixed height for the card
  },
  imageContainer: {
    position: 'relative',
    height: 200, // Fixed height for image
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  nameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for better readability
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
  },
  descriptionContainer: {
    flex: 1, // Allow description to grow and use remaining space
  },
  description: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10, // Add padding for better readability
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
    fontSize: 18,
  },
});

export default CategorieDescriptionScreen;
