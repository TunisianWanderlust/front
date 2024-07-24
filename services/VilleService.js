import axios from "axios";

const API_BASE_URL = 'http://192.168.1.15:9090';

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
    getVilleByNom,
};

