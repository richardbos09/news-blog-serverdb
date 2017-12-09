const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArchiveSchema = new Schema({
    datestamp: {
        type: Date,
        required: true
    },
    blogs: [{
        type: Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    }]
});

const Archive = mongoose.model('archive', ArchiveSchema);

module.exports = Archive;