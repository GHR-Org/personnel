import apiClient from './index';

export async function getDailyRevenueReport(date) {
  try {
    const response = await apiClient.get(`/reports/revenue/daily?date=${date}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du rapport de revenus quotidiens :", error);
    throw error;
  }
}

export async function getOccupancyReport(startDate, endDate) {
  try {
    const response = await apiClient.get(`/reports/occupancy?start=${startDate}&end=${endDate}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du rapport d'occupation :", error);
    throw error;
  }
}
