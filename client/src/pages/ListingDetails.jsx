import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { facilities } from '../data.jsx'
import { useSelector } from 'react-redux'
import api from '../utils/api'

const ListingDetails = () => {
  const [loading, setLoading] = useState(true)
  const { listingId } = useParams()
  const [listing, setListing] = useState(null)

  const getListingDetails = async () => {
    try {
      const { data } = await api.get(`/listings/${listingId}`)
      // handle either {data: doc} or doc directly
      setListing(data?.data || data)
    } catch (err) {
      console.log('Fetch Listing Details Failed', err?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListingDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId])

  // Booking calendar
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: 'selection' },
  ])
  const handleSelect = (ranges) => setDateRange([ranges.selection])
  const start = new Date(dateRange[0].startDate)
  const end = new Date(dateRange[0].endDate)
  const dayCount = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) || 1)

  // User
  const customerId = useSelector((s) => s?.user?._id)
  const navigate = useNavigate()

  const imageSrc = (p) => (/^https?:\/\//i.test(p) ? p : p?.replace('/public', ''))

  const handleSubmit = async () => {
    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toISOString(),
        endDate: dateRange[0].endDate.toISOString(),
        totalPrice: listing.price * dayCount,
      }
      await api.post('/bookings/create', bookingForm)
      navigate(`/${customerId}/trips`)
    } catch (err) {
      console.log('Submit Booking Failed.', err?.message)
    }
  }

  if (loading) return <Loader />

  return (
    <>
      <Navbar />

      <div className="px-5 md:px-8 lg:px-12 xl:px-16 py-8">
        {/* title */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600">{listing.title}</h1>
        </div>

        {/* gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {listing.listingPhotoPaths?.map((p, idx) => (
            <img
              key={idx}
              src={imageSrc(p)}
              alt={`listing ${idx + 1}`}
              className="w-full h-48 md:h-60 object-cover rounded-md"
              loading="lazy"
            />
          ))}
        </div>

        {/* meta */}
        <h2 className="text-xl font-semibold">
          {listing.type} in {listing.city}, {listing.province}, {listing.country}
        </h2>
        <p className="text-gray-700">
          {listing.guestCount} guests · {listing.bedroomCount} bedroom(s) · {listing.bedCount} bed(s) ·{' '}
          {listing.bathroomCount} bathroom(s)
        </p>
        <hr className="my-4" />

        {/* host */}
        <div className="flex items-center gap-3">
          <img
            src={imageSrc(listing.creator?.avatar)}
            alt="host"
            className="w-12 h-12 rounded-full object-cover"
          />
          <h3 className="text-lg font-semibold">
            Hosted by {listing.creator?.fullName}
          </h3>
        </div>
        <hr className="my-4" />

        {/* description */}
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="text-gray-800">{listing.description}</p>
        <hr className="my-4" />

        {/* highlight */}
        <h3 className="text-lg font-semibold">{listing.highlight}</h3>
        <p className="text-gray-800">{listing.highlightDesc}</p>
        <hr className="my-6" />

        {/* booking + amenities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* amenities (left) */}
          <div>
            <h2 className="text-xl font-semibold mb-3">What this place offers?</h2>
            <div className="flex flex-wrap gap-3">
              {(Array.isArray(listing.amenities)
                ? listing.amenities
                : String(listing.amenities ?? '')
                  .split(',')
                  .map((s) => s.trim())
              ).map((item, idx) => {
                const icon = facilities.find((f) => f.name === item)?.icon
                return (
                  <div
                    key={`${item}-${idx}`}
                    className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2"
                  >
                    <div className="text-xl">{icon}</div>
                    <p className="font-medium">{item}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* booking panel (right) */}
          <div className="flex lg:justify-end">
            <div className="w-full max-w-[400px] min-h-[560px] border border-white rounded-xl p-4">
              <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold mb-3">How long do you want to stay?</h2>
              {/* calendar */}
              <div className="
    [&_.rdrDateDisplayWrapper]:border-0
    [&_.rdrDateDisplayItem]:border-0
    [&_.rdrCalendarWrapper]:border-0
    [&_.rdrMonthAndYearWrapper]:border-0
    [&_.rdrMonths]:border-0
    [&_.rdrMonth]:border-0
    [&_.rdrWeekDay]:border-0
  ">
                <DateRange
                  ranges={dateRange}
                  onChange={handleSelect}
                  rangeColors={['#e11d48']}
                  showDateDisplay
                  showSelectionPreview={false}
                  months={1}
                  direction="horizontal"
                  editableDateInputs={true}
                  moveRangeOnFirstSelection={false}
                  retainEndDateOnFirstSelection={true}
                />
              </div>

              {/* totals */}
              <div className="mt-4 space-y-1">
                <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold mb-3">
                  ₹{listing.price} × {dayCount} {dayCount > 1 ? 'nights' : 'night'}
                </h2>
                <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold mb-3">
                  Total price: ₹{listing.price * dayCount}
                </h2>
                <p className="text-gray-700">Start Date: {dateRange[0].startDate.toDateString()}</p>
                <p className="text-gray-700">End Date: {dateRange[0].endDate.toDateString()}</p>
              </div>

              {/* button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-5 w-full rounded-xl bg-rose-600 px-5 py-3.5 text-xl font-semibold text-white hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!customerId}
              >
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ListingDetails
