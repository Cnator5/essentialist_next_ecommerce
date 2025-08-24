'use client'

import { useState } from 'react'
import useRating from '../../../utils/useRating'
import Rating from '../../../components/Rating'

export default function RatingBlock({ productId }) {
  const { average, count, myRating, rate, removeMyRating, loading } = useRating(productId)
  const [submitting, setSubmitting] = useState(false)

  const handleRate = async (val) => {
    try {
      setSubmitting(true)
      await rate(val)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="my-2">
      <div className="flex items-center gap-3">
        <Rating
          value={myRating ?? average}
          onChange={handleRate}
          allowHalf
          ariaLabel="Rate this product"
        />
        <div className="text-sm text-gray-700">
          <span className="font-semibold">{Number(average || 0).toFixed(2)}</span> / 5
          <span className="ml-2 text-gray-500">({count} {count === 1 ? 'rating' : 'ratings'})</span>
        </div>
      </div>
      {myRating != null ? (
        <button
          className="mt-1 text-xs text-red-600 underline disabled:opacity-50"
          onClick={removeMyRating}
          disabled={submitting || loading}
        >
          Remove my rating
        </button>
      ) : (
        <p className="mt-1 text-xs text-gray-500">Click stars to rate. Use arrow keys for 0.5 steps.</p>
      )}
    </div>
  )
}