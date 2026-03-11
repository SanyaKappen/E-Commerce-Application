import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from '../../api/client.js'

const STORAGE_KEY = 'ecom_token'

const initialState = {
  token: localStorage.getItem(STORAGE_KEY) || null,
  status: 'idle',
  error: null,
  user: null,
  userStatus: 'idle',
  userError: null,
}

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, fullName, password }, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/api/user/register', {
        method: 'POST',
        body: { email, fullName, password },
      })
      if (data && typeof data === 'object' && data.token) return data.token
      return null
    } catch (err) {
      return rejectWithValue(err.message || 'Register failed')
    }
  },
)

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/api/user/login', {
        method: 'POST',
        body: { email, password },
      })

      if (!data || typeof data !== 'object' || !data.token) {
        throw new Error('Login response missing token')
      }

      return data.token
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed')
    }
  },
)

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token
    if (!token) return rejectWithValue('Missing token')
    try {
      const data = await apiFetch('/api/user/me', { token })
      return data.user || data
    } catch (err) {
      return rejectWithValue(err.message || 'Fetch user failed')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
    resetAuthStatus(state) {
      state.status = 'idle'
      state.error = null
    },
    logout(state) {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
      state.userStatus = 'idle'
      state.userError = null
      localStorage.removeItem(STORAGE_KEY)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload) {
          state.token = action.payload
          localStorage.setItem(STORAGE_KEY, action.payload)
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload
        localStorage.setItem(STORAGE_KEY, action.payload)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(fetchMe.pending, (state) => {
        state.userStatus = 'loading'
        state.userError = null
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.userStatus = 'succeeded'
        state.user = action.payload
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.userStatus = 'failed'
        state.userError = action.payload || action.error.message
      })
  },
})

export const { clearAuthError, resetAuthStatus, logout } = authSlice.actions
export default authSlice.reducer
