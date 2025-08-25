import apiClient from './index';

export async function createOrder(orderData) {
  try {
    const response = await apiClient.post('/pos/orders', orderData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la commande POS :", error);
    throw error;
  }
}

export async function processPayment(paymentData) {
  try {
    const response = await apiClient.post('/pos/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du traitement du paiement POS :", error);
    throw error;
  }
}
