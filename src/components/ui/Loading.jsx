import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({ variant = 'cards', className = '' }) => {
  if (variant === 'cards') {
    return (
      <div className={`loading-container ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="loading-card skeleton"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="loading-table-row skeleton"></div>
          ))}
        </div>
      </div>
    )
  }
  
  if (variant === 'table') {
    return (
      <div className={`loading-container ${className}`}>
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="loading-table-row skeleton"></div>
          ))}
        </div>
      </div>
    )
  }
  
  if (variant === 'form') {
    return (
      <div className={`loading-container ${className}`}>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="loading-text skeleton w-1/4"></div>
              <div className="loading-text skeleton w-full h-12"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"
      />
    </div>
  )
}

export default Loading