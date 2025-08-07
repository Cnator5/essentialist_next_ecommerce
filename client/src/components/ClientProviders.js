// src/components/ClientProviders.js
'use client'
import { Provider } from 'react-redux'
import { store } from '../store/store'
import GlobalProvider from '../provider/GlobalProvider'

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <GlobalProvider>
        {children}
      </GlobalProvider>
    </Provider>
  )
}