const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const { isloggedIn} =  require('../middleware.js');
const {isOwner, validateListing} = require('../middleware.js');
const listingController = require('../contollers/listing.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});


router.get("/", wrapAsync( listingController.listing ));

router.post('/' ,isloggedIn,upload.single("listing[image]"), validateListing,  wrapAsync( listingController.createNewListing));

router.get('/new', isloggedIn, listingController.renderNewForm)

router.get("/:id", wrapAsync( listingController.showListing));


router.get('/:id/edit',isloggedIn, wrapAsync( listingController.renderEditForm));

router.put('/:id',isloggedIn,isOwner,
    upload.single("listing[image]"),validateListing, wrapAsync( listingController.updateListing
));

router.delete('/:id',isloggedIn, wrapAsync( listingController.destroyListing));

module.exports = router;