'use client'

import { Provider } from 'react-redux'
import { store } from '../../store/store'
import ShellWithRedux from './ShellWithRedux'

export default function ClientLayoutShell({ children }) {
  return (
    <Provider store={store}>
      <ShellWithRedux>{children}</ShellWithRedux>
    </Provider>
  )
}