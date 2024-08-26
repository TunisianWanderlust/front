
class CategorieDescriptionModel {
    constructor(id,nom, description, image, CategorieId, villeId) {
      this.id = id || '';
      this.nom = nom || '';
      this.description = description || '';
      this.image = image || '';
      this.CategorieId = CategorieId || ''
      this.villeId = villeId || '';
    }
  }
  
  export default CategorieDescriptionModel;
  