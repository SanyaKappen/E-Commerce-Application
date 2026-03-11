import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../components/Product.jsx'
import { fetchProducts } from '../redux/slices/productsSlice.js'

export default function Home() {
  const dispatch = useDispatch()
  const { items: products, status: productsStatus, error: productsError } =
    useSelector((s) => s.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const productsBody = useMemo(() => {
    if (productsStatus === 'loading')
      return <p className="text-sm text-slate-300">Loading products...</p>
    if (productsStatus === 'failed')
      return <p className="text-sm text-rose-200">Failed to load products: {productsError}</p>
    if (!products.length) return <p className="text-sm text-slate-300">No products yet.</p>

    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Product key={p._id || p.id || p.name} product={p} />
        ))}
      </div>
    )
  }, [products, productsError, productsStatus])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
      <section className="mb-6">
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
          Discover the extraordinary in every detail.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
           Explore our latest arrivals and experience quality delivered to your door.
        </p>
      </section>
      {productsBody}
    </div>
  )
}
