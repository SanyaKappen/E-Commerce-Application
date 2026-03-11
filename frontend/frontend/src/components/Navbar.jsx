import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice.js'

export default function Navbar({ cartCount }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, user } = useSelector((s) => s.auth)

  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-emerald-300/10 blur-md" />
          <div className="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <span className="text-sm font-black tracking-tight">EC</span>
          </div>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-extrabold tracking-tight">E-Commerce</div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {token ? (
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
            <span className="max-w-44 truncate">{user?.email || 'Signed in'}</span>
          </div>
        ) : (
          <Link
            to="/auth"
            className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 sm:block"
          >
            Login / Sign up
          </Link>
        )}

        {token ? (
          <button
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        ) : null}

        <button
          className="group inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
          onClick={() => navigate('/cart')}
        >
          Cart
          <span className="grid h-6 min-w-6 place-items-center rounded-full border border-white/10 bg-white/5 px-1 text-[11px] font-bold text-slate-100">
            {cartCount}
          </span>
        </button>
      </div>
    </div>
  )
}
