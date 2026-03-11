import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client.js'
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

export default function ProductPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((s) => s.auth.token)

  const [result, setResult] = useState({
    id: null,
    status: 'idle', // idle | succeeded | failed
    error: null,
    product: null,
  })

  useEffect(() => {
    let cancelled = false

    apiFetch(`/api/products/${id}`)
      .then((data) => {
        if (cancelled) return
        setResult({ id, status: 'succeeded', error: null, product: data })
      })
      .catch((err) => {
        if (cancelled) return
        setResult({
          id,
          status: 'failed',
          error: err.message || 'Failed to load product',
          product: null,
        })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const status = result.id === id ? result.status : 'loading'
  const error = result.id === id ? result.error : null
  const product = result.id === id ? result.product : null

  const body = useMemo(() => {
    if (status === 'loading') {
      return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          Loading product...
        </div>
      )
    }
    if (status === 'failed') {
      return (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5 text-sm text-rose-100">
          {error}
        </div>
      )
    }
    if (!product) return null

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="relative aspect-[16/12]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-sm text-slate-300">
                No image
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-xl font-black tracking-tight sm:text-2xl">
              {product.name}
            </h2>
            <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm font-extrabold text-emerald-100">
              {formatINR(product.price)}
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {product.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => {
                if (!token) {
                  window.alert('Please login first to add items to cart.')
                  navigate('/auth')
                  return
                }
                dispatch(addToCart({ product, count: 1 }))
              }}
              disabled={!product?._id}
            >
              Add to cart
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              Back to products
            </Link>
          </div>
        </div>
      </div>
    )
  }, [dispatch, error, navigate, product, status, token])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
      <div className="mb-5 text-xs text-slate-300">
        <Link to="/" className="hover:text-slate-100">
          Products
        </Link>
        <span className="px-2 text-slate-500">/</span>
        <span className="text-slate-200">{id}</span>
      </div>
      {body}
    </div>
  )
}
