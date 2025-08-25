import apiClient from './index';

export async function createBooking(bookingData) {
  try {
    const response = await apiClient.post('/reservation/', bookingData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la réservation :", error);
    throw error;
  }
}

export async function getBookingById(bookingId) {
  try {
    const response = await apiClient.get("/reservation/", bookingId);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation \ :, error");
    throw error;
  }
}
