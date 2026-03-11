import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import CartPage from './pages/CartPage.jsx'
import { fetchMe } from './redux/slices/authSlice.js'
import { fetchCart } from './redux/slices/cartSlice.js'

function App() {
  const dispatch = useDispatch()

  const { token } = useSelector((s) => s.auth)
  const cartCount = useSelector((s) =>
    s.cart.items.reduce((sum, i) => sum + Number(i.count || 0), 0),
  )

  useEffect(() => {
    if (!token) return
    dispatch(fetchMe())
    dispatch(fetchCart())
  }, [dispatch, token])

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_800px_at_12%_8%,rgba(52,211,153,0.18),transparent_55%),radial-gradient(1200px_800px_at_85%_12%,rgba(59,130,246,0.18),transparent_60%),linear-gradient(180deg,#020617,#030712)]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <Navbar cartCount={cartCount} />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
