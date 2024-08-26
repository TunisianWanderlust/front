import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ImageBackground, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { getCategoriesByVille } from '../services/CategorieService';
import CategorieModel from '../models/Categorie';

const CategoriesScreen = ({ route, navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { nomVille } = route.params;

  useEffect(() => {
    if (!nomVille) {
      setError('Nom de la ville non fourni.');
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const data = await getCategoriesByVille(nomVille);
        if (Array.isArray(data)) {
          const categoriesList = data.map(
            (item) => new CategorieModel(item._id, item.description, item.image, item.villeId)
          );
          setCategories(categoriesList);
        } else {
          setError(data.message || 'Aucune catégorie trouvée');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [nomVille]);

  const transformImageUrl = (url) => {
    return url.replace('127.0.0.1', '192.168.74.1'); // Remplacez avec l'IP correcte
  };

  const handlePress = (categorie) => {
    navigation.navigate('CategorieDescriptionScreen', {
      ville: nomVille,
      categorie: categorie.description, // Passer la description comme identifiant de catégorie
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <View style={[styles.categoryContainer, index === 0 && styles.firstCategoryContainer]}>
            <ImageBackground
              source={{ uri: transformImageUrl(item.image) }}
              style={styles.categoryImage}
              resizeMode="cover"
            >
              <View style={styles.overlay}>
                <Text style={styles.categoryDescription}>{item.description}</Text>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    margin: 20,
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  firstCategoryContainer: {
    marginTop: 20, // Ajuster cette valeur pour déplacer la première image vers le bas
  },
  categoryImage: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  categoryDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default CategoriesScreen;


/*import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ImageBackground, ActivityIndicator, StyleSheet } from 'react-native';
import { getCategoriesByVille } from '../services/CategorieService';
import CategorieModel from '../models/Categorie';

const CategoriesScreen = ({ route }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { nomVille } = route.params;

  useEffect(() => {
    if (!nomVille) {
      setError('Nom de la ville non fourni.');
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const data = await getCategoriesByVille(nomVille);
        if (Array.isArray(data)) {
          const categoriesList = data.map(
            (item) => new CategorieModel(item._id, item.description, item.image, item.villeId)
          );
          setCategories(categoriesList);
        } else {
          setError(data.message || 'Aucune catégorie trouvée');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [nomVille]);

  const transformImageUrl = (url) => {
    return url.replace('127.0.0.1', '192.168.74.1'); // Replace with the correct IP
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <View style={[styles.categoryContainer, index === 0 && styles.firstCategoryContainer]}>
          <ImageBackground source={{ uri: transformImageUrl(item.image) }} style={styles.categoryImage} resizeMode="cover">
            <View style={styles.overlay}>
              <Text style={styles.categoryDescription}>{item.description}</Text>
            </View>
          </ImageBackground>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    margin: 20,
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  firstCategoryContainer: {
    marginTop: 20, // Adjust this value to move the first image down
  },
  categoryImage: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  categoryDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default CategoriesScreen;*/



/*import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { getCategoriesByVille } from '../services/CategorieService';
import CategorieModel from '../models/Categorie';

const CategoriesScreen = ({ route }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { nomVille } = route.params;

  useEffect(() => {
    if (!nomVille) {
      setError('Nom de la ville non fourni.');
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const data = await getCategoriesByVille(nomVille);
        if (Array.isArray(data)) {
          const categoriesList = data.map(
            (item) => new CategorieModel(item._id, item.description, item.image, item.villeId)
          );
          setCategories(categoriesList);
        } else {
          setError(data.message || 'Aucune catégorie trouvée');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [nomVille]);

  const transformImageUrl = (url) => {
    return url.replace('127.0.0.1', '192.168.74.1'); // Remplacez ceci par l'IP correcte
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.categoryContainer}>
          <Image source={{ uri: transformImageUrl(item.image) }} style={styles.categoryImage} resizeMode="cover" />
          <Text style={styles.categoryDescription}>{item.description}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8, // Ajout de coins arrondis
  },
  categoryDescription: {
    flex: 1,
    fontSize: 16,
    alignSelf: 'center',
  },
});

export default CategoriesScreen;*/
