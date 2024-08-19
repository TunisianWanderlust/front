class LikeModel {
    constructor(id,publicationId,userId){
        this.id = id || '';
        this.publicationId = publicationId || '';
        this.userId = userId || '';
    }
}
export default LikeModel;