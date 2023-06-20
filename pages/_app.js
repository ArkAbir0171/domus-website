import '../styles/globals.css'
import NextNProgress from 'nextjs-progressbar';
import data from '../styles/data';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {

  const [supabase] = useState(() => createBrowserSupabaseClient())
  
  return (
    <>
      <NextNProgress options={{ easing: "ease", speed: 500 }} color={data.styles.color.secondary} />
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SessionContextProvider>
    </>
  )
}

export default MyApp
