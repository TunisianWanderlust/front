import axios from "axios";

const API_BASE_URL = 'http://192.168.1.21:9090';

// Fonction pour ajouter un commentaire
export const addComment = async (commentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/comment`, commentData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire :', error.message);
    throw new Error(error.response.data.message || 'Erreur lors de l\'ajout du commentaire');
  }
};

// Fonction pour récupérer les commentaires d'une publication
export const getCommentsByPublication = async (publicationId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comment/${publicationId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires :', error.message);
    throw new Error(error.response.data.message || 'Erreur lors de la récupération des commentaires');
  }
};

// Fonction pour supprimer un commentaire
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/comment/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire :', error.message);
    throw new Error(error.response.data.message || 'Erreur lors de la suppression du commentaire');
  }
};

export default {
  addComment,
  getCommentsByPublication,
  deleteComment,
};
