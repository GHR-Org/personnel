import apiClient from './index';

export async function getHousekeepingTasks() {
  try {
    const response = await apiClient.get('/housekeeping/tasks');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches de ménage :", error);
    throw error;
  }
}

export async function assignHousekeepingTask(assigneeId) {
  try {
    const response = await apiClient.post(`/housekeeping/tasks/assign`, { assigneeId });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'assignation de la tâche de ménage:", error);
    throw error;
  }
}
