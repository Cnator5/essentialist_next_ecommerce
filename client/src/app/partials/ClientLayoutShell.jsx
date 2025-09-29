'use client'

import { lazy, Suspense } from 'react'
import { Provider } from 'react-redux'
import { store } from '../../store/store'

// Lazy load the ShellWithRedux component
const ShellWithRedux = lazy(() => import('./ShellWithRedux'))

export default function ClientLayoutShell({ children }) {
  return (
    <Provider store={store}>
      <Suspense fallback={
        <div className="min-h-screen bg-[#faf6f3] flex items-center justify-center">
          <div className="animate-pulse w-24 h-24 rounded-full bg-gray-200"></div>
        </div>
      }>
        <ShellWithRedux>{children}</ShellWithRedux>
      </Suspense>
    </Provider>
  )
}