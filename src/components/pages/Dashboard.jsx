import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'
import QuickAction from '@/components/molecules/QuickAction'
import VaccineTable from '@/components/organisms/VaccineTable'
import AlertBanner from '@/components/molecules/AlertBanner'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { inventoryService } from '@/services/api/inventoryService'
import { administrationService } from '@/services/api/administrationService'

const Dashboard = () => {
  const navigate = useNavigate()
  const [inventoryData, setInventoryData] = useState([])
  const [administrationData, setAdministrationData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [inventory, administration] = await Promise.all([
        inventoryService.getAll(),
        administrationService.getAll()
      ])
      
      setInventoryData(inventory)
      setAdministrationData(administration)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard data error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  // Calculate metrics
  const calculateMetrics = () => {
    const totalDoses = inventoryData.reduce((sum, item) => sum + item.quantityOnHand, 0)
    const administeredDoses = administrationData.reduce((sum, item) => sum + item.dosesAdministered, 0)
    
    const now = new Date()
    const expiringSoon = inventoryData.filter(item => {
      const expirationDate = new Date(item.expirationDate)
      const daysToExpiry = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24))
      return daysToExpiry > 0 && daysToExpiry <= 30
    }).length
    
    const expired = inventoryData.filter(item => {
      const expirationDate = new Date(item.expirationDate)
      return expirationDate < now
    }).length
    
    const lowStock = inventoryData.filter(item => item.quantityOnHand <= 10).length
    
    return { totalDoses, administeredDoses, expiringSoon, expired, lowStock }
  }
  
  const metrics = calculateMetrics()
  
  // Get critical alerts
  const getCriticalAlerts = () => {
    const alerts = []
    
    if (metrics.expired > 0) {
      alerts.push({
        type: 'error',
        title: 'Expired Vaccines',
        message: `${metrics.expired} vaccine lots have expired and need immediate attention.`
      })
    }
    
    if (metrics.expiringSoon > 0) {
      alerts.push({
        type: 'warning',
        title: 'Expiring Soon',
        message: `${metrics.expiringSoon} vaccine lots will expire within 30 days.`
      })
    }
    
    if (metrics.lowStock > 0) {
      alerts.push({
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${metrics.lowStock} vaccine lots are running low on inventory.`
      })
    }
    
    return alerts
  }
  
  const criticalAlerts = getCriticalAlerts()
  
  // Get low stock items for display
  const getLowStockItems = () => {
    return inventoryData
      .filter(item => item.quantityOnHand <= 10)
      .sort((a, b) => a.quantityOnHand - b.quantityOnHand)
      .slice(0, 5)
  }
  
  const lowStockItems = getLowStockItems()
  
  if (loading) {
    return <Loading variant="cards" />
  }
  
  if (error) {
    return (
      <Error 
        title="Dashboard Error"
        message={error}
        onRetry={loadDashboardData}
      />
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">Monitor your vaccine inventory and track key metrics</p>
        </div>
      </div>
      
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-4">
          {criticalAlerts.map((alert, index) => (
            <AlertBanner
              key={index}
              type={alert.type}
              title={alert.title}
              message={alert.message}
            />
          ))}
        </div>
      )}
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Doses"
          value={metrics.totalDoses.toLocaleString()}
          icon="Package"
          color="primary"
        />
        <MetricCard
          title="Administered"
          value={metrics.administeredDoses.toLocaleString()}
          icon="Syringe"
          color="success"
        />
        <MetricCard
          title="Expiring Soon"
          value={metrics.expiringSoon}
          icon="Clock"
          color="warning"
        />
        <MetricCard
          title="Expired"
          value={metrics.expired}
          icon="AlertTriangle"
          color="error"
        />
        <MetricCard
          title="Low Stock"
          value={metrics.lowStock}
          icon="AlertCircle"
          color="accent"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickAction
          title="Receive Vaccines"
          description="Record new vaccine shipments and quality inspections"
          icon="TruckIcon"
          onClick={() => navigate('/receiving')}
        />
        <QuickAction
          title="Record Administration"
          description="Log administered doses and update inventory"
          icon="Syringe"
          onClick={() => navigate('/administration')}
        />
      </div>
      
      {/* Low Stock Items */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Low Stock Items</h2>
          <p className="text-slate-600 mt-1">Vaccines that need reordering</p>
        </div>
        
        <div className="p-6">
          {lowStockItems.length > 0 ? (
            <VaccineTable
              vaccines={lowStockItems}
              onSort={() => {}}
              sortField=""
              sortDirection="asc"
              onUpdateQuantity={() => {}}
            />
          ) : (
            <Empty
              title="No Low Stock Items"
              message="All vaccines have adequate inventory levels."
              icon="CheckCircle"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard