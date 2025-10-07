import fs from 'fs/promises'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Listing } from '../models/listing.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

/**
 * Helper: upload multiple local files to Cloudinary, then delete local files.
 * Returns an array of { url, public_id, originalname }.
 */
const uploadManyAndCleanup = async (files = []) => {
  if (!Array.isArray(files) || files.length === 0) return []
  const results = []

  try {
    for (const f of files) {
      const uploaded = await uploadOnCloudinary(f.path)
      // Cleanup local file regardless of unlink outcome
      try { await fs.unlink(f.path) } catch { /* ignore unlink errors */ }
      if (!uploaded?.url) {
        throw new Error('Cloud upload failed')
      }
      results.push({
        url: uploaded.url,
        public_id: uploaded.public_id || null,
        originalname: f.originalname,
      })
    }
    return results
  } catch (err) {
    // Best-effort cleanup for any files that still exist locally
    await Promise.allSettled(files.map(f => fs.unlink(f.path)))
    throw err
  }
}

/**
 * POST /listings/create
 * Requires multer to have processed files into req.files (field: listingPhotos).
 * Uploads images to Cloudinary and persists listing with remote URLs.
 */
const createListing = asyncHandler(async (req, res) => {
  const {
    creator,
    category,
    type,
    streetAddress,
    aptSuite,
    city,
    state,
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

  // Basic validations
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

  // Upload to Cloudinary and cleanup local files
  const uploadedPhotos = await uploadManyAndCleanup(listingPhotos)

  // Create listing storing Cloudinary URLs (not local paths)
  const doc = await Listing.create({
    creator,
    category,
    type,
    streetAddress,
    aptSuite,
    city,
    state,
    country,
    guestCount,
    bedroomCount,
    bedCount,
    bathroomCount,
    amenities,
    listingPhotoPaths: uploadedPhotos.map(p => p.url),
    title,
    description,
    highlight,
    highlightDesc,
    price,
  })

  // Populate creator to mirror original responses
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