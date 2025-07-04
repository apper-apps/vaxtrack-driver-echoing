import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const AlertBanner = ({ type = 'info', title, message, onClose, className = '' }) => {
  const alertClasses = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
    info: 'alert-info'
  }
  
  const icons = {
    success: 'CheckCircle',
    warning: 'AlertTriangle',
    error: 'AlertCircle',
    info: 'Info'
  }
  
  const alertClass = alertClasses[type] || alertClasses.info
  const iconName = icons[type] || icons.info
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`alert ${alertClass} ${className}`}
    >
      <div className="flex items-start">
        <ApperIcon name={iconName} className="w-5 h-5 mr-3 mt-0.5" />
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          {message && <p className="text-sm">{message}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current hover:text-opacity-75 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default AlertBanner