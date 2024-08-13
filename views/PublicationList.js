import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import { getPublicationsByNomVille } from '../services/PublicationService';
import { getCommentsByPublication, addComment } from '../services/CommentService';
import { UserContext } from './UserC';

export default function PublicationList({ route, navigation }) {
  const { nomVille } = route.params;
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPublicationId, setExpandedPublicationId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState('');

  const { user } = useContext(UserContext); // Utilisez le contexte pour obtenir les informations de l'utilisateur connecté

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

  const handleExpandComments = async (publicationId) => {
    if (expandedPublicationId === publicationId) {
      setExpandedPublicationId(null); // Collapse if already expanded
      return;
    }

    try {
      const data = await getCommentsByPublication(publicationId);
      setComments(prev => ({ ...prev, [publicationId]: data }));
      setExpandedPublicationId(publicationId); // Expand comments for this publication
    } catch (err) {
      console.error('Erreur lors de la récupération des commentaires :', err.message);
    }
  };

  const handleAddComment = async (publicationId) => {
    if (!commentText.trim()) {
      alert('Veuillez entrer un commentaire');
      return;
    }

    if (!user) {
      alert('Utilisateur non connecté');
      return;
    }

    const newComment = {
      publicationId,
      text: commentText,
      userId: user.id // Utilisez l'ID de l'utilisateur connecté
    };

    try {
      await addComment(newComment);
      setCommentText(''); // Clear the input field
      // Refetch comments for the updated publication
      await handleExpandComments(publicationId);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire :', err.message);
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

            {/* Like and Comment Section */}
            <View style={styles.interactionRow}>
              <TouchableOpacity style={styles.likeButton}>
                <Text style={styles.likeText}>J'aime</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commentButton}
                onPress={() => handleExpandComments(item._id)}
              >
                <Text style={styles.commentText}>Commenter</Text>
              </TouchableOpacity>
            </View>

            {/* Display Comments */}
            {expandedPublicationId === item._id && comments[item._id] && (
              <View style={styles.commentsSection}>
                {comments[item._id].length > 0 ? (
                  comments[item._id].map(comment => (
                    <View key={comment._id} style={styles.commentCard}>
                      <View style={styles.commentHeader}>
                        {comment.userId.image ? (
                          <Image source={{ uri: comment.userId.image.replace('127.0.0.1', '192.168.1.21') }} style={styles.commentUserImage} />
                        ) : (
                          <Image source={{ uri: 'https://via.placeholder.com/30' }} style={styles.commentUserImage} />
                        )}
                        <Text style={styles.commentUserName}>{comment.userId.fullName}</Text>
                      </View>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noCommentsText}>Aucun commentaire</Text>
                )}
                <View style={styles.addCommentSection}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Ajouter un commentaire..."
                    value={commentText}
                    onChangeText={setCommentText}
                  />
                  <Button title="Envoyer" onPress={() => handleAddComment(item._id)} />
                </View>
              </View>
            )}
          </View>
        )}
      />
      <TouchableOpacity style={styles.createPostButton} onPress={() => navigation.navigate('CreatePublication')}>
        <Text style={styles.createPostButtonText}>Créer une publication</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.goBackButtonText}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  publicationCard: {
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
    padding: 10,
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
    fontWeight: 'bold',
  },
  publicationDate: {
    color: '#888',
    fontSize: 12,
  },
  publicationImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  noImageText: {
    color: '#888',
    fontStyle: 'italic',
  },
  description: {
    marginBottom: 10,
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  likeButton: {
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,
  },
  likeText: {
    color: '#000',
  },
  commentButton: {
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,
  },
  commentText: {
    color: '#000',
  },
  commentsSection: {
    marginTop: 10,
  },
  commentCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUserName: {
    fontWeight: 'bold',
  },
  commentText: {
    marginTop: 5,
  },
  noCommentsText: {
    color: '#888',
  },
  addCommentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  createPostButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  createPostButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  goBackButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  goBackButtonText: {
    color: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
