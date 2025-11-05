import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ListingCard from '../components/ListingCard'

const WishList = () => {
  const wishList = useSelector((s) => s.user?.wishList || [])
  
  return (
    <>
      <Navbar />
      <h1 className="mx-[100px] my-10 text-blue-950 text-xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold sm:mx-[50px]">Your Wish List</h1>
      
      <div className="flex flex-wrap justify-center gap-6 px-[100px] pb-[120px] xl:px-5">
        {wishList?.map(
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

export default WishList
