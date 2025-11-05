import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import ListingCard from '../components/ListingCard'
import { setTripList } from '../redux/state' // adjust to your slice path
import api from '../utils/api'

const TripList = () => {
  const [loading, setLoading] = useState(true)
  const userId = useSelector((s) => s.user?._id)
  const tripList = useSelector((s) => s.user?.tripList || [])
  const dispatch = useDispatch()

  const getTripList = async () => {
    if (!userId) return
    try {
      const { data } = await api.get(`/users/${userId}/trips`)
      // accept {data: [...] } or [...] directly
      dispatch(setTripList(data?.data || data))
    } catch (err) {
      console.log('Fetch Trip List failed!', err?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTripList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  if (loading) return <Loader />

  return (
    <>
      <Navbar />
      <h1 className="mx-[100px] my-10 text-blue-950 text-xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold sm:mx-[50px]">Your Trip List</h1>

      <div className="flex flex-wrap justify-center gap-6 px-[100px] pb-[120px] xl:px-5">
        {tripList?.map(
          ({
            listingId,
            hostId,
            startDate,
            endDate,
            totalPrice,
            booking = true,
            _id,
          }) => (
            <ListingCard
              key={_id || listingId?._id}
              listingId={listingId?._id}
              creator={hostId}
              listingPhotoPaths={listingId?.listingPhotoPaths}
              city={listingId?.city}
              province={listingId?.province}
              country={listingId?.country}
              category={listingId?.category}
              startDate={new Date(startDate).toDateString()}
              endDate={new Date(endDate).toDateString()}
              totalPrice={totalPrice}
              booking={booking}
            />
          )
        )}
      </div>

      <Footer />
    </>
  )
}

export default TripList
