
  class UserModel {
    constructor(id, fullName, email, password, telephone, image, role) {
      this.id = id; // Identifiant unique de l'utilisateur
      this.fullName = fullName;
      this.email = email;
      this.password = password;
      this.telephone = telephone;
      this.image = image;
      this.role = role || 'tourist'; // Par défaut, le rôle est 'tourist'
    }
  
    // Méthode utilitaire pour vérifier si l'utilisateur est administrateur
    isAdmin() {
      return this.role === 'admin';
    }
  }
  
  export default UserModel;