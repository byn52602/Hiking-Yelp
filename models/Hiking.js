const mongoose = require('mongoose');
const Review = require('./Review');
const Schema = mongoose.Schema;

const HikingSchema = new Schema({
    title: String,
    location: String,
    lengthKM: Number,
    difficulty: String,
    description: String,
    image: [
        {
            url: String,
            filename: String
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

HikingSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

const Hiking = mongoose.model('Hiking', HikingSchema);
module.exports = Hiking;