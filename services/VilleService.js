/*import axios from "axios";

const API_BASE_URL = 'http://192.168.1.21:9090';

export const getVilles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ville`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des villes :', error.message);
      throw new Error(error.response.data.message || 'Erreur lors de la récupération des villes');
    }
  };
export const getVilleByNom = async (nom) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ville/nom/${nom}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de la ville :', error.message);
        throw new Error(error.response.data.message || 'Erreur lors de la récupération de la ville');
    }
};

export default {
    getVilles,
    getVilleByNom,
};
*/
import axios from "axios";

const API_BASE_URL = 'http://192.168.1.21:9090';

export const getVilles = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ville`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des villes :', error.message);
        throw new Error(error.response.data.message || 'Erreur lors de la récupération des villes');
    }
};

export const getVilleByNom = async (nom) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ville/nom/${nom}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de la ville :', error.message);
        throw new Error(error.response.data.message || 'Erreur lors de la récupération de la ville');
    }
};

export const getVilleById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/ville/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de la ville :', error.message);
        throw new Error(error.response.data.message || 'Erreur lors de la récupération de la ville');
    }
};

export default {
    getVilles,
    getVilleByNom,
    getVilleById,
};

