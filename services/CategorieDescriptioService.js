import axios from 'axios';

const API_BASE_URL = 'http://192.168.74.1:9090'; // Assurez-vous que l'URL de votre API est correcte

// Fonction pour obtenir les descriptions de catégories basées sur la ville et la catégorie
export const getDescriptionsByVilleAndCategorie = async (ville, categorie) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/CategorieDescription/descriptions/${ville}/${categorie}`);
    if (response.status === 200) {
      // Retourner les données brutes directement
      return response.data.data;
    } else {
      throw new Error('Erreur lors de la récupération des descriptions.');
    }
  } catch (error) {
    console.error('Erreur:', error.message);
    throw error;
  }
};
