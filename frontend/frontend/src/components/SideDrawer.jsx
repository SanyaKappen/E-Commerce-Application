import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CartItem from './CartItem.jsx'
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

export default function SideDrawer({ open, onClose }) {
  const dispatch = useDispatch()
  const { token } = useSelector((s) => s.auth)
  const { items: cartItems, error: cartError } = useSelector((s) => s.cart)

  useEffect(() => {
    if (!open) return
    if (token) dispatch(fetchCart())
  }, [dispatch, open, token])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const total = useMemo(() => {
    return cartItems.reduce((sum, i) => {
      const price = Number(i.productId?.price || 0)
      const qty = Number(i.count || 0)
      return sum + price * qty
    }, 0)
  }, [cartItems])

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={[
        'fixed inset-y-0 right-0 z-50 w-[min(420px,92vw)]',
        'translate-x-full transition-transform duration-200 ease-out',
        'border-l border-white/10 bg-slate-950/75 backdrop-blur-xl',
        'shadow-[0_40px_140px_-60px_rgba(0,0,0,0.9)]',
        open ? 'translate-x-0' : '',
      ].join(' ')}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-emerald-300/10 blur-md" />
            <div className="relative grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <span className="text-xs font-black">C</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold tracking-tight">Your cart</div>
            <div className="text-xs text-slate-300">{cartItems.length} items</div>
          </div>
          <div className="flex-1" />
          <button
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-auto px-4 py-4">
          {!token ? (
            <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-bold text-slate-100">Sign in to use cart</div>
              <div className="mt-1 text-xs text-slate-300">
                Adding items to cart requires login.
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-3.5 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
                  onClick={onClose}
                >
                  Login / Sign up
                </Link>
              </div>
            </div>
          ) : null}

          {cartError ? <div className="mb-3 text-xs text-rose-200">{cartError}</div> : null}

          {cartItems.length ? (
            <div className="grid gap-3">
              {cartItems.map((i) => (
                <CartItem key={i._id} item={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Cart is empty.
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-black/15 px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-slate-300">Subtotal</div>
            <div className="text-lg font-black tracking-tight">{formatINR(total)}</div>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Tip: add a product and you will see it appear here instantly (local if not logged in).
          </div>
        </div>
      </div>
    </aside>
  )
}
