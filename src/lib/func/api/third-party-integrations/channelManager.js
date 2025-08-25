import apiClient from '../index'; // Assurez-vous que le chemin est correct

export async function syncBookingsWithChannelManager(bookingData) {
  try {
    // Logique pour interagir avec une API de Channel Manager externe
    const response = await apiClient.post('/integrations/channel-manager/sync', bookingData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la synchronisation avec le Channel Manager :", error);
    throw error;
  }
}
