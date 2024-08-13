// models/PublicationModel.js

class PublicationModel {
    constructor(id, image, description, datePub, villeId, userId) {
      this.id = id || '';
      this.image = image || '';
      this.description = description || '';
      this.datePub = datePub || new Date();
      this.villeId = villeId || '';
      this.userId = userId || '';
    }
  }
  
  export default PublicationModel;
  