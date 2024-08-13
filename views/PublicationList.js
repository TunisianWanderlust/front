import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import { getPublicationsByNomVille } from '../services/PublicationService';
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

  const handleDeleteComment = async (commentId, publicationId) => {
    try {
      await deleteComment(commentId);
      // Refetch comments for the updated publication
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
      setEditingCommentId(null); // Exit edit mode
      setEditCommentText(''); // Clear the input field
      // Refetch comments for the updated publication
      await handleExpandComments(publicationId);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du commentaire :', err.message);
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
                        {user && user.id === comment.userId._id && ( // Show delete and edit buttons only if the user is the author of the comment
                          <View style={styles.editDeleteButtons}>
                            <TouchableOpacity 
                              style={styles.deleteButton} 
                              onPress={() => handleDeleteComment(comment._id, item._id)}
                            >
                              <Text style={styles.deleteButtonText}>Supprimer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.editButton} 
                              onPress={() => {
                                setEditingCommentId(comment._id);
                                setEditCommentText(comment.text);
                              }}
                            >
                              <Text style={styles.editButtonText}>Modifier</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      {editingCommentId === comment._id ? (
                        <View style={styles.editCommentSection}>
                          <TextInput
                            style={styles.commentInput}
                            placeholder="Modifier le commentaire..."
                            value={editCommentText}
                            onChangeText={setEditCommentText}
                          />
                          <Button title="Sauvegarder" onPress={() => handleEditComment(comment._id, item._id)} />
                        </View>
                      ) : (
                        <Text style={styles.commentText}>{comment.text}</Text>
                      )}
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
                  <Button title="Ajouter" onPress={() => handleAddComment(item._id)} />
                </View>
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
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
  },
  publicationImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  noImageText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
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
  commentsSection: {
    marginTop: 10,
  },
  commentCard: {
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  editDeleteButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButtonText: {
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
  },
  editCommentSection: {
    marginTop: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  noCommentsText: {
    color: '#888',
  },
});
