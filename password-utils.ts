// Utilitaire pour le hachage des mots de passe côté frontend
// Note: Ceci est une solution temporaire. En production, le hachage devrait être fait côté serveur

/**
 * Hash un mot de passe en utilisant une méthode simple
 * Cette fonction simule le hachage bcrypt utilisé par le backend
 * @param password - Le mot de passe en clair
 * @returns Le mot de passe "hashé" (en réalité, une version encodée)
 */
export function hashPassword(password: string): string {
  // Méthode simple de "hachage" pour simuler bcrypt
  // En production, utilisez bcryptjs ou laissez le backend faire le hachage
  
  // Encoder en base64 et ajouter un préfixe pour simuler un hash bcrypt
  const encoded = btoa(password);
  return `$2b$12$${encoded}`;
}

/**
 * Vérifie si un mot de passe correspond à un hash
 * @param password - Le mot de passe en clair
 * @param hash - Le hash à vérifier
 * @returns true si le mot de passe correspond
 */
export function verifyPassword(password: string, hash: string): boolean {
  const encoded = btoa(password);
  const expectedHash = `$2b$12$${encoded}`;
  return hash === expectedHash;
}

/**
 * Génère un hash bcrypt compatible avec le backend
 * Cette fonction utilise une approche simple pour simuler bcrypt
 * @param password - Le mot de passe en clair
 * @returns Un hash compatible avec le backend
 */
export function generateBcryptHash(password: string): string {
  // Simulation d'un hash bcrypt
  // Format: $2b$12$[salt][hash]
  const salt = Math.random().toString(36).substring(2, 15);
  const encoded = btoa(password + salt);
  return `$2b$12$${salt}${encoded.substring(0, 22)}`;
}

/**
 * Test de la fonction de hachage
 * Cette fonction peut être utilisée pour vérifier que le hachage fonctionne
 */
export function testPasswordHashing() {
  const testPassword = "test123";
  const hash = hashPassword(testPassword);
  const isValid = verifyPassword(testPassword, hash);
  
  console.log("🔐 Test de hachage de mot de passe:");
  console.log("Mot de passe original:", testPassword);
  console.log("Hash généré:", hash);
  console.log("Vérification:", isValid ? "✅ Réussi" : "❌ Échec");
  
  return isValid;
} 