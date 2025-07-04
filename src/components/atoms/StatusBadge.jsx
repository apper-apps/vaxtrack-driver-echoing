import React from 'react'

const StatusBadge = ({ status, children, className = '' }) => {
  const statusClasses = {
    ok: 'status-badge ok',
    expiring: 'status-badge expiring',
    expired: 'status-badge expired',
    'low-stock': 'status-badge low-stock'
  }
  
  const badgeClass = statusClasses[status] || 'status-badge'
  
  return (
    <span className={`${badgeClass} ${className}`}>
      {children}
    </span>
  )
}

export default StatusBadge