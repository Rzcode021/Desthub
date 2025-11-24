const express = require('express');
const router = express.Router({mergeParams:true});

const wrapAsync = require('../utils/wrapAsync.js');

const { validateReview, isloggedIn, isReviewAuthor} = require('../middleware.js');
const reviewController = require('../contollers/review.js');





router.post('/',isloggedIn, validateReview, wrapAsync(reviewController.addReview));

router.delete('/:reviewId',isloggedIn, isReviewAuthor, wrapAsync( reviewController.deleteReview));



module.exports = router;