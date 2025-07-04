import React, { useState } from 'react'
import Header from '@/components/organisms/Header'
import Navigation from '@/components/organisms/Navigation'

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0 lg:h-screen lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center px-6 py-4 border-b border-slate-200">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">VT</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">VaxTrack Pro</h1>
              <p className="text-xs text-slate-500">Vaccine Management</p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 px-4 py-6">
            <Navigation 
              isSidebarOpen={isSidebarOpen} 
              setIsSidebarOpen={setIsSidebarOpen} 
            />
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        <main className="container-fluid py-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout