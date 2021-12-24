import '../styles/globals.css'
import { Auth } from '@supabase/ui'
import type { AppProps } from 'next/app'
import { supabase } from '../utils/supabaseClient'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Component {...pageProps} />
    </Auth.UserContextProvider>
  )
}

export default MyApp
