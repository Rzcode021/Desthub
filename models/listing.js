const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
        
    }
});

listingSchema.post('findOneAndDelete', async (listing)=>{

    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews }});
    }
})

function capitalizeWords(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


listingSchema.pre('save', function (next) {
    if (this.title) this.title = capitalizeWords(this.title);
    if (this.location) this.location = capitalizeWords(this.location);
    if (this.country) this.country = capitalizeWords(this.country);
    next();
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;