import axios from "axios";

const API_BASE_URL = 'http://192.168.1.21:9090';

// Fonction pour récupérer les publications par le nom de la ville
export const getPublicationsByNomVille = async (nomVille) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/publication/${nomVille}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des publications :', error.message);
    throw new Error(error.response.data.message || 'Erreur lors de la récupération des publications');
  }
};
export const deletePublication = async (publicationId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/publication/${publicationId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la publication :', error.message);
      throw new Error(error.response.data.message || 'Erreur lors de la suppression de la publication');
    }
  };

export default {
  getPublicationsByNomVille,
  deletePublication,
};
