import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    totalUsers: {
        type: Number,
    },
    totalAccesses: {
        type: Number,
    },
    accessPerDay: {
        type: Array
    },
    accessPerHour: {
        type: Array
    },
    todaysAccesses: {
        type: Object,
    }
}, {collection: 'analytics'});

module.exports = mongoose.model.analytics || mongoose.model('analytics', analyticsSchema);
