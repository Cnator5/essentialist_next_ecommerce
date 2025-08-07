import React from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation'

const Success = () => {
  const location = useLocation()
    
    console.log("location",)  
  return (
    <div className='m-2 w-full max-w-md bg-pink-400 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
        <p className='text-green-800 font-bold text-lg text-center'>{Boolean(location?.state?.text) ? location?.state?.text : "Payment" } Successfully</p>
        <Link href="/" className="border border-green-900 text-green-900 hover:yellow-400 hover:text-white transition-all px-4 py-1">Go To Home</Link>
    </div>
  )
}

export default Success

;