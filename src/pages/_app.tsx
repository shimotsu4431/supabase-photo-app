import '../styles/globals.css'
import { Auth } from '@supabase/ui'
import type { AppProps } from 'next/app'
import { supabase } from '../utils/supabaseClient'

function MyApp({ Component, pageProps }: AppProps) {
  return <Auth.UserContextProvider supabaseClient={supabase}><Component {...pageProps} /></Auth.UserContextProvider>
}

export default MyApp
