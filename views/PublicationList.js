import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { getPublicationsByNomVille, deletePublication } from '../services/PublicationService';
import { getCommentsByPublication, addComment, deleteComment, updateComment } from '../services/CommentService';
import { UserContext } from './UserC';

export default function PublicationList({ route, navigation }) {
  const { nomVille } = route.params;
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPublicationId, setExpandedPublicationId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  const { user } = useContext(UserContext);

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
      setExpandedPublicationId(null);
      return;
    }

    try {
      const data = await getCommentsByPublication(publicationId);
      setComments(prev => ({ ...prev, [publicationId]: data }));
      setExpandedPublicationId(publicationId);
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
      userId: user.id
    };

    try {
      await addComment(newComment);
      setCommentText('');
      await handleExpandComments(publicationId);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire :', err.message);
    }
  };

  const handleDeleteComment = async (commentId, publicationId) => {
    try {
      await deleteComment(commentId);
      await handleExpandComments(publicationId);
    } catch (err) {
      console.error('Erreur lors de la suppression du commentaire :', err.message);
    }
  };

  const handleEditComment = async (commentId, publicationId) => {
    if (!editCommentText.trim()) {
      alert('Veuillez entrer du texte pour le commentaire');
      return;
    }

    try {
      await updateComment(commentId, editCommentText);
      setEditingCommentId(null);
      setEditCommentText('');
      await handleExpandComments(publicationId);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du commentaire :', err.message);
    }
  };

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
            } catch (err) {
              console.error('Erreur lors de la suppression de la publication :', err.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
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

              {/* Update Publication Button */}
              {user && user.id === item.userId._id && (
                <>
                  <TouchableOpacity
                    style={styles.updatePublicationButton}
                    onPress={() => navigation.navigate('AddPublication', { publicationId: item._id })}
                  >
                    <Text style={styles.updatePublicationButtonText}>Modifier</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deletePublicationButton}
                    onPress={() => handleDeletePublication(item._id)}
                  >
                    <Text style={styles.deletePublicationButtonText}>Supprimer</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Comments Section */}
            {expandedPublicationId === item._id && (
              <View style={styles.commentsSection}>
                {comments[item._id] && comments[item._id].length > 0 ? (
                  comments[item._id].map((comment) => (
                    <View key={comment._id} style={styles.commentCard}>
                      <View style={styles.commentHeader}>
                        {comment.userId.image ? (
                          <Image source={{ uri: comment.userId.image.replace('127.0.0.1', '192.168.1.21') }} style={styles.userImage} />
                        ) : (
                          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.userImage} />
                        )}
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{comment.userId.fullName}</Text>
                          {user && user.id === comment.userId._id && (
                            <TouchableOpacity
                              style={styles.editButton}
                              onPress={() => {
                                setEditingCommentId(comment._id);
                                setEditCommentText(comment.text);
                              }}
                            >
                              <Text style={styles.editButtonText}>Modifier</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      <Text>{comment.text}</Text>
                      {editingCommentId === comment._id && (
                        <View style={styles.editCommentSection}>
                          <TextInput
                            style={styles.commentInput}
                            value={editCommentText}
                            onChangeText={setEditCommentText}
                          />
                          <Button
                            title="Enregistrer"
                            onPress={() => handleEditComment(comment._id, item._id)}
                          />
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.noCommentsText}>Aucun commentaire</Text>
                )}
                <TextInput
                  style={styles.commentInput}
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Écrire un commentaire..."
                />
                <Button
                  title="Ajouter Commentaire"
                  onPress={() => handleAddComment(item._id)}
                />
              </View>
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
    padding: 10,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  publicationCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  publicationDate: {
    fontSize: 12,
    color: 'gray',
  },
  publicationImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  noImageText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    marginVertical: 10,
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  likeButton: {
    backgroundColor: '#ff8c00',
    padding: 5,
    borderRadius: 5,
  },
  likeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentButton: {
    backgroundColor: '#1e90ff',
    padding: 5,
    borderRadius: 5,
  },
  commentText: {
    color: 'white',
    fontWeight: 'bold',
  },
  updatePublicationButton: {
    backgroundColor: '#008CBA',
    padding: 5,
    borderRadius: 5,
  },
  updatePublicationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deletePublicationButton: {
    backgroundColor: '#dc143c',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  deletePublicationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentsSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  editButton: {
    marginLeft: 10,
    backgroundColor: '#008CBA',
    padding: 3,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editCommentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  noCommentsText: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: 'gray',
  },
});
