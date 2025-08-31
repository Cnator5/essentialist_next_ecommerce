'use client'

import dynamic from 'next/dynamic'

// If your animated component lives at components/BackgroundPaths.jsx and is default export:
const AnimatedBackground = dynamic(() => import('./BackgroundPaths'), {
  ssr: false,
})

export default function BackgroundPathsClient({ title = '' }) {
  return <AnimatedBackground title={title} />
}