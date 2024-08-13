import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
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
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
        <TouchableOpacity style={styles.postButton} onPress={() => navigation.navigate('CreatePublication')}>
          <Text style={styles.postButtonText}>Créer une publication</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={publications}
        keyExtractor={(item) => (item._id ? item._id.toString() : Math.random().toString())} // Handle undefined IDs
        renderItem={({ item }) => (
          <View style={styles.publicationCard}>
            <View style={styles.cardHeader}>
              {item.userId.image ? (
                <Image source={{ uri: item.userId.image.replace('127.0.0.1', '192.168.1.21') }} style={styles.userImage} />
              ) : (
                <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.userImage} />
              )}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.userId.fullName}</Text>
                <Text style={styles.publicationDate}>{new Date(item.datePub).toLocaleDateString()}</Text>
              </View>
            </View>
            {item.image ? (
              <Image 
                source={{ uri: item.image.replace('127.0.0.1', '192.168.1.21') }} 
                style={styles.publicationImage}
                onError={(e) => console.log('Erreur lors du chargement de l\'image :', e.nativeEvent.error)} 
              />
            ) : (
              <Text style={styles.noImageText}>Aucune image disponible</Text>
            )}
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
      <Button
        title="Retour à l'accueil"
        onPress={() => navigation.goBack()}
        color="#007bff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  postButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  publicationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  publicationDate: {
    color: '#666',
    fontSize: 14,
  },
  publicationImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    marginVertical: 8,
  },
  noImageText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
