class UserModel {
  constructor(id, fullName, email, password, telephone, image, role) {
    this.id = id || ''; // Identifiant unique de l'utilisateur
    this.fullName = fullName || '';
    this.email = email || '';
    this.password = password || '';
    this.telephone = telephone ? String(telephone) : ''; // Assurez-vous que telephone est une chaîne
    this.image = image || ''; // Assurez-vous que image est une URL ou un chemin
    this.role = role || 'tourist'; // Par défaut, le rôle est 'tourist'
  }

  // Méthode utilitaire pour vérifier si l'utilisateur est administrateur
  isAdmin() {
    return this.role === 'admin';
  }
}

export default UserModel;
