import apiClient from './index';

export async function getInventoryItems() {
  try {
    const response = await apiClient.get('/inventory');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des articles d'inventaire :", error);
    throw error;
  }
}

export async function updateInventoryItem(itemId, updateData) {
  try {
    const response = await apiClient.put(`/inventory/${itemId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article d'inventaire :", error);
    throw error;
  }
}
