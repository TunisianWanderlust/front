import axios from "axios";

const API_BASE_URL = 'http://192.168.74.1:9090';

export const getCategoriesByVille = async (nomVille) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Categorie/${nomVille}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des Categories :', error.message);
    throw new Error(error.response.data.message || 'Erreur lors de la récupération des Categories');
  }
};