import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { addToCart } from '../redux/slices/cartSlice.js'

const formatINR = (value) => {
  const num = Number(value)
  if (Number.isNaN(num)) return String(value ?? '')
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

export default function Product({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((s) => s.auth.token)

  const name = product?.name || 'Unnamed product'
  const desc = product?.description || ''
  const price = product?.price
  const imageUrl = product?.imageUrl
  const id = product?._id

  const onAdd = async () => {
    if (!token) {
      window.alert('Please login first to add items to cart.')
      navigate('/auth')
      return
    }
    dispatch(addToCart({ product, count: 1 }))
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_25px_90px_-40px_rgba(0,0,0,0.8)]">
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
      </div>

      <div className="relative p-4">
        <Link
          to={id ? `/product/${id}` : '#'}
          aria-disabled={!id}
          className={
            id
              ? 'block overflow-hidden rounded-xl border border-white/10 bg-white/5'
              : 'block cursor-not-allowed overflow-hidden rounded-xl border border-white/10 bg-white/5 opacity-60'
          }
          title={id ? 'View details' : 'Product is missing _id'}
        >
          <div className="relative aspect-[16/10]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs text-slate-300">
                No image
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
          </div>
        </Link>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold tracking-tight">{name}</div>
            {desc ? (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-300">
                {desc}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">No description</p>
            )}
          </div>
          <div className="shrink-0 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-bold text-emerald-100">
            {formatINR(price)}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            to={id ? `/product/${id}` : '#'}
            aria-disabled={!id}
            className={
              id
                ? 'text-xs font-semibold text-slate-200 underline decoration-white/20 underline-offset-4 transition hover:text-slate-100'
                : 'text-xs font-semibold text-slate-400'
            }
          >
            View details
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-3.5 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onAdd}
            disabled={!product?._id}
            title={!product?._id ? 'Product is missing _id' : 'Add to cart'}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}
