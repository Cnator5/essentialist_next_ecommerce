'use client'

import { useState, useEffect } from 'react'
import useReviews from '../../../utils/useReviews'
import useRating from '../../../utils/useRating'

export default function ReviewsSection({ productId }) {
  const { items, loading, upsertReview, deleteMyReview, fetchReviews } = useReviews(productId, { page: 1, limit: 10 })
  const { myRating, rate } = useRating(productId)
  const [form, setForm] = useState({ rating: myRating || 0, title: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setForm((f) => ({ ...f, rating: myRating || 0 }))
  }, [myRating])

  useEffect(() => {
    // ensure we have the latest reviews on mount
    fetchReviews(1)
  }, [fetchReviews])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const r = Number(form.rating)
      if (!r || r < 0.5 || r > 5) throw new Error('Please provide a rating between 0.5 and 5 (0.5 step).')

      // Persist rating if changed
      if (r !== myRating) {
        await rate(r)
      }

      // Upsert review
      await upsertReview({ rating: r, title: form.title?.trim(), comment: form.comment?.trim() })

      // Refresh list and ensure it renders immediately
      await fetchReviews(1)

      setSuccess('Review saved.')
      setForm((f) => ({ ...f, title: '', comment: '' }))
    } catch (err) {
      setError(err?.message || 'Failed to save review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      await deleteMyReview()
      await fetchReviews(1)
      setSuccess('Your review was removed.')
    } catch (err) {
      setError(err?.message || 'Failed to delete review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-3 text-slate-900">Reviews</h3>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-900">Your rating (0.5–5)</label>
          <input
            type="number"
            min={0.5}
            max={5}
            step={0.5}
            value={form.rating}
            onChange={(e) => setForm((s) => ({ ...s, rating: Number(e.target.value) }))}
            className="border border-slate-300 rounded px-3 py-2 w-32 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
            inputMode="decimal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            maxLength={140}
            placeholder="Summarize your review"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900">Comment</label>
          <textarea
            value={form.comment}
            onChange={(e) => setForm((s) => ({ ...s, comment: e.target.value }))}
            className="border border-slate-300 rounded px-3 py-2 w-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            rows={4}
            maxLength={5000}
            placeholder="Share your experience…"
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60 transition-colors"
          >
            {submitting ? 'Saving…' : 'Submit review'}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleDelete}
            className="px-4 py-2 rounded border border-rose-300 text-rose-700 hover:bg-rose-50 disabled:opacity-60 transition-colors"
          >
            Delete my review
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-slate-600">Loading reviews…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-700">No reviews yet.</p>
        ) : (
          items.map((r, idx) => (
            <div key={r._id || `${idx}-${r.user?._id || ''}`} className="border border-slate-200 rounded p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">{r?.user?.name || 'Anonymous'}</div>
                <div className="text-xs text-slate-700">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm mt-1 text-slate-900">
                Rating: <span className="font-semibold">{r.rating}</span> / 5
              </div>
              {r.title && <div className="mt-1 font-medium text-slate-900">{r.title}</div>}
              {r.comment && <p className="text-sm mt-1 whitespace-pre-wrap text-slate-900">{r.comment}</p>}
              {r.isVerifiedPurchase && (
                <span className="text-xs text-emerald-700 bg-emerald-50 rounded px-2 py-0.5 mt-2 inline-block">
                  Verified purchase
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}