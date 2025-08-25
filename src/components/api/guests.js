import apiClient from './index';

export async function getGuestProfile(guestId) {
  try {
    const response = await apiClient.get(`/guests/${guestId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil invité :', error);
    throw error;
  }
}

export async function createGuest(guestData) {
  try {
    const response = await apiClient.post('/guests', guestData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'invité :", error);
    throw error;
  }
}
