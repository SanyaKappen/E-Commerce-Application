import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, removeLocal } from '../redux/slices/cartSlice.js'

const formatINR = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return String(value ?? '')
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

export default function CartItem({ item }) {
  const dispatch = useDispatch()
  const token = useSelector((s) => s.auth.token)
  const product = item.productId || {}

  const onRemove = () => {
    if (String(item._id || '').startsWith('local_') || !token) {
      dispatch(removeLocal({ cartId: item._id }))
      return
    }
    dispatch(removeFromCart({ cartId: item._id }))
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name || 'product'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[10px] text-slate-400">
            N/A
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold">{product.name || 'Item'}</div>
        <div className="mt-0.5 text-xs text-slate-300">
          {formatINR(product.price)} - qty {item.count}
        </div>
      </div>

      <button
        className="inline-flex items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-400/15"
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  )
}
