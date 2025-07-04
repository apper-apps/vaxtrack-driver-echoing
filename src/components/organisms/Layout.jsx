import React from 'react'
import Header from '@/components/organisms/Header'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container-fluid py-6">
        {children}
      </main>
    </div>
  )
}

export default Layout