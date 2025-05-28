import React from 'react'
import { Toaster } from 'react-hot-toast'
import "./globals.css"
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
     title: "Football Livescore",
     description: "A good project"
 }
const Rootlayout = ({children} : {children: React.ReactNode}) => {
  return (
   <html>
    <head>
        
    </head>
    <body>
            <Toaster />
            <Header />
            {children}
            <Footer />
    </body>
   </html>
  )
}

export default Rootlayout