import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { categories, types, facilities } from '../data.jsx'
import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { IoIosImages } from 'react-icons/io'
import { BiTrash } from 'react-icons/bi'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const CreateListing = () => {
  const [category, setCategory] = useState('')
  const [type, setType] = useState('')

  const [formLocation, setFormLocation] = useState({
    streetAddress: '',
    aptSuite: '',
    city: '',
    province: '',
    country: '',
  })
  const handleChangeLocation = (e) => {
    const { name, value } = e.target
    setFormLocation((s) => ({ ...s, [name]: value }))
  }

  const [guestCount, setGuestCount] = useState(1)
  const [bedroomCount, setBedroomCount] = useState(1)
  const [bedCount, setBedCount] = useState(1)
  const [bathroomCount, setBathroomCount] = useState(1)

  const [amenities, setAmenities] = useState([])
  const handleSelectAmenities = (facility) => {
    setAmenities((prev) =>
      prev.includes(facility) ? prev.filter((x) => x !== facility) : [...prev, facility]
    )
  }

  const [photos, setPhotos] = useState([])
  const handleUploadPhotos = (e) => {
    const files = Array.from(e.target.files || [])
    setPhotos((prev) => [...prev, ...files])
  }
  const handleDragPhoto = (result) => {
    if (!result.destination) return
    const items = Array.from(photos)
    const [moved] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, moved)
    setPhotos(items)
  }
  const handleRemovePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  const [formDescription, setFormDescription] = useState({
    title: '',
    description: '',
    highlight: '',
    highlightDesc: '',
    price: 0,
  })
  const handleChangeDescription = (e) => {
    const { name, value } = e.target
    setFormDescription((s) => ({ ...s, [name]: value }))
  }

  const creatorId = useSelector((s) => s.user?._id)
  const navigate = useNavigate()

  const handlePost = async (e) => {
    e.preventDefault()
    try {
      const listingForm = new FormData()
      listingForm.append('creator', creatorId)
      listingForm.append('category', category)
      listingForm.append('type', type)
      listingForm.append('streetAddress', formLocation.streetAddress)
      listingForm.append('aptSuite', formLocation.aptSuite)
      listingForm.append('city', formLocation.city)
      listingForm.append('province', formLocation.province)
      listingForm.append('country', formLocation.country)
      listingForm.append('guestCount', String(guestCount))
      listingForm.append('bedroomCount', String(bedroomCount))
      listingForm.append('bedCount', String(bedCount))
      listingForm.append('bathroomCount', String(bathroomCount))
      listingForm.append('amenities', JSON.stringify(amenities))
      listingForm.append('title', formDescription.title)
      listingForm.append('description', formDescription.description)
      listingForm.append('highlight', formDescription.highlight)
      listingForm.append('highlightDesc', formDescription.highlightDesc)
      listingForm.append('price', String(formDescription.price))

      photos.forEach((file) => listingForm.append('listingPhotos', file))

      await api.post('/listings/create', listingForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      navigate('/')
    } catch (err) {
      console.log('Publish Listing failed', err?.message)
    }
  }

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 px-4 md:px-10 lg:px-[60px] py-10 pb-[120px]">
        <h1 className="text-blue-600 text-3xl md:text-4xl font-bold">Publish Your Place</h1>

        <form onSubmit={handlePost}>
          {/* Step 1 */}
          <div className="bg-white rounded-[20px] mt-10 px-5 py-[30px] md:px-10">
            <h2 className="text-rose-600 text-xl font-semibold">Step 1: Tell us about your place</h2>
            <hr className="my-4 border-t border-gray-300" />

            <h3 className="mt-10 mb-5 text-blue-600 font-semibold">
              Which of these categories best describes your place?
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-5 px-0 md:px-5">
              {categories?.map((item, idx) => {
                const selected = category === item.label
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCategory(item.label)}
                    className={`flex flex-col items-center justify-center w-[110px] h-[90px] rounded-[10px] border cursor-pointer transition-all duration-200 ${
                      selected
                        ? 'border-2 border-rose-600 bg-gray-100'
                        : 'border border-gray-300 hover:border-2 hover:border-rose-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-[30px] text-black">{item.icon}</div>
                    <p className="font-semibold text-black text-center text-sm">{item.label}</p>
                  </button>
                )
              })}
            </div>

            <h3 className="mt-10 mb-5 text-blue-600 font-semibold">
              What type of place will guests have?
            </h3>
            <div className="flex flex-col gap-5">
              {types?.map((item, idx) => {
                const selected = type === item.name
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setType(item.name)}
                    className={`flex items-center justify-between max-w-[600px] rounded-[10px] border px-[30px] py-4 cursor-pointer transition-all duration-300 ${
                      selected
                        ? 'border-2 border-rose-600 bg-gray-100'
                        : 'border border-gray-300 hover:border-2 hover:border-rose-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="max-w-[400px] text-left">
                      <h4 className="mb-1 font-semibold text-base">{item.name}</h4>
                      <p className="text-sm text-gray-700">{item.description}</p>
                    </div>
                    <div className="text-[30px]">{item.icon}</div>
                  </button>
                )
              })}
            </div>

            <h3 className="mt-10 mb-5 text-blue-600 font-semibold">Where's your place located?</h3>

            <div className="max-w-[700px]">
              <div className="location">
                <p className="font-bold mt-5 mb-2">Street Address</p>
                <input
                  type="text"
                  placeholder="Street Address"
                  name="streetAddress"
                  value={formLocation.streetAddress}
                  onChange={handleChangeLocation}
                  required
                  className="w-full rounded-[10px] border border-gray-300 px-[30px] py-[15px] text-base font-semibold outline-none focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 max-w-[700px]">
              <div className="location">
                <p className="font-bold mt-5 mb-2">Apartment, Suite, etc. (if applicable)</p>
                <input
                  type="text"
                  placeholder="Apt, Suite, etc. (if applicable)"
                  name="aptSuite"
                  value={formLocation.aptSuite}
                  onChange={handleChangeLocation}
                  required
                  className="w-full rounded-[10px] border border-gray-300 px-[30px] py-[15px] text-base font-semibold outline-none focus:outline-none"
                />
              </div>
              <div className="location">
                <p className="font-bold mt-5 mb-2">City</p>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formLocation.city}
                  onChange={handleChangeLocation}
                  required
                  className="w-full rounded-[10px] border border-gray-300 px-[30px] py-[15px] text-base font-semibold outline-none focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 max-w-[700px]">
              <div className="location">
                <p className="font-bold mt-5 mb-2">Province</p>
                <input
                  type="text"
                  placeholder="Province"
                  name="province"
                  value={formLocation.province}
                  onChange={handleChangeLocation}
                  required
                  className="w-full rounded-[10px] border border-gray-300 px-[30px] py-[15px] text-base font-semibold outline-none focus:outline-none"
                />
              </div>
              <div className="location">
                <p className="font-bold mt-5 mb-2">Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formLocation.country}
                  onChange={handleChangeLocation}
                  required
                  className="w-full rounded-[10px] border border-gray-300 px-[30px] py-[15px] text-base font-semibold outline-none focus:outline-none"
                />
              </div>
            </div>

            <h3 className="mt-10 mb-5 text-blue-600 font-semibold">
              Share some basics about your place
            </h3>
            <div className="flex flex-wrap gap-10">
              {[
                ['Guests', guestCount, setGuestCount],
                ['Bedrooms', bedroomCount, setBedroomCount],
                ['Beds', bedCount, setBedCount],
                ['Bathrooms', bathroomCount, setBathroomCount],
              ].map(([label, value, setter], idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-[30px] rounded-[10px] border border-gray-300 px-[15px] py-[15px]"
                >
                  <p className="font-semibold">{label}</p>
                  <div className="flex items-center gap-2 text-xl">
                    <RemoveCircleOutline
                      onClick={() => value > 1 && setter(value - 1)}
                      sx={{ fontSize: 25, cursor: 'pointer', '&:hover': { color: '#FF385C' } }}
                    />
                    <p>{value}</p>
                    <AddCircleOutline
                      onClick={() => setter(value + 1)}
                      sx={{ fontSize: 25, cursor: 'pointer', '&:hover': { color: '#FF385C' } }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-[20px] mt-10 px-5 py-[30px] md:px-10">
            <h2 className="text-rose-600 text-xl font-semibold">
              Step 2: Make your place stand out
            </h2>
            <hr className="my-4 border-t border-gray-300" />

            <h3 className="mt-10 mb-5 text-blue-600 font-semibold">
              Tell guests what your place has to offer
            </h3>
            <div className="flex flex-wrap gap-5">
              {facilities?.map((item, idx) => {
                const selected = amenities.includes(item.name)
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectAmenities(item.name)}
                    className={`flex flex-col items-center justify-center w-[200px] h-[90px] rounded-[10px] border cursor-pointer transition-all duration-200 ${
                      selected
                        ? 'border-2 border-rose-600 bg-gray-100'
                        : 'border border-gray-300 hover:border-2 hover:border-rose-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-[30px]">{item.icon}</div>
                    <p className="font-semibold text-sm">{item.name}</p>
                  </button>
                )
              })}
            </div>

            <h3 className="mt-10 mb-5 text-blue-600 font-semibold">Add some photos of your place</h3>
            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="flex flex-wrap gap-[15px]"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {photos.length < 1 && (
                      <>
                        <input
                          id="image"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label
                          htmlFor="image"
                          className="cursor-pointer rounded-[10px] border border-dashed border-gray-300 px-[100px] py-10 text-center flex flex-col items-center justify-center md:px-20 sm:px-[30px]"
                        >
                          <div className="text-[60px]">
                            <IoIosImages />
                          </div>
                          <p className="font-semibold text-center">Upload from your device</p>
                        </label>
                      </>
                    )}

                    {photos.length >= 1 && (
                      <>
                        {photos.map((photo, index) => (
                          <Draggable key={index} draggableId={index.toString()} index={index}>
                            {(dragProvided) => (
                              <div
                                className="relative w-[250px] h-[150px] cursor-move"
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                              >
                                <img
                                  src={URL.createObjectURL(photo)}
                                  alt="place"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(index)}
                                  className="absolute right-0 top-0 bg-white/80 px-[3px] py-[3px] text-xl border-none cursor-pointer hover:text-rose-600"
                                  aria-label="remove photo"
                                >
                                  <BiTrash />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        <input
                          id="image"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label
                          htmlFor="image"
                          className="flex h-[150px] w-[250px] cursor-pointer flex-col items-center justify-center border border-dashed border-gray-300"
                        >
                          <div className="text-[60px]">
                            <IoIosImages />
                          </div>
                          <p className="text-center font-semibold">Upload from your device</p>
                        </label>
                      </>
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <h3 className="mt-10 mb-5 text-blue-600 font-semibold">
              What make your place attractive and exciting?
            </h3>

            <div className="description">
              <p className="font-bold mt-5 mb-2">Title</p>
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={formDescription.title}
                onChange={handleChangeDescription}
                required
                className="w-full max-w-[600px] md:max-w-[450px] sm:max-w-[350px] xs:max-w-[280px] rounded-[10px] border border-gray-300 px-[30px] py-[15px] text-base font-semibold outline-none focus:outline-none"
              />

              <p className="font-bold mt-5 mb-2">Description</p>
              <textarea
                placeholder="Description"
                name="description"
                value={formDescription.description}
                onChange={handleChangeDescription}
                required
                className="w-full max-w-[600px] md:max-w-[450px] sm:max-w-[350px] xs:max-w-[280px] rounded-[10px] border border-gray-300 px-[30px] py-[15px] text-base font-semibold outline-none focus:outline-none"
              />

              <p className="font-bold mt-5 mb-2">Highlight</p>
              <input
                type="text"
                placeholder="Highlight"
                name="highlight"
                value={formDescription.highlight}
                onChange={handleChangeDescription}
                required
                className="w-full max-w-[600px] md:max-w-[450px] sm:max-w-[350px] xs:max-w-[280px] rounded-[10px] border border-gray-300 px-[30px] py-[15px] text-base font-semibold outline-none focus:outline-none"
              />

              <p className="font-bold mt-5 mb-2">Highlight details</p>
              <textarea
                placeholder="Highlight details"
                name="highlightDesc"
                value={formDescription.highlightDesc}
                onChange={handleChangeDescription}
                required
                className="w-full max-w-[600px] md:max-w-[450px] sm:max-w-[350px] xs:max-w-[280px] rounded-[10px] border border-gray-300 px-[30px] py-[15px] text-base font-semibold outline-none focus:outline-none"
              />

              <p className="font-bold mt-5 mb-2">Now, set your PRICE</p>
              <div className="flex items-center">
                <span className="text-[25px] font-bold mr-5">₹</span>
                <input
                  type="number"
                  placeholder="100"
                  name="price"
                  value={formDescription.price}
                  onChange={handleChangeDescription}
                  className="w-[200px] rounded-[10px] border border-gray-300 px-[30px] py-[15px] text-base font-semibold outline-none focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-10 rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-[0_0_10px_3px_rgb(117,117,117)]"
          >
            CREATE YOUR LISTING
          </button>
        </form>
      </div>

      <Footer />
    </>
  )
}

export default CreateListing