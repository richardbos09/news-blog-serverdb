const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArchiveSchema = new Schema({
    datestamp: {
        type: Date,
        required: true
    },
    blogs: {
        type: Schema.Types.ObjectId, 
        ref: 'Blog',
        required: true
    }
});

const Archive = mongoose.model('archive', ArchiveSchema);

// const archive = new Archive({
//     datestamp: new Date(2017, 11),
// }).save();

module.exports = Archive;