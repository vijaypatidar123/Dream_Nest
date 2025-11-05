import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { setPropertyList } from "../redux/state";
import api from "../utils/api";

const PropertyList = () => {
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user)
  const propertyList = user?.propertyList || [];

  const dispatch = useDispatch()
  const getPropertyList = async () => {
    if (!user?._id) return
    try {
      const { data } = await api.get(`/users/${user._id}/properties`)
      dispatch(setPropertyList(data?.data || data))
    } catch (err) {
      console.log("Fetch all properties failed", err?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getPropertyList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id])

  return loading ? <Loader /> : (
    <>
      <Navbar />
      <h1 className="mx-[100px] my-10 text-blue-950 text-xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold sm:mx-[50px]">Your Property List</h1>
      <div className="flex flex-wrap justify-center gap-6 px-[100px] pb-[120px] xl:px-5">
        {propertyList?.map(
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
  );
};

export default PropertyList;