import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ListingCard from './ListingCard'
import Loader from './Loader'
import { categories } from '../data.jsx'
import { setListings } from '../redux/state'
import api from '../utils/api'

const Listings = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const listings = useSelector((s) => s.listings)

  const getFeedListings = async () => {
    try {
      setLoading(true)
      const endpoint = '/listings'
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {}
      const { data } = await api.get(endpoint, { params })
      // Accept either {data: array} envelope or array directly
      dispatch(setListings({ listings: data?.data || data }))
    } catch (err) {
      console.log('Fetch Listings Failed', err?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getFeedListings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  return (
    <>
      {/* category list */}
      <div className="px-20 py-[50px] flex justify-center flex-wrap gap-[60px] sm:px-5">
        {categories?.map((category, index) => {
          const isSelected = category.label === selectedCategory
          return (
            <div
              key={index}
              onClick={() => setSelectedCategory(category.label)}
              className={`flex flex-col items-center cursor-pointer transition-colors ${
                isSelected ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'
              }`}
            >
              <div className="text-[30px]">{category.icon}</div>
              <p className="text-[18px] font-bold">{category.label}</p>
            </div>
          )
        })}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="px-[60px] pb-[120px] flex flex-wrap justify-center gap-[5px] lg:px-5">
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
      )}
    </>
  )
}

export default Listings