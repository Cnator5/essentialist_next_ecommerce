import { NextResponse } from 'next/server'

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

    // Make request to your backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/product/get-product-details`, {
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

    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json({
      message: error.message || error,
      error: true,
      success: false
    }, { status: 500 })
  }
}