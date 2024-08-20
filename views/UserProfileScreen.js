import React, { useEffect, useState, useContext, memo } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { UserContext } from './UserC'; // Assurez-vous que le chemin est correct
import { getPublicationsByUserId, deletePublication } from '../services/PublicationService';
import { addLike, getLikeCount } from '../services/LikeService'; // Assurez-vous que le chemin est correct
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

  const handleLike = async (publicationId) => {
    if (!userId) {
      Alert.alert('Erreur', 'Vous devez être connecté pour aimer une publication.');
      return;
    }

    try {
      await addLike(publicationId, userId);
      
      // Mise à jour du nombre de likes
      const updatedLikeCount = await getLikeCount(publicationId);
      setLikeCounts(prev => ({
        ...prev,
        [publicationId]: updatedLikeCount.likeCount,
      }));
      
      Alert.alert('Succès', 'Vous avez aimé la publication.');
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
              onLike={handleLike} // Passez la fonction de like
              likeCount={likeCounts[item.id] || 0} // Passez le nombre de likes
            />
          )}
        />
      </View>
    </View>
  );
};

const PublicationCard = memo(({ userImage, userName, publicationId, publicationImage, publicationDescription, publicationDate, onDelete, navigation, expandedPublicationId, handleExpandComments, onLike, likeCount }) => {
  const [visibleMenu, setVisibleMenu] = useState(null);

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
          onPress={() => onLike(publicationId)}
        >
          <Text style={styles.likeText}>J'aime ({likeCount})</Text>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  publicationDate: {
    fontSize: 14,
    color: '#666',
  },
  publicationImage: {
    width: '100%',
    height: 200,
  },
  publicationDescription: {
    padding: 8,
    fontSize: 16,
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 16,
    color: '#007BFF',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    fontSize: 16,
    color: '#007BFF',
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
});

export default UserProfileScreen;
