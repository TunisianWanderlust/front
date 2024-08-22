import axios from "axios";

const API_BASE_URL = 'http://192.168.139.189:9090';

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
  export const addPublication = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/publication`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la publication :', error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de la publication');
    }
  };
  export const updatePublication = async (publicationId, formData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/publication/${publicationId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la publication :', error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de la publication');
    }
  };

  export const getPublicationsByUserId = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/publication/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des publications :', error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des publications');
    }
  };
  
export default {
  getPublicationsByNomVille,
  deletePublication,
  addPublication,
  updatePublication,
  getPublicationsByUserId,
};

