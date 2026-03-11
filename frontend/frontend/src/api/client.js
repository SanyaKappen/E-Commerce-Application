const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const isJsonResponse = (contentType) =>
  typeof contentType === 'string' && contentType.includes('application/json')

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export const apiFetch = async (path, { token, ...options } = {}) => {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')

  const hasBody = options.body !== undefined && options.body !== null
  if (hasBody && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      hasBody && headers.get('Content-Type') === 'application/json'
        ? JSON.stringify(options.body)
        : options.body,
  })

  const contentType = response.headers.get('content-type')
  const data = isJsonResponse(contentType)
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '')

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Request failed (${response.status})`
    throw new ApiError(message, { status: response.status, data })
  }

  return data
}

