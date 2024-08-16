import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { getPublicationsByNomVille, deletePublication } from '../services/PublicationService';
import { getCommentsByPublication, addComment, deleteComment, updateComment } from '../services/CommentService';
import { UserContext } from './UserC';
import { Menu, Divider, IconButton } from 'react-native-paper';

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
  const [visibleMenu, setVisibleMenu] = useState(null);

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
                                <Text style={styles.editText}>Modifier</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteComment(comment._id, item._id)}
                              >
                                <Text style={styles.deleteText}>Supprimer</Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      </View>
                      <Text style={styles.commentText}>{comment.text}</Text>
                      {editingCommentId === comment._id && (
                        <View style={styles.editCommentSection}>
                          <TextInput
                            value={editCommentText}
                            onChangeText={setEditCommentText}
                            style={styles.editCommentInput}
                            placeholder="Modifier le commentaire"
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
                  <Text>Aucun commentaire</Text>
                )}
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  style={styles.commentInput}
                  placeholder="Ajouter un commentaire"
                />
                <Button
                  title="Ajouter"
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
  publicationCard: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
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
    marginBottom: 10,
  },
  noImageText: {
    color: '#888',
    textAlign: 'center',
  },
  description: {
    marginBottom: 10,
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  likeButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  likeText: {
    color: '#333',
  },
  commentButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  commentText: {
    color: '#333',
  },
  commentsSection: {
    marginTop: 10,
  },
  commentCard: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  editCommentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editCommentInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  editText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
