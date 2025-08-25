// Helpers pour gérer le token et l'utilisateur dans le localStorage
export function isAuthenticated() {
  return !!localStorage.getItem("access_token");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem("access_token");
}

export function clearStoredTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

export function hasRole(role) {
  const user = getStoredUser();
  return user && user.role === role;
}

export function hasAnyRole(roles) {
  const user = getStoredUser();
  return user && roles.includes(user.role);
} 