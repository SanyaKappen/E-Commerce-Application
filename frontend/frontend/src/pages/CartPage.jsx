import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CartItem from '../components/CartItem.jsx'
import { fetchCart } from '../redux/slices/cartSlice.js'

const formatINR = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return String(value ?? '')
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const token = useSelector((s) => s.auth.token)
  const { items, status, error } = useSelector((s) => s.cart)

  useEffect(() => {
    if (!token) return
    dispatch(fetchCart())
  }, [dispatch, token])

  const totals = useMemo(() => {
    const qty = items.reduce((sum, i) => sum + Number(i.count || 0), 0)
    const subtotal = items.reduce((sum, i) => {
      const price = Number(i.productId?.price || 0)
      const itemQty = Number(i.count || 0)
      return sum + price * itemQty
    }, 0)
    return { qty, subtotal }
  }, [items])

  const buyNow = () => {
    if (!token) {
      window.alert('Please login first to continue.')
      navigate('/auth')
      return
    }
    if (!totals.qty) {
      window.alert('Your cart is empty.')
      return
    }
    window.alert('Checkout is not implemented yet.')
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Cart</h1>
          <p className="mt-1 text-sm text-slate-300">
            {token ? 'Your cart items synced from the backend.' : 'Login required to view your cart.'}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
        >
          Continue shopping
        </Link>
      </div>

      {!token ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-bold text-slate-100">Login to use cart</div>
          <div className="mt-1 text-sm text-slate-300">
            Add-to-cart and cart viewing requires login.
          </div>
          <div className="mt-4">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
            >
              Login / Sign up
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {status === 'loading' ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                Loading cart...
              </div>
            ) : null}
            {error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            {items.length ? (
              items.map((i) => <CartItem key={i._id} item={i} />)
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                Cart is empty.
              </div>
            )}
          </div>

          <div className="h-fit rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-extrabold tracking-tight">Order summary</div>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div className="text-slate-300">Items</div>
                <div className="font-bold">{totals.qty}</div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="text-slate-300">Subtotal</div>
                <div className="font-black">{formatINR(totals.subtotal)}</div>
              </div>
            </div>

            <button
              className="mt-5 w-full rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={buyNow}
              disabled={!items.length}
            >
              Buy now
            </button>

            <div className="mt-3 text-xs text-slate-400">
              Checkout flow is a placeholder for now.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

