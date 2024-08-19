import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, Alert } from 'react-native';
import { getCommentsByPublication, addComment, deleteComment, updateComment } from '../services/CommentService';
import { UserContext } from './UserC';
import { Menu, Divider, IconButton } from 'react-native-paper';

export default function CommentSection({ publicationId, expandedPublicationId, handleExpandComments }) {
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [visibleMenu, setVisibleMenu] = useState(null);

  const { user } = useContext(UserContext);

  const fetchComments = async () => {
    try {
      const data = await getCommentsByPublication(publicationId);
      setComments(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des commentaires :', err.message);
    }
  };

  const handleAddComment = async () => {
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
      fetchComments();
    } catch (err) {
      console.error('Erreur lors de l\'ajout du commentaire :', err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
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
              fetchComments();
            } catch (err) {
              console.error('Erreur lors de la suppression du commentaire :', err.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) {
      alert('Veuillez entrer du texte pour le commentaire');
      return;
    }

    try {
      await updateComment(commentId, editCommentText);
      setEditingCommentId(null);
      setEditCommentText('');
      fetchComments();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du commentaire :', err.message);
    }
  };

  return (
    <View style={styles.commentsSection}>
      {expandedPublicationId === publicationId && (
        <>
          {comments.length > 0 ? (
            comments.map((comment) => (
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
                      <Menu
                        visible={visibleMenu === comment._id}
                        onDismiss={() => setVisibleMenu(null)}
                        anchor={<IconButton icon="dots-vertical" size={20} onPress={() => setVisibleMenu(comment._id)} />}
                      >
                        <Menu.Item
                          onPress={() => {
                            setEditingCommentId(comment._id);
                            setEditCommentText(comment.text);
                            setVisibleMenu(null);
                          }}
                          title="Modifier"
                        />
                        <Divider />
                        <Menu.Item
                          onPress={() => {
                            handleDeleteComment(comment._id);
                            setVisibleMenu(null);
                          }}
                          title="Supprimer"
                        />
                      </Menu>
                    )}
                  </View>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
                {editingCommentId === comment._id && (
                  <View style={styles.editCommentContainer}>
                    <TextInput
                      value={editCommentText}
                      onChangeText={setEditCommentText}
                      style={styles.editCommentInput}
                      placeholder="Modifier le commentaire"
                    />
                    <Button
                      title="Enregistrer"
                      onPress={() => handleEditComment(comment._id)}
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
            onPress={handleAddComment}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  commentsSection: {
    marginTop: 10,
  },
  commentCard: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  commentText: {
    marginVertical: 5,
  },
  editCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editCommentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginVertical: 10,
  },
});
