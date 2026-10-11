import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/services/api'
import { AuthLayout, AuthField } from './AuthLayout'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const trimmedEmail = email.trim()
    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    try {
      const result = await api.login(trimmedEmail, password)
      setAuth(result.token, {
        id: result.id,
        name: result.name,
        email: result.email,
        createdAt: result.createdAt,
      })
      setSuccess('Login successful')
      navigate('/dashboard')
    } catch (err) {
      if (err.message.includes('Invalid') || err.message.includes('credentials')) {
        setError('Invalid email or password.')
      } else {
        setError(err.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-600">
          Welcome back
        </p>
        <h1 className="mt-2.5 text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
          Keep <span className="font-serif-accent text-[1.08em] text-[#f97316]">crafting</span>.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Sign in to pick up where you left off.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <AuthField
            id="email"
            label="Email"
            icon={Mail}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthField
            id="password"
            label="Password"
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-600 outline-none transition-colors hover:text-gray-300 focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {error && (
            <div
              key={error}
              role="alert"
              className="animate-shake flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400"
            >
              <Check size={16} className="shrink-0" />
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary group flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-[#1c1d1d] pt-6 text-center text-sm text-gray-500">
          New to XCrafter?{' '}
          <Link
            to="/signup"
            className="font-medium text-[#f97316] underline-offset-4 transition-colors hover:text-[#fb923c] hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default LoginForm