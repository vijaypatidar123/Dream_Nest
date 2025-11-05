  import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
  import { useEffect } from 'react'
  import HomePage from './pages/HomePage'
  import RegisterPage from './pages/RegisterPage'
  import LoginPage from './pages/LoginPage'
  import CreateListing from './pages/CreateListing'
  import ListingDetails from './pages/ListingDetails'
  import TripList from './pages/TripList'
  import WishList from './pages/WishList'
  import PropertyList from './pages/PropertyList'
  import ReservationList from './pages/ReservationList'
  import CategoryPage from './pages/CategoryPage'
  import SearchPage from './pages/SearchPage'

  function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => {
      window.scrollTo(0, 0)
    }, [pathname])
    return null
  }

  function AppRoutes() {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/properties/:listingId" element={<ListingDetails />} />
          <Route path="/properties/category/:category" element={<CategoryPage />} />
          <Route path="/properties/search/:search" element={<SearchPage />} />
          <Route path="/:userId/trips" element={<TripList />} />
          <Route path="/:userId/wishList" element={<WishList />} />
          <Route path="/:userId/properties" element={<PropertyList />} />
          <Route path="/:userId/reservations" element={<ReservationList />} />
        </Routes>
      </>
    )
  }

  export default function App() {
    return (
      <div className="min-h-screen bg-white">
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    )
  }
