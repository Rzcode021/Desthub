const Listing = require('../models/listing.js');




module.exports.listing = async (req, res) => {
    let listings = await Listing.find({}).populate('reviews');
    res.render("listings/listings.ejs", { listings });

};

module.exports.renderNewForm = (req, res) => {

    res.render('listings/new.ejs');
};


module.exports.createNewListing = async (req, res) => {
    // handle different shapes returned by multer/cloudinary
    
    const file = req.file || {};
    const url = file.path || file.secure_url || file.url || file.location || '';
    const filename = file.filename || file.public_id || file.key || '';

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if (url) newListing.image = { url, filename };
    await newListing.save();
   
    req.flash('success', "New listing created!");
    res.redirect('/listings');
    
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate(
        {
            path:'reviews',
            populate:{
                path: 'author'
            },
        }
    ).populate('owner');

    if(!listing){
        req.flash('error', "Listing you requested does not exist");
         return res.redirect('/listings');
    }
    res.render("listings/show.ejs", { listing });

};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', "Listing you requested does not exist");
        return res.redirect('/listings');
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload/", "/upload/w_250/"); 
    

    res.render('listings/edit.ejs', { listing,originalImageUrl });
}


module.exports.updateListing = async (req, res) => {
   
    let { id } = req.params;
  
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

     if (req.file) {
        console.log('update file object:', req.file);
        const file = req.file || {};
        const url = file.path || file.secure_url || file.url || file.location || '';
        const filename = file.filename || file.public_id || file.key || '';
        if (url) {
            listing.image = { url, filename };
            await listing.save();
            console.log('updated listing image:', JSON.stringify(listing, null, 2));
        }
     }
    req.flash('success', "Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', "Listing deleted");
    res.redirect('/listings');
};