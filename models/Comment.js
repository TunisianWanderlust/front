class CommentModel {
    constructor(id,text,date,publicationId,userId){
        this.id = id || '';
        this.text = text || '';
        this.date = date || new Date();
        this.publicationId = publicationId || '';
        this.userId = userId || '';
    }
}
export default CommentModel;