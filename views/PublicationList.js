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
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce commentaire ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              await deleteComment(commentId);
              await handleExpandComments(publicationId);
            } catch (err) {
              console.error('Erreur lors de la suppression du commentaire :', err.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
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
                            <>
                              <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => {
                                  setEditingCommentId(comment._id);
                                  setEditCommentText(comment.text);
                                }}
                              >
                                <Text style={styles.editButtonText}>Modifier</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.deleteCommentButton}
                                onPress={() => handleDeleteComment(comment._id, item._id)}
                              >
                                <Text style={styles.deleteCommentButtonText}>Supprimer</Text>
                              </TouchableOpacity>
                            </>
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
                          <Button title="Enregistrer" onPress={() => handleEditComment(comment._id, item._id)} />
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.noCommentsText}>Aucun commentaire</Text>
                )}
                <TextInput
                  style={styles.commentInput}
                  placeholder="Ajouter un commentaire"
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <Button title="Ajouter" onPress={() => handleAddComment(item._id)} />
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
  publicationCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
  },
  publicationDate: {
    color: '#888',
  },
  publicationImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  noImageText: {
    textAlign: 'center',
    color: '#888',
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
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  likeText: {
    color: '#fff',
  },
  commentButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  commentText: {
    color: '#fff',
  },
  updatePublicationButton: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 5,
  },
  updatePublicationButtonText: {
    color: '#fff',
  },
  deletePublicationButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  deletePublicationButtonText: {
    color: '#fff',
  },
  commentsSection: {
    marginTop: 10,
  },
  commentCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  editButtonText: {
    color: '#fff',
  },
  deleteCommentButton: {
    backgroundColor: '#dc3545',
    padding: 5,
    borderRadius: 5,
  },
  deleteCommentButtonText: {
    color: '#fff',
  },
  editCommentSection: {
    marginTop: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#888',
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
