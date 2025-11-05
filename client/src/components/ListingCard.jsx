import { useState } from 'react'
import { ArrowForwardIos, ArrowBackIosNew, Favorite } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setWishList } from '../redux/state/'
import api from '../utils/api'

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths = [],
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
}) => {
  // slider
  const [currentIndex, setCurrentIndex] = useState(0)
  const goToPrevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + listingPhotoPaths.length) % listingPhotoPaths.length)
  const goToNextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % listingPhotoPaths.length)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // auth + wishlist
  const user = useSelector((s) => s.user)
  const wishList = user?.wishList || []
  const isLiked = wishList?.some((item) => item?._id === listingId)

  const patchWishList = async () => {
    if (!user) {
      alert("Please log in to add items to your wishlist")
      return
    }
    if (user?._id === creator?._id) {
      alert("You cannot add your own listing to your wishlist")
      return
    }
    try {
      // const { data } = await api.patch(`/users/${user._id}/${listingId}`, null, {
      //   // headers: { 'Content-Type': 'application/json' },

      // })
      const { data } = await api.patch(`/users/${user._id}/${listingId}`, {})
      

      dispatch(setWishList(data?.wishList || []))
    } catch (e) {
      console.log('Wishlist toggle failed', e?.message)
      alert("Failed to update wishlist. Please try again.")
    }
  }

  const imageSrc = (p) => {
    if (/^https?:\/\//i.test(p)) return p
    return p?.startsWith('/public') ? p.replace('/public', '') : p
  }

  return (
    <div
      className="relative cursor-pointer rounded-[10px] p-[10px] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
      onClick={() => navigate(`/properties/${listingId}`)}
    >
      {/* slider container */}
      <div className="w-[300px] overflow-hidden rounded-[10px] mb-[10px]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths && listingPhotoPaths.length > 0 ? (
            listingPhotoPaths.map((photo, idx) => (
              <div key={idx} className="relative flex-shrink-0 flex-grow-0 basis-full w-full h-[270px] flex items-center">
                <img
                  src={imageSrc(photo)}
                  alt={`photo ${idx + 1}`}
                  className="w-full h-full object-cover brightness-[0.85]"
                  loading="lazy"
                />

                {/* prev button */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevSlide()
                  }}
                  className="absolute left-[10px] top-1/2 -translate-y-1/2 p-[6px] rounded-full border-none cursor-pointer flex items-center justify-center bg-white/70 hover:bg-white z-[9999]"
                >
                  <ArrowBackIosNew sx={{ fontSize: '15px' }} />
                </div>

                {/* next button */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNextSlide()
                  }}
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 p-[6px] rounded-full border-none cursor-pointer flex items-center justify-center bg-white/70 hover:bg-white z-[9999]"
                >
                  <ArrowForwardIos sx={{ fontSize: '15px' }} />
                </div>
              </div>
            ))
          ) : (
            <div className="relative flex-shrink-0 flex-grow-0 basis-full w-full h-[270px] flex items-center">
              <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center text-gray-600">
                No Photo Available
              </div>
            </div>
          )}
        </div>
      </div>

      {/* location + meta */}
      <h3 className="font-bold text-[18px]">
        {city}, {province}, {country}
      </h3>
      <p className="text-[16px]">{category}</p>

      {!booking ? (
        <>
          <p className="text-[16px]">{type}</p>
          <p className="text-[16px]">
            <span className="font-bold text-[18px]">₹{price}</span> per night
          </p>
        </>
      ) : (
        <>
          <p className="text-[16px]">
            {startDate} - {endDate}
          </p>
          <p className="text-[16px]">
            <span className="font-bold text-[18px]">₹{totalPrice}</span> total
          </p>
        </>
      )}

      {/* favorite button */}
      <button
        type="button"
        className="absolute right-[20px] top-[20px] border-none text-[20px] cursor-pointer z-[999] bg-transparent"
        onClick={(e) => {
          e.stopPropagation()
          patchWishList()
        }}
        style={{
          opacity: !user ? 0.5 : 1,
          cursor: !user ? 'not-allowed' : 'pointer'
        }}
        title={!user ? "Please log in to add to wishlist" : "Add to wishlist"}
        aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isLiked ? (
          <Favorite sx={{ color: 'red' }} />
        ) : (
          <Favorite sx={{ color: user ? 'white' : '#ccc' }} />
        )}
      </button>
    </div>
  )
}

export default ListingCard