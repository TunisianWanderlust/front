import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getPublicationsByNomVille, deletePublication } from '../services/PublicationService';
import { addLike, removeLike, getLikeCount } from '../services/LikeService'; // Import removeLike
import { UserContext } from './UserC';
import { Menu, Divider, IconButton } from 'react-native-paper';
import CommentSection from './Comment';

export default function PublicationList({ route, navigation }) {
  const { nomVille } = route.params;
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPublicationId, setExpandedPublicationId] = useState(null);
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [likeCounts, setLikeCounts] = useState({});
  const [userLikes, setUserLikes] = useState({}); // Track user likes

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await getPublicationsByNomVille(nomVille);
        setPublications(data);

        const likeCountsData = {};
        const userLikesData = {};
        for (const publication of data) {
          const likeCount = await getLikeCount(publication._id);
          likeCountsData[publication._id] = likeCount.likeCount;
          if (user) {
            const hasLiked = await checkUserLike(publication._id, user.id); // Function to check if the user has liked
            userLikesData[publication._id] = hasLiked;
          }
        }
        setLikeCounts(likeCountsData);
        setUserLikes(userLikesData);
      } catch (err) {
        setError('Erreur lors de la récupération des publications : ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [nomVille, user]);

  const handleDeletePublication = async (publicationId) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette publication ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              await deletePublication(publicationId);
              setPublications(prev => prev.filter(pub => pub._id !== publicationId));
              setLikeCounts(prev => {
                const newCounts = { ...prev };
                delete newCounts[publicationId];
                return newCounts;
              });
              setUserLikes(prev => {
                const newLikes = { ...prev };
                delete newLikes[publicationId];
                return newLikes;
              });
            } catch (err) {
              console.error('Erreur lors de la suppression de la publication :', err.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleExpandComments = (publicationId) => {
    setExpandedPublicationId(expandedPublicationId === publicationId ? null : publicationId);
  };

  const handleLikeDislike = async (publicationId) => {
    if (!user) {
      Alert.alert('Vous devez être connecté pour liker ou ne pas liker une publication.');
      return;
    }

    try {
      if (userLikes[publicationId]) {
        // User has already liked, so remove the like
        await removeLike(publicationId, user.id);
        Alert.alert('Succès', 'Vous avez retiré votre like.');
        setLikeCounts(prev => ({
          ...prev,
          [publicationId]: (prev[publicationId] || 0) - 1
        }));
      } else {
        // User has not liked yet, so add the like
        const result = await addLike(publicationId, user.id);
        if (result.message === 'Vous avez déjà aimé cette publication') {
          Alert.alert('Déjà aimé', result.message);
        } else {
          Alert.alert('Succès', 'Vous avez aimé cette publication.');
          setLikeCounts(prev => ({
            ...prev,
            [publicationId]: (prev[publicationId] || 0) + 1
          }));
        }
      }

      // Update userLikes state
      setUserLikes(prev => ({
        ...prev,
        [publicationId]: !prev[publicationId]
      }));
    } catch (error) {
      console.error('Erreur lors de la gestion du like/dislike :', error.message);
      Alert.alert('Erreur', 'Impossible de mettre à jour le like.');
    }
  };

  const checkUserLike = async (publicationId, userId) => {
    // Function to check if the user has liked a publication
    // Implement this function in your LikeService
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={publications}
        keyExtractor={(item) => (item._id ? item._id.toString() : Math.random().toString())}
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

            <View style={styles.interactionRow}>
              <TouchableOpacity 
                style={styles.likeButton}
                onPress={() => handleLikeDislike(item._id)}
              >
                <Text style={styles.likeText}>
                  {userLikes[item._id] ? 'Je n\'aime plus' : 'J\'aime'} ({likeCounts[item._id] || 0})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commentButton}
                onPress={() => handleExpandComments(item._id)}
              >
                <Text style={styles.commentText}>Commenter</Text>
              </TouchableOpacity>

              {user && user.id === item.userId._id && (
                <Menu
                  visible={visibleMenu === item._id}
                  onDismiss={() => setVisibleMenu(null)}
                  anchor={<IconButton icon="dots-vertical" size={20} onPress={() => setVisibleMenu(item._id)} />}
                >
                  <Menu.Item onPress={() => { setVisibleMenu(null); navigation.navigate('AddPublication', { publicationId: item._id }); }} title="Modifier" />
                  <Divider />
                  <Menu.Item onPress={() => { setVisibleMenu(null); handleDeletePublication(item._id); }} title="Supprimer" />
                </Menu>
              )}
            </View>

            <CommentSection
              publicationId={item._id}
              expandedPublicationId={expandedPublicationId}
              handleExpandComments={() => handleExpandComments(item._id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  publicationCard: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  publicationDate: {
    color: 'gray',
    fontSize: 12,
  },
  publicationImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  noImageText: {
    color: 'gray',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    marginBottom: 10,
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  likeText: {
    color: '#333',
  },
  commentButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  commentText: {
    color: '#333',
  },
});


