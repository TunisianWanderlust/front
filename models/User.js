class UserModel {
  constructor(id, fullName, email, password, telephone, image, role) {
    this.id = id || ''; 
    this.fullName = fullName || '';
    this.email = email || '';
    this.password = password || '';
    this.telephone = telephone ? String(telephone) : ''; 
    this.image = image || ''; 
    this.role = role || 'tourist';
  }
  isAdmin() {
    return this.role === 'admin';
  }
}

export default UserModel;
