import apiClient from './index';

export async function getMenuItems() {
  try {
    const response = await apiClient.get('/products/menu');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des éléments de menu :", error);
    throw error;
  }
}

export async function getProductStock(productId) {
  try {
    const response = await apiClient.get(/products/\/stock);
    return response.data;
  } catch (error) {
    console.error(Erreur lors de la récupération du stock du produit \ :, error);
    throw error;
  }
}
