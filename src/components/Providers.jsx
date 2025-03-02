'use client'

import React from 'react'
//import { HeroUIProvider } from '@heroui/react'
import { SessionProvider } from 'next-auth/react'
//import { ToastContainer } from 'react-toastify'

const Providers = ({children}) => {
  return (
    <SessionProvider>
      {/* <HeroUIProvider>
        <ToastContainer position='bottom-right' /> */}
        {children}
      {/* </HeroUIProvider> */}
    </SessionProvider>
  )
}

export default Providers