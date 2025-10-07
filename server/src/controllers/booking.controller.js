import { asyncHandler } from '../utils/asyncHandler.js';
import { Booking } from "../models/booking.model.js"
import { ApiResponse } from '../utils/ApiResponse.js';


/* CREATE BOOKING */

const createBooking = asyncHandler(async (req, res) => {
  
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body
    const newBooking = new Booking({
                            customerId,
                            hostId,
                            listingId,
                            startDate,
                            endDate,
                            totalPrice
                        })
    await newBooking.save()
    
    return res
    .status(201)
    .json(new ApiResponse(201, newBooking, 'Booking created successfully'))

})

export {createBooking};