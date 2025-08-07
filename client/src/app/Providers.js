// app/Providers.js
"use client";
import { Toaster } from 'react-hot-toast';
import StoreProvider from './(providers)/StoreProvider';
import GlobalProvider from '../provider/GlobalProvider';
import AppInitializer from '../components/AppInitializer';

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <GlobalProvider>
        <AppInitializer />
        <Toaster />
        {children}
      </GlobalProvider>
    </StoreProvider>
  );
}