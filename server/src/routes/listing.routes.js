// server/src/routes/listing.routes.js
import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import {
  createListing,
  getListingsByCategory,
  searchListings,
  getListingDetails,
} from '../controllers/listing.controller.js'

const router = Router()

router.route("/create").post(
    verifyJWT,
    upload.fields([
        {
            name: "listingPhotos",
            maxCount: 25,
        },
    ]),
    createListing
);



router.get('/', getListingsByCategory)

router.get('/search/:search', searchListings)

// Listing details by id
router.get('/:listingId', getListingDetails)

export default router
