
import axios from 'axios';

const API_BASE_URL = 'http://192.168.139.189:9090';

export async function signup(userData) {
  try {
      const response = await axios.post(`${API_BASE_URL}/user/signup`, userData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      return response.data;
  } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      throw error;
  }
}


export async function signin(credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/signin`, credentials);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion :', error.message);
    throw error;
  }
}

export const updateProfile = async (userId, formData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data.msg;
  } catch (error) {
    console.error('Détails de l\'erreur:', error.response ? error.response.data : error.message);
    throw new Error(error.response.data.message || 'Erreur lors de la mise à jour du profil');
  }
};

export const changePassword = async (userId, passwordData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/user/${userId}/password`, passwordData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.msg;
  } catch (error) {
    console.error('Détails de l\'erreur:', error.response ? error.response.data : error.message);
    throw new Error(error.response.data.message || 'Erreur lors du changement de mot de passe');
  }
};

export default {
  signup,
  signin,
  updateProfile,
  changePassword,
};
