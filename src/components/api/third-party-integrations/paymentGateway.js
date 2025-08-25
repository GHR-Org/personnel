import apiClient from '../index'; // Assurez-vous que le chemin est correct

export async function processOnlinePayment(paymentDetails) {
  try {
    // Logique pour interagir avec une API de passerelle de paiement externe
    const response = await apiClient.post('/integrations/payment-gateway/process', paymentDetails);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du traitement du paiement en ligne :", error);
    throw error;
  }
}
