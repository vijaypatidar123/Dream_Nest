import { useState } from 'react'
import { IconButton } from '@mui/material'
import { Search, Person, Menu } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLogout } from '../redux/state' // adjust to your slice path

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false)
  const [search, setSearch] = useState('')
  const user = useSelector((s) => s.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSearch = () => {
    if (!search) return
    navigate(`/properties/search/${encodeURIComponent(search)}`)
    setDropdownMenu(false)
  }

  const avatarUrl =
    user?.avatar ||
    (user?.profileImagePath
      ? user.profileImagePath.replace('/public', '')
      : null)

  return (
    <header className="relative flex items-center justify-between px-[60px] py-2 sm:px-5">
      {/* Logo */}
      <Link to="/" className="inline-block">
        <img src="/assets/logo.png" alt="logo" className="w-[100px]" />
      </Link>

      {/* Search (hidden on lg and below like original) */}
      <div className="hidden xl:flex items-center gap-10 h-[50px] rounded-full border border-gray-300 px-5 hover:shadow transition-shadow">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none border-none bg-transparent"
        />
        <IconButton disabled={!search} onClick={onSearch}>
          <Search sx={{ color: '#e11d48' }} />{/* rose-600 */}
        </IconButton>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {user ? (
          <Link
            to="/create-listing"
            className="hidden sm:inline font-bold text-blue-600 hover:text-rose-500"
          >
            Become A Host
          </Link>
        ) : (
          <Link
            to="/login"
            className="hidden sm:inline font-bold text-blue-600 hover:text-rose-500"
          >
            Become A Host
          </Link>
        )}

        {/* Account button */}
        <button
          type="button"
          className="flex items-center gap-2 h-[50px] rounded-full border border-gray-300 bg-white px-3 hover:shadow transition-shadow"
          onClick={() => setDropdownMenu((v) => !v)}
        >
          <Menu sx={{ color: '#6b7280' }} />{/* gray-500 */}
          {!user ? (
            <Person sx={{ color: '#6b7280' }} />
          ) : avatarUrl ? (
            <img
              src={avatarUrl}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <Person sx={{ color: '#6b7280' }} />
          )}
        </button>

        {/* Dropdown */}
        {dropdownMenu && !user && (
          <div className="absolute right-[60px] sm:right-5 top-[80px] z-50 flex w-[200px] flex-col rounded-2xl border border-gray-200 bg-white py-2 shadow">
            <Link
              to="/login"
              className="w-full px-4 py-2 font-bold text-blue-600 hover:bg-gray-100 hover:text-rose-500"
              onClick={() => setDropdownMenu(false)}
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="w-full px-4 py-2 font-bold text-blue-600 hover:bg-gray-100 hover:text-rose-500"
              onClick={() => setDropdownMenu(false)}
            >
              Sign Up
            </Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="absolute right-[60px] sm:right-5 top-[80px] z-50 flex w-[200px] flex-col rounded-2xl border border-gray-200 bg-white py-2 shadow">
            <Link
              to={`/${user._id}/trips`}
              className="w-full px-4 py-2 font-bold text-blue-600 hover:bg-gray-100 hover:text-rose-500"
              onClick={() => setDropdownMenu(false)}
            >
              Trip List
            </Link>
            <Link
              to={`/${user._id}/wishList`}
              className="w-full px-4 py-2 font-bold text-blue-600 hover:bg-gray-100 hover:text-rose-500"
              onClick={() => setDropdownMenu(false)}
            >
              Wish List
            </Link>
            <Link
              to={`/${user._id}/properties`}
              className="w-full px-4 py-2 font-bold text-blue-600 hover:bg-gray-100 hover:text-rose-500"
              onClick={() => setDropdownMenu(false)}
            >
              Property List
            </Link>
            <Link
              to={`/${user._id}/reservations`}
              className="w-full px-4 py-2 font-bold text-blue-600 hover:bg-gray-100 hover:text-rose-500"
              onClick={() => setDropdownMenu(false)}
            >
              Reservation List
            </Link>
            <Link
              to="/create-listing"
              className="w-full px-4 py-2 font-bold text-blue-600 hover:bg-gray-100 hover:text-rose-500"
              onClick={() => setDropdownMenu(false)}
            >
              Become A Host
            </Link>
            <Link
              to="/login"
              className="w-full px-4 py-2 font-bold text-blue-600 hover:bg-gray-100 hover:text-rose-500"
              onClick={() => {
                dispatch(setLogout())
                setDropdownMenu(false)
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
