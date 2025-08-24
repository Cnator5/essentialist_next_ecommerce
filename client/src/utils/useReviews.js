import { useCallback, useEffect, useRef, useState } from 'react'
import SummaryApi, { baseURL } from '../common/SummaryApi'

// Try to get token from localStorage, cookies, or env if needed
function getAuthToken() {
  try {
    if (typeof window !== 'undefined') {
      const ls = window.localStorage?.getItem('token')
      if (ls) return ls
      const m = document.cookie?.match(/(?:^|;\s*)token=([^;]+)/)
      if (m && m[1]) return decodeURIComponent(m[1])
    }
  } catch {}
  return null
}

function getAuthHeaders() {
  const token = getAuthToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return { headers, token }
}

export default function useReviews(productId, { page = 1, limit = 10 } = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const pageRef = useRef(page)
  const limitRef = useRef(limit)

  const parseError = async (res) => {
    try {
      const j = await res.json()
      return j?.message || j?.error || res.statusText || 'Request failed'
    } catch {
      return res.statusText || 'Request failed'
    }
  }

  const fetchReviews = useCallback(async (pageArg = pageRef.current) => {
    if (!productId) return
    setLoading(true)
    setAuthError('')
    try {
      const q = `?limit=${encodeURIComponent(limitRef.current)}&page=${encodeURIComponent(pageArg)}&t=${Date.now()}`
      const { headers } = getAuthHeaders()
      const res = await fetch(`${baseURL}${SummaryApi.reviewsList.url(productId, q)}`, {
        method: 'GET',
        headers,
        cache: 'no-store',
      })
      if (!res.ok) {
        const msg = await parseError(res)
        // Do not block showing reviews if unauthorized; you may still allow public reads.
        // If your API protects reads too, expose a helpful message.
        if (res.status === 401 || res.status === 403) {
          setAuthError('You must be logged in to view or post reviews.')
        }
        throw new Error(msg)
      }
      const json = await res.json()
      const list = json?.data?.items || json?.data || []
      setItems(Array.isArray(list) ? list : [])
    } catch {
      // keep items as-is on error
    } finally {
      setLoading(false)
    }
  }, [productId])

  const upsertReview = useCallback(async ({ rating, title, comment }) => {
    const { headers, token } = getAuthHeaders()
    if (!token) {
      throw new Error('You must be logged in to post a review.')
    }
    const res = await fetch(`${baseURL}${SummaryApi.reviewsUpsert.url}`, {
      method: SummaryApi.reviewsUpsert.method.toUpperCase(),
      headers,
      body: JSON.stringify({ productId, rating, title, comment }),
    })
    if (!res.ok) {
      const msg = await parseError(res)
      throw new Error(msg)
    }
    return res.json().catch(() => ({}))
  }, [productId])

  const deleteMyReview = useCallback(async () => {
    const { headers, token } = getAuthHeaders()
    if (!token) {
      throw new Error('You must be logged in to delete your review.')
    }
    const res = await fetch(`${baseURL}${SummaryApi.reviewsDelete.url(productId)}`, {
      method: SummaryApi.reviewsDelete.method.toUpperCase(),
      headers,
    })
    if (!res.ok) {
      const msg = await parseError(res)
      throw new Error(msg)
    }
    return res.json().catch(() => ({}))
  }, [productId])

  useEffect(() => {
    fetchReviews(1)
  }, [fetchReviews])

  return { items, loading, upsertReview, deleteMyReview, fetchReviews, authError }
}