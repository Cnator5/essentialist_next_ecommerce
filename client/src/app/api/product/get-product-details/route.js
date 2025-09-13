// src/app/api/product/get-product-details/route.js - Optimized with caching
import { NextResponse } from 'next/server'

// Simple in-memory cache
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function POST(request) {
  try {
    const { productId } = await request.json()
    
    if (!productId) {
      return NextResponse.json({
        message: "Product ID is required",
        error: true,
        success: false
      }, { status: 400 })
    }

    // Check cache first
    const cacheKey = `product_${productId}`
    const cachedData = cache.get(cacheKey)
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json(cachedData.data)
    }

    // Make request to backend API
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product/get-product-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId })
    })

    const data = await backendResponse.json()
    
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status })
    }

    // Cache successful response
    if (data.success) {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })
    }

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json({
      message: error.message || error,
      error: true,
      success: false
    }, { status: 500 })
  }
}