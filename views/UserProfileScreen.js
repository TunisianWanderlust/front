import React, { useEffect, useState, useContext, memo } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { UserContext } from './UserC';
import { getPublicationsByUserId, deletePublication } from '../services/PublicationService';
import { addLike, getLikeCount, removeLike } from '../services/LikeService';
import { Menu, IconButton, Divider } from 'react-native-paper';
import CommentSection from './Comment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon

const UserProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(UserContext);
  const userId = user ? user.id : null;
  const [publications, setPublications] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPublicationId, setExpandedPublicationId] = useState(null);
  const [visibleMenu, setVisibleMenu] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const publicationsResponse = await getPublicationsByUserId(userId);
      const likeCountsData = {};
      for (const publication of publicationsResponse) {
        const likeCountResponse = await getLikeCount(publication.id);
        likeCountsData[publication.id] = likeCountResponse.likeCount;
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
              setPublications((prev) => prev.filter((pub) => pub.id !== publicationId));
              setLikeCounts((prev) => {
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

      const updatedLikeCount = await getLikeCount(publicationId);
      setLikeCounts((prev) => ({
        ...prev,
        [publicationId]: updatedLikeCount.likeCount,
      }));

      Alert.alert('Succès', isLiked ? 'Vous avez retiré votre like.' : 'Vous avez aimé la publication.');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  const handleMenuOption = async (option) => {
    setVisibleMenu(false);
    switch (option) {
      case 'UpdateProfile':
        navigation.navigate('UpdateProfile', { userId: user.id });
        break;
      case 'ChangePassword':
        navigation.navigate('ChangePassword', { userId: user.id });
        break;
      case 'Logout':
        await logout();
        navigation.navigate('Signin');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.userHeader}>
          <Image
            source={{ uri: user.image.replace('127.0.0.1', '192.168.1.21') }}
            style={styles.userImage}
            onError={(e) => console.log('Erreur lors du chargement de l\'image :', e.nativeEvent.error)}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <View style={styles.menuContainer}>
            <Menu
              visible={visibleMenu}
              onDismiss={() => setVisibleMenu(false)}
              anchor={<IconButton icon="dots-vertical" size={24} onPress={() => setVisibleMenu(!visibleMenu)} />}
            >
              <Menu.Item onPress={() => handleMenuOption('UpdateProfile')} title="Mettre à jour le profil" />
              <Divider />
              <Menu.Item onPress={() => handleMenuOption('ChangePassword')} title="Changer le mot de passe" />
              <Divider />
              <Menu.Item onPress={() => handleMenuOption('Logout')} title="Se déconnecter" />
            </Menu>
          </View>
        </View>
      }
      data={publications}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponentStyle={styles.headerComponent}
      renderItem={({ item }) => (
        <PublicationCard
          userImage={user.image}
          userName={user.fullName}
          publicationId={item.id}
          publicationImage={item.image}
          publicationDescription={item.description}
          publicationDate={item.datePub}
          onDelete={handleDeletePublication}
          navigation={navigation}
          expandedPublicationId={expandedPublicationId}
          handleExpandComments={() => handleExpandComments(item.id)}
          onLikeToggle={(isLiked) => handleLikeToggle(item.id, isLiked)}
          likeCount={likeCounts[item.id] || 0}
        />
      )}
    />
  );
};

const PublicationCard = memo(({ userImage, userName, publicationId, publicationImage, publicationDescription, publicationDate, onDelete, navigation, expandedPublicationId, handleExpandComments, onLikeToggle, likeCount }) => {
  const [visibleMenu, setVisibleMenu] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const checkLikeStatus = async () => {
      try {
        const likeCountResponse = await getLikeCount(publicationId);
        setIsLiked(likeCountResponse.userHasLiked);
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

  const animatedStyle = {
    opacity: animationValue,
    transform: [
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.publicationCard, animatedStyle]}>
      <View style={styles.cardHeader}>
        <Image 
          source={{ uri: userImage.replace('127.0.0.1', '192.168.1.21') }} 
          style={styles.userIma}
          onError={(e) => console.log('Erreur lors du chargement de l\'image :', e.nativeEvent.error)} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.publicationDate}>
            {format(new Date(publicationDate), "dd MMMM", { locale: fr })}
          </Text>
        </View>
        <Menu
          visible={visibleMenu === publicationId}
          onDismiss={() => setVisibleMenu(null)}
          anchor={<IconButton icon="dots-vertical" size={20} onPress={() => setVisibleMenu(publicationId)} />}
        >
          <Menu.Item onPress={() => onDelete(publicationId)} title="Supprimer" />
        </Menu>
      </View>
      <Image 
        source={{ uri: publicationImage.replace('127.0.0.1', '192.168.1.21') }} 
        style={styles.publicationImage}
        onError={(e) => console.log('Erreur lors du chargement de l\'image :', e.nativeEvent.error)} 
      />
      <Text style={styles.publicationDescription}>{publicationDescription}</Text>
      <View style={styles.interactionRow}>
        <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
          <Text style={styles.likeButtonText}>{isLiked ? '❤️' : '♡'} {likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => handleExpandComments(publicationId)}
        >
          <Icon 
            name="comment" 
            size={24} 
            color="#007bff" 
          />
        </TouchableOpacity>
      </View>
      <CommentSection
        publicationId={publicationId}
        expandedPublicationId={expandedPublicationId}
        handleExpandComments={() => handleExpandComments(publicationId)}
      />
    </Animated.View>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  userIma: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
    
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  publicationsContainer: {
    flex: 1,
    padding: 16,
    
  },
  publicationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Assurez-vous que le Picker est aligné à droite
    alignItems: 'right',
    
  },
  publicationDate: {
    color: '#666',
  },

  publicationCard: {
    backgroundColor: '#fff',
   // borderRadius: 8,
    marginBottom: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  /*cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },*/
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Change this to 'flex-start' to align items to the start (left)
  },
  
  publicationImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 16,
  },
  publicationDescription: {
    fontSize: 16,
    color: '#333',
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  likeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    //color: '#e91e63',
    marginLeft: 5,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  commentText: {
    fontSize: 16,
    color: '#007AFF',
  },
  picker: {
    width: 150,
  },
  placeholder: {
    width: 155,
    color: '#007AFF', // Changer la couleur du texte du placeholder ici
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
  subMenuItem: {
    fontSize: 14,
  },

});

export default UserProfileScreen;


