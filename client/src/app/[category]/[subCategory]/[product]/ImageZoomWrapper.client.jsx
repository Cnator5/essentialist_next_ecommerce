'use client'
import dynamic from 'next/dynamic'

const ImageZoom = dynamic(
  () => import('./ImageZoom.client').then((mod) => mod.default),
  { ssr: false }
)

export default function ImageZoomWrapper(props) {
  return <ImageZoom {...props} />
}