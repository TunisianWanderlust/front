import axios from 'axios';

const API_BASE_URL = 'http://192.168.74.1:9090'; // Remplacez par l'URL de votre API

export const addLike = async (publicationId, userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Like`, { publicationId, userId });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du like :', error.message);
        // Traiter le cas où l'utilisateur a déjà aimé la publication comme une réponse valide
        if (error.response && error.response.status === 200 && error.response.data.message === 'Vous avez déjà aimé cette publication') {
            return error.response.data;
        }
        throw new Error(error.response ? error.response.data.message : 'Erreur lors de l\'ajout du like');
    }
};
export const getLikeCount = async (publicationId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Like/${publicationId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de likes :', error.message);
        throw new Error(error.response ? error.response.data.message : 'Erreur lors de la récupération du nombre de likes');
    }
};
export const removeLike = async (publicationId, userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Like/remove`, { publicationId, userId });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du like :', error.message);
        throw new Error(error.response ? error.response.data.message : 'Erreur lors de la suppression du like');
    }
};




export default {
    addLike,
    getLikeCount,
    removeLike,
};
