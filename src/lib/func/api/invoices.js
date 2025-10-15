import apiClient from './index';

export async function createInvoice(invoiceData) {
  try {
    const response = await apiClient.post('/invoices', invoiceData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la facture :", error);
    throw error;
  }
}

export async function getInvoiceDetails(invoiceId) {
  try {
    const response = await apiClient.get(`/invoices/`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la facture  :', error);
    throw error;
  }
}
