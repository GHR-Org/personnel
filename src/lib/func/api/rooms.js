import apiClient from './index';

export async function getRoomTypes() {
  try {
    const response = await apiClient.get('/room-types');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des types de chambres :", error);
    throw error;
  }
}

export async function getAvailableRooms(checkInDate, checkOutDate) {
  try {
    const response = await apiClient.get(/rooms/available?checkIn=\&checkOut=\);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des chambres disponibles :", error);
    throw error;
  }
}

export async function updateRoomStatus(roomId, status) {
  try {
    const response = await apiClient.put(/rooms/\/status, { status });
    return response.data;
  } catch (error) {
    console.error(Erreur lors de la mise à jour du statut de la chambre \ :, error);
    throw error;
  }
}
