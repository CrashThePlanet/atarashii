import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    eMail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    startPageElements: {
        type: Array,
        default: []
    }
}, {collection: 'users'});

module.exports = mongoose.models.users ||   mongoose.model('users', userSchema);