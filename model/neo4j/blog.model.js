class Blog {

    constructor(id, title, author,
                timestamp, summary, text) {
        this._id = id,
        this._title = title;
        this._author = author;
        this._timestamp = timestamp;
        this._summary = summary;
        this._text = text;
    }
}

module.exports = Blog;