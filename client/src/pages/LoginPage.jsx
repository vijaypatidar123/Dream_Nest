import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { setLogin } from '../redux/state/' // adjust path to your slice

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('') // username OR email
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isEmail = (value) => value.includes('@') // lightweight check; backend is source of truth

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!identifier || !password) return
    try {
      setSubmitting(true)

      const body = isEmail(identifier)
        ? { email: identifier.trim(), username: '', password }
        : { username: identifier.trim(), email: '', password }

      const { data } = await api.post('/users/login', body)

      // expect { user, accessToken, refreshToken } in data or data.data.user
      const user = data.user || data?.data?.user
      const accessToken = data.accessToken || data?.data?.accessToken || data?.token

      dispatch(
        setLogin({
          user,
          token: accessToken,
        })
      )

      if (accessToken) localStorage.setItem('accessToken', accessToken)

      navigate('/')
    } catch (err) {
      console.log('Login failed', err?.response?.status, err?.response?.data || err?.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="flex h-screen w-screen items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: "url('/assets/login.jpg')" }}
    >
      <div className="flex flex-col gap-4 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-w-[500px] rounded-2xl bg-black/80 p-8 backdrop-blur-sm shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Username or Email"
            className="w-full border-b border-white/30 bg-transparent px-4 py-2 text-center text-white placeholder-white outline-none"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username email"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border-b border-white/30 bg-transparent px-4 py-2 text-center text-white placeholder-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 w-1/2 rounded-md bg-rose-600 px-5 py-2 font-semibold text-white transition hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.7)] disabled:opacity-60"
          >
            {submitting ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </form>

        <Link to="/register" className="text-center text-white text-[17px] font-semibold hover:underline">
          Don't have an account? Sign Up Here
        </Link>

        <p className="text-center text-white text-[13px]">
          By logging in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
