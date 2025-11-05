import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null,
  })
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((s) => ({
      ...s,
      [name]: name === 'avatar' ? (files?.[0] || null) : value,
    }))
  }

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ''
    )
  }, [formData.password, formData.confirmPassword])

  const previewUrl = useMemo(() => {
    if (!formData.avatar) return null
    return URL.createObjectURL(formData.avatar)
  }, [formData.avatar])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!passwordMatch) {
      setError('Passwords do not match')
      return
    }

    const fullName = formData.fullName.trim()
    const username = formData.username.trim()
    const email = formData.email.trim()
    const password = formData.password
    const avatarFile = formData.avatar

    if (!fullName || !username || !email || !password || !avatarFile) {
      setError('All fields including avatar are required')
      return
    }

    try {
      setSubmitting(true)
      const fd = new FormData()
      fd.append('fullName', fullName)
      fd.append('username', username)
      fd.append('email', email)
      fd.append('password', password)
      fd.append('avatar', avatarFile)

      await api.post('/users/register', fd, {
        transformRequest: [(data) => data], // no JSON transform
        headers: {}, // let browser set multipart boundary
      })

      navigate('/login')
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors) &&
          err.response.data.errors[0]?.msg) ||
        `Registration failed (${err?.response?.status || ''})`
      setError(apiMsg)
      console.log(
        'Registration failed',
        err?.response?.status,
        err?.response?.data || err?.message
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: "url('/assets/register.jpg')" }}
    >
      <div className="flex flex-col gap-4 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] max-w-[500px] rounded-2xl bg-black/80 p-8 backdrop-blur-sm shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          {error && (
            <div className="w-full rounded-md bg-rose-600/10 text-rose-500 px-4 py-2 text-sm text-center">
              {error}
            </div>
          )}

          {/* Sequence: Full Name, Username, Email, Password, Confirm */}
          <input
            placeholder="Full Name"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border-b border-white/30 bg-transparent px-4 py-2 text-center text-white placeholder-white outline-none transition-all focus:border-white"
          />
          <input
            placeholder="Username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border-b border-white/30 bg-transparent px-4 py-2 text-center text-white placeholder-white outline-none transition-all focus:border-white"
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border-b border-white/30 bg-transparent px-4 py-2 text-center text-white placeholder-white outline-none transition-all focus:border-white"
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border-b border-white/30 bg-transparent px-4 py-2 text-center text-white placeholder-white outline-none transition-all focus:border-white"
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border-b border-white/30 bg-transparent px-4 py-2 text-center text-white placeholder-white outline-none transition-all focus:border-white"
          />

          {!passwordMatch && (
            <p className="text-sm font-semibold text-red-400">
              Passwords are not matched!
            </p>
          )}

          <input
            id="avatar"
            type="file"
            name="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            required
          />
          <label
            htmlFor="avatar"
            className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 text-white hover:opacity-80"
          >
            <img src="/assets/addImage.png" alt="add" className="w-[25px]" />
            <p className="text-sm">Upload Your Photo</p>
          </label>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="profile preview"
              className="mt-2 max-w-[80px] rounded-full object-cover"
            />
          )}

          <button
            type="submit"
            disabled={!passwordMatch || submitting}
            className="mt-3 w-1/2 rounded-md bg-rose-600 px-5 py-2 font-semibold text-white transition hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.7)] disabled:opacity-60"
          >
            {submitting ? 'REGISTERING...' : 'REGISTER'}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-3 block text-center text-[13px] text-white hover:underline"
        >
          Already have an account? Log In Here
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage
