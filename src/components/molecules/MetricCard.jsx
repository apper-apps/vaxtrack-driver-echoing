import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const MetricCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon, 
  color = 'primary',
  className = '',
  onClick 
}) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    error: 'from-error-500 to-error-600',
    accent: 'from-accent-500 to-accent-600'
  }
  
  const gradientClass = colorClasses[color] || colorClasses.primary
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`metric-card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {icon && (
              <div className={`w-10 h-10 bg-gradient-to-r ${gradientClass} rounded-lg flex items-center justify-center mr-3`}>
                <ApperIcon name={icon} className="w-5 h-5 text-white" />
              </div>
            )}
            <h3 className="metric-label">{title}</h3>
          </div>
          <div className="metric-value">{value}</div>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                className={`w-4 h-4 mr-1 ${trend === 'up' ? 'text-success-500' : 'text-error-500'}`}
              />
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-success-600' : 'text-error-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MetricCard