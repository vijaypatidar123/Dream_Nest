import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Listing } from '../models/listing.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import fs from 'fs'

/**
 * Helper: upload multiple local files to Cloudinary.
 * Checks if file exists before attempting upload.
 * Cleans up any remaining files on error.
 */
const uploadManyAndCleanup = async (files = []) => {
  if (!Array.isArray(files) || files.length === 0) return []
  const results = []
  const uploadedFiles = []

  try {
    for (const f of files) {
      // Check if file still exists before upload
      if (!fs.existsSync(f.path)) {
        console.warn(`File already deleted: ${f.path}`)
        continue
      }

      const uploaded = await uploadOnCloudinary(f.path)
      if (!uploaded?.url) {
        throw new Error('Cloud upload failed')
      }
      
      results.push({
        url: uploaded.url,
        public_id: uploaded.public_id || null,
        originalname: f.originalname,
      })
      uploadedFiles.push(f.path)
    }
    return results
  } catch (error) {
    // Cleanup any remaining temp files on error
    for (const f of files) {
      try {
        if (fs.existsSync(f.path)) {
          fs.unlinkSync(f.path)
        }
      } catch (unlinkErr) {
        console.error(`Failed to cleanup file ${f.path}:`, unlinkErr.message)
      }
    }
    throw error
  }
}

/**
 * POST /listings/create
 * Requires multer.fields([{ name: 'listingPhotos', maxCount: 10 }])
 */
const createListing = asyncHandler(async (req, res) => {
  const {
    creator,
    category,
    type,
    streetAddress,
    aptSuite,
    city,
    // UI sends `province`; backend model in your sample used `state` in controller
    province,
    state, // accept either
    country,
    guestCount,
    bedroomCount,
    bedCount,
    bathroomCount,
    amenities,
    title,
    description,
    highlight,
    highlightDesc,
    price,
  } = req.body

  if (!creator || !category || !type || !title || price == null) {
    throw new ApiError(400, 'Missing required fields: creator, category, type, title, price')
  }
  if (!mongoose.isValidObjectId(creator)) {
    throw new ApiError(400, 'Invalid creator id format')
  }

  // Files from multer
  const listingPhotos = req.files?.listingPhotos || []
  if (!listingPhotos.length) {
    throw new ApiError(400, 'No listing photos uploaded')
  }

  // Upload to Cloudinary
  const uploadedPhotos = await uploadManyAndCleanup(listingPhotos)

  if (!uploadedPhotos.length) {
    throw new ApiError(500, 'Failed to upload listing photos')
  }

  // Normalize amenities: if stringified JSON, parse; else pass through
  let amenitiesValue = amenities
  if (typeof amenities === 'string') {
    try {
      amenitiesValue = JSON.parse(amenities)
    } catch {
      // fallback to comma-split if user sent "a,b,c"
      amenitiesValue = amenities.split(',').map((s) => s.trim()).filter(Boolean)
    }
  }

  // Prefer state from req.body.state; otherwise map province -> state
  const stateValue = state || province || ''

  const doc = await Listing.create({
    creator,
    category,
    type,
    streetAddress,
    aptSuite,
    city,
    state: stateValue,
    country,
    guestCount,
    bedroomCount,
    bedCount,
    bathroomCount,
    amenities: amenitiesValue,
    listingPhotoPaths: uploadedPhotos.map((p) => p.url),
    title,
    description,
    highlight,
    highlightDesc,
    price,
  })

  const newListing = await Listing.findById(doc._id).populate('creator')

  return res
    .status(201)
    .json(new ApiResponse(201, newListing, 'Listing created successfully'))
})

/**
 * GET /listings By category
 * GET /listings?category=...
 * If category query is present, filter by category; otherwise return all.
 */

const getListingsByCategory = asyncHandler(async (req, res) => {
  const qCategory = req.query.category
  const listings = qCategory
                    ? (await Listing.find({ category: qCategory }).populate('creator'))
                    : (await Listing.find().populate('creator'))

  return res
  .status(200)
  .json(new ApiResponse(200, listings, 'Listings fetched successfully'))
})

/**
 * Get Listing by Search 
 * GET /listings/search/:search
 * search === "all" returns all; otherwise regex matches category or title (case-insensitive).
 */

const searchListings = asyncHandler(async (req, res) => {
  const { search } = req.params

  const listings = search === 'all'
    ? await Listing.find().populate('creator')
    : await Listing.find({
        $or: [
          { category: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
        ],
      }).populate('creator')

  return res
    .status(200)
    .json(new ApiResponse(200, listings, 'Search results fetched successfully'))
})

/**
 * Get Listing Details 
 * GET /listings/:listingId
 * Fetch listing by id and populate creator.
 */
const getListingDetails = asyncHandler(async (req, res) => {
  const { listingId } = req.params
  if (!mongoose.isValidObjectId(listingId)) {
    throw new ApiError(400, 'Invalid listing id format')
  }
  const listing = await Listing.findById(listingId).populate('creator')
  if (!listing) {
    throw new ApiError(404, 'Listing not found')
  }
  return res
  .status(200)
  .json(new ApiResponse(200, listing, 'Listing fetched successfully'))
})


export {
    createListing,
    getListingsByCategory,
    searchListings,
    getListingDetails
}