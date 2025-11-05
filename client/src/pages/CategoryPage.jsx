import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import ListingCard from '../components/ListingCard'
import { setListings } from '../redux/state' // or ../redux/state if you keep original
import api from '../utils/api' // axios instance

const CategoryPage = () => {
  const [loading, setLoading] = useState(true)
  const { category } = useParams()
  const dispatch = useDispatch()
  const listings = useSelector((s) => s.listings)

  const getFeedListings = async () => {
    try {
      const { data } = await api.get('/listings', { params: { category } })
      // axios already parses JSON and puts it in data
      dispatch(setListings({ listings: data?.data || data }))
    } catch (err) {
      console.log('Fetch Listings Failed', err?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    getFeedListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  if (loading) return <Loader />

  return (
    <>
      <Navbar />
      <h1 className="mx-[100px] my-10 text-blue-600 sm:mx-[50px]">
        {category} listings
      </h1>

      <div className="flex flex-wrap justify-center gap-6 px-[100px] pb-[120px] xl:px-5">
        {listings?.map(
          ({
            _id,
            creator,
            listingPhotoPaths,
            city,
            province,
            country,
            category,
            type,
            price,
            booking = false,
          }) => (
            <ListingCard
              key={_id}
              listingId={_id}
              creator={creator}
              listingPhotoPaths={listingPhotoPaths}
              city={city}
              province={province}
              country={country}
              category={category}
              type={type}
              price={price}
              booking={booking}
            />
          )
        )}
      </div>

      <Footer />
    </>
  )
}

export default CategoryPage
