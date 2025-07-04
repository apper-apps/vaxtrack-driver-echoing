import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = 'No data found', 
  message = 'There are no items to display at the moment.',
  icon = 'Package',
  actionLabel,
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`empty-state ${className}`}
    >
      <div className="empty-state-icon">
        <ApperIcon name={icon} className="w-16 h-16" />
      </div>
      
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{message}</p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty