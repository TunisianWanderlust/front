import React, { useEffect, useState, useContext, memo } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from './UserC'; // Assurez-vous que le chemin est correct
import { getPublicationsByUserId, deletePublication } from '../services/PublicationService';
import { addLike, getLikeCount, removeLike } from '../services/LikeService'; // Assurez-vous que le chemin est correct
import { Menu, IconButton, Divider } from 'react-native-paper';
import CommentSection from './Comment'; // Importer le composant CommentSection

const UserProfileScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Obtenir l'utilisateur du contexte
  const userId = user ? user.id : null; // Obtenir l'ID utilisateur
  const [publications, setPublications] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPublicationId, setExpandedPublicationId] = useState(null); // Gestion des commentaires étendus

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const publicationsResponse = await getPublicationsByUserId(userId); // Récupérer les publications de l'utilisateur
      console.log('Publications Response:', publicationsResponse); // Vérifiez les données des publications

      const likeCountsData = {};
      for (const publication of publicationsResponse) {
        const likeCountResponse = await getLikeCount(publication.id); // Obtenez le nombre de likes pour chaque publication
        likeCountsData[publication.id] = likeCountResponse.likeCount; // Supposons que votre réponse contient un champ likeCount
      }
      
      setPublications(publicationsResponse);
      setLikeCounts(likeCountsData);
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
              setPublications(prev => prev.filter(pub => pub.id !== publicationId));
              setLikeCounts(prev => {
                const newCounts = { ...prev };
                delete newCounts[publicationId];
                return newCounts;
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

  const handleLikeToggle = async (publicationId, isLiked) => {
    if (!userId) {
      Alert.alert('Erreur', 'Vous devez être connecté pour aimer une publication.');
      return;
    }

    try {
      if (isLiked) {
        await removeLike(publicationId, userId);
      } else {
        await addLike(publicationId, userId);
      }

      // Mise à jour du nombre de likes
      const updatedLikeCount = await getLikeCount(publicationId);
      setLikeCounts(prev => ({
        ...prev,
        [publicationId]: updatedLikeCount.likeCount,
      }));

      Alert.alert('Succès', isLiked ? 'Vous avez retiré votre like.' : 'Vous avez aimé la publication.');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.publicationsContainer}>
        <Text style={styles.publicationsTitle}>Publications</Text>
        <FlatList
          data={publications}
          keyExtractor={(item) => item.id.toString()} // Utilisez l'ID de la publication
          renderItem={({ item }) => (
            <PublicationCard
              userImage={user.image}
              userName={user.fullName}
              publicationId={item.id}
              publicationImage={item.image}
              publicationDescription={item.description}
              publicationDate={item.datePub}
              onDelete={handleDeletePublication} // Passez la fonction de suppression
              navigation={navigation} // Passez la navigation prop
              expandedPublicationId={expandedPublicationId}
              handleExpandComments={() => handleExpandComments(item.id)} // Ajoutez la fonction d'expansion
              onLikeToggle={(isLiked) => handleLikeToggle(item.id, isLiked)} // Passez la fonction de like toggle
              likeCount={likeCounts[item.id] || 0} // Passez le nombre de likes
            />
          )}
        />
      </View>
    </View>
  );
};

const PublicationCard = memo(({ userImage, userName, publicationId, publicationImage, publicationDescription, publicationDate, onDelete, navigation, expandedPublicationId, handleExpandComments, onLikeToggle, likeCount }) => {
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Initialisez l'état du like pour cette publication
    const checkLikeStatus = async () => {
      try {
        const likeCountResponse = await getLikeCount(publicationId);
        setIsLiked(likeCountResponse.userHasLiked); // Déterminez si l'utilisateur a aimé ou non
      } catch (error) {
        console.error('Erreur lors de la récupération du statut de like :', error.message);
      }
    };
    checkLikeStatus();
  }, [publicationId]);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    onLikeToggle(isLiked);
  };

  return (
    <View style={styles.publicationCard}>
      <View style={styles.cardHeader}>
        <Image 
          source={{ uri: userImage.replace('127.0.0.1', '192.168.1.21') }} 
          style={styles.userImage}
          onError={(e) => console.log('Erreur lors du chargement de l\'image :', e.nativeEvent.error)} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.publicationDate}>{new Date(publicationDate).toLocaleDateString()}</Text>
        </View>
        <Menu
          visible={visibleMenu === publicationId}
          onDismiss={() => setVisibleMenu(null)}
          anchor={<IconButton icon="dots-vertical" size={20} onPress={() => setVisibleMenu(publicationId)} />}
        >
          <Menu.Item
            onPress={() => {
              setVisibleMenu(null);
              navigation.navigate('AddPublication', { publicationId });
            }}
            title="Modifier"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setVisibleMenu(null);
              onDelete(publicationId);
            }}
            title="Supprimer"
          />
        </Menu>
      </View>
      <Image 
        source={{ uri: publicationImage.replace('127.0.0.1', '192.168.1.21') }} 
        style={styles.publicationImage}
        onError={(e) => console.log('Erreur lors du chargement de l\'image :', e.nativeEvent.error)} 
      />
      <Text style={styles.publicationDescription}>{publicationDescription}</Text>
      <View style={styles.interactionRow}>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={toggleLike}
        >
          <Text style={styles.likeText}>{isLiked ? `Je n'aime plus (${likeCount})` : `J'aime (${likeCount})`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => handleExpandComments(publicationId)}
        >
          <Text style={styles.commentText}>Commenter</Text>
        </TouchableOpacity>
      </View>
      <CommentSection
        publicationId={publicationId}
        expandedPublicationId={expandedPublicationId}
        handleExpandComments={() => handleExpandComments(publicationId)}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginTop: 20,
  },
  publicationsContainer: {
    flex: 1,
  },
  publicationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  publicationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  publicationDate: {
    fontSize: 12,
    color: '#666',
  },
  menuButton: {
    padding: 5,
  },
  menuButtonText: {
    fontSize: 18,
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    padding: 10,
  },
  menuItemText: {
    fontSize: 16,
  },
  publicationImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  publicationDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  likeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  likeText: {
    color: '#fff',
    fontSize: 16,
  },
  commentButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    backgroundColor: '#28a745',
    alignItems: 'center',
  },
  commentText: {
    color: '#fff',
    fontSize: 16,
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default UserProfileScreen;
