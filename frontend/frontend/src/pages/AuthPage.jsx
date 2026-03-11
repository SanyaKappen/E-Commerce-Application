import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, login, register, resetAuthStatus } from '../redux/slices/authSlice.js'
import { fetchCart } from '../redux/slices/cartSlice.js'

export default function AuthPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { token, status, error } = useSelector((s) => s.auth)

  const initialMode = new URLSearchParams(location.search).get('mode') || 'login'
  const [mode, setMode] = useState(initialMode === 'register' ? 'register' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    dispatch(resetAuthStatus())
  }, [dispatch])

  useEffect(() => {
    if (!token) return
    dispatch(fetchMe())
    dispatch(fetchCart())
    navigate('/', { replace: true })
  }, [dispatch, navigate, token])

  const submit = async (e) => {
    e.preventDefault()
    if (mode === 'register') {
      await dispatch(register({ email, fullName, password }))
      return
    }
    await dispatch(login({ email, password }))
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-slate-100"
          >
            <span className="text-slate-500">←</span> Back to products
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_140px_-60px_rgba(0,0,0,0.9)]">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative">
            <div className="inline-flex rounded-2xl border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                className={[
                  'rounded-xl px-4 py-2 text-sm font-semibold transition',
                  mode === 'login'
                    ? 'bg-white/10 text-slate-100'
                    : 'text-slate-300 hover:text-slate-100',
                ].join(' ')}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={[
                  'rounded-xl px-4 py-2 text-sm font-semibold transition',
                  mode === 'register'
                    ? 'bg-white/10 text-slate-100'
                    : 'text-slate-300 hover:text-slate-100',
                ].join(' ')}
                onClick={() => setMode('register')}
              >
                Sign up
              </button>
            </div>

            <h1 className="mt-5 text-2xl font-black tracking-tight sm:text-3xl">
              {mode === 'register' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              {mode === 'register'
                ? 'Sign up to sync your cart across devices.'
                : 'Log in to sync your cart and continue shopping.'}
            </p>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              {mode === 'register' ? (
                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-slate-200">Full name</span>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-300/30 focus:ring-2 focus:ring-emerald-300/15"
                  />
                </label>
              ) : null}

              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-200">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-300/30 focus:ring-2 focus:ring-emerald-300/15"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-semibold text-slate-200">Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-emerald-300/30 focus:ring-2 focus:ring-emerald-300/15"
                />
              </label>

              <button
                className="mt-1 inline-flex items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={status === 'loading'}
              >
                {status === 'loading'
                  ? 'Working...'
                  : mode === 'register'
                    ? 'Create account'
                    : 'Sign in'}
              </button>

              {error ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  By continuing, you agree to keep your credentials safe.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

