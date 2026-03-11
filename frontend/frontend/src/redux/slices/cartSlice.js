import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from '../../api/client.js'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const normalizeCart = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (typeof data === 'object' && Array.isArray(data.carts)) return data.carts
  if (typeof data === 'object' && Array.isArray(data.items)) return data.items
  return []
}

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    if (!token) return rejectWithValue('Missing token')
    try {
      const data = await apiFetch('/api/cart', { token })
      return normalizeCart(data)
    } catch (err) {
      return rejectWithValue(err.message || 'Fetch cart failed')
    }
  },
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product, count = 1 }, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    if (!token) return rejectWithValue('LOGIN_REQUIRED')

    try {
      await apiFetch('/api/cart', {
        method: 'POST',
        token,
        body: { productId: product._id, count: Number(count) },
      })
      const refreshed = await apiFetch('/api/cart', { token })
      return normalizeCart(refreshed)
    } catch (err) {
      return rejectWithValue(err.message || 'Add to cart failed')
    }
  },
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ cartId }, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    if (!token) return rejectWithValue('Missing token')
    try {
      await apiFetch(`/api/cart/${cartId}`, { method: 'DELETE', token })
      const refreshed = await apiFetch('/api/cart', { token })
      return normalizeCart(refreshed)
    } catch (err) {
      return rejectWithValue(err.message || 'Remove from cart failed')
    }
  },
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addLocal(state, action) {
      const { product, count } = action.payload
      const existing = state.items.find((i) => (i.productId?._id || i._id) === product._id)
      if (existing) {
        existing.count = String(Number(existing.count || 0) + Number(count || 1))
      } else {
        state.items.push({
          _id: `local_${product._id}`,
          productId: product,
          count: String(count || 1),
        })
      }
    },
    removeLocal(state, action) {
      state.items = state.items.filter((i) => i._id !== action.payload.cartId)
    },
    clearLocal(state) {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload || action.error.message
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload || action.error.message
      })
  },
})

export const { addLocal, removeLocal, clearLocal } = cartSlice.actions
export default cartSlice.reducer
