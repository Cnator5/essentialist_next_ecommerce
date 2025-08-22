// app/success/page.jsx
import Link from 'next/link'

// Server Component: Next.js passes `searchParams` to page components.
export default function SuccessPage({ searchParams }) {
  const text =
    typeof searchParams?.text === 'string' && searchParams.text.trim()
      ? searchParams.text
      : 'Payment'

  return (
    <main className="px-4 py-10">
      <div className="m-2 w-full max-w-md bg-pink-400 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5">
        <p className="text-green-800 font-bold text-lg text-center">
          {text} Successfully
        </p>
        <Link
          href="/"
          className="border border-green-900 text-green-900 hover:bg-yellow-400 hover:text-white transition-all px-4 py-1"
        >
          Go To Home
        </Link>
      </div>
    </main>
  )
}