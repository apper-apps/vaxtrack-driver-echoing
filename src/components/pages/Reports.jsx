import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import MetricCard from '@/components/molecules/MetricCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { inventoryService } from '@/services/api/inventoryService'
import { administrationService } from '@/services/api/administrationService'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { toast } from 'react-toastify'

const Reports = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [administrationData, setAdministrationData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  
  const loadReportData = async () => {
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
      setError('Failed to load report data')
      console.error('Reports load error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadReportData()
  }, [])
  
  const generateMonthOptions = () => {
    const options = []
    const currentDate = new Date()
    
    for (let i = 0; i < 12; i++) {
      const date = subMonths(currentDate, i)
      const value = date.toISOString().slice(0, 7)
      const label = format(date, 'MMMM yyyy')
      options.push({ value, label })
    }
    
    return options
  }
  
  const getMonthlyStats = () => {
    const selectedDate = new Date(selectedMonth + '-01')
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(selectedDate)
    
    // Filter administration data for selected month
    const monthlyAdministration = administrationData.filter(record => {
      const recordDate = new Date(record.administrationDate)
      return recordDate >= monthStart && recordDate <= monthEnd
    })
    
    // Current inventory stats
    const totalInventory = inventoryData.reduce((sum, item) => sum + item.quantityOnHand, 0)
    const totalLots = inventoryData.length
    const monthlyAdministered = monthlyAdministration.reduce((sum, record) => sum + record.dosesAdministered, 0)
    
    // Expiration analysis
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
    
    return {
      totalInventory,
      totalLots,
      monthlyAdministered,
      expiringSoon,
      expired,
      lowStock
    }
  }
  
  const getVaccineBreakdown = () => {
    const breakdown = {}
    
    inventoryData.forEach(item => {
      if (!breakdown[item.commercialName]) {
        breakdown[item.commercialName] = {
          lots: 0,
          totalDoses: 0,
          expiringSoon: 0,
          expired: 0
        }
      }
      
      breakdown[item.commercialName].lots += 1
      breakdown[item.commercialName].totalDoses += item.quantityOnHand
      
      const now = new Date()
      const expirationDate = new Date(item.expirationDate)
      const daysToExpiry = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24))
      
      if (daysToExpiry < 0) {
        breakdown[item.commercialName].expired += 1
      } else if (daysToExpiry <= 30) {
        breakdown[item.commercialName].expiringSoon += 1
      }
    })
    
    return Object.entries(breakdown).map(([name, data]) => ({
      name,
      ...data
    }))
  }
  
  const handleExportReport = (format) => {
    const stats = getMonthlyStats()
    const vaccineBreakdown = getVaccineBreakdown()
    const monthName = format(new Date(selectedMonth + '-01'), 'MMMM yyyy')
    
    const reportData = {
      month: monthName,
      generatedAt: new Date().toISOString(),
      summary: stats,
      vaccineBreakdown,
      inventoryData,
      administrationData: administrationData.filter(record => {
        const recordDate = new Date(record.administrationDate)
        const selectedDate = new Date(selectedMonth + '-01')
        return recordDate.getMonth() === selectedDate.getMonth() && 
               recordDate.getFullYear() === selectedDate.getFullYear()
      })
    }
    
    if (format === 'json') {
      const dataStr = JSON.stringify(reportData, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      const exportFileDefaultName = `vaccine-report-${selectedMonth}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
      toast.success('Report exported successfully')
    } else {
      toast.info('CSV export functionality coming soon')
    }
  }
  
  const monthOptions = generateMonthOptions()
  const stats = getMonthlyStats()
  const vaccineBreakdown = getVaccineBreakdown()
  
  if (loading) {
    return <Loading variant="cards" />
  }
  
  if (error) {
    return (
      <Error 
        title="Reports Error"
        message={error}
        onRetry={loadReportData}
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
          <h1 className="section-title">Inventory Reports</h1>
          <p className="section-subtitle">Generate and analyze vaccine inventory reports</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon="Download"
            onClick={() => handleExportReport('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            icon="FileText"
            onClick={() => handleExportReport('json')}
          >
            Export JSON
          </Button>
        </div>
      </div>
      
      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Report Period</h3>
            <p className="text-slate-600 mt-1">Select month for administration data analysis</p>
          </div>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={monthOptions}
            className="w-48"
          />
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <MetricCard
          title="Total Inventory"
          value={stats.totalInventory.toLocaleString()}
          icon="Package"
          color="primary"
        />
        <MetricCard
          title="Vaccine Lots"
          value={stats.totalLots}
          icon="Layers"
          color="secondary"
        />
        <MetricCard
          title="Monthly Administered"
          value={stats.monthlyAdministered.toLocaleString()}
          icon="Syringe"
          color="success"
        />
        <MetricCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          icon="Clock"
          color="warning"
        />
        <MetricCard
          title="Expired"
          value={stats.expired}
          icon="AlertTriangle"
          color="error"
        />
        <MetricCard
          title="Low Stock"
          value={stats.lowStock}
          icon="AlertCircle"
          color="accent"
        />
      </div>
      
      {/* Vaccine Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Vaccine Breakdown</h2>
          <p className="text-slate-600 mt-1">Detailed analysis by vaccine type</p>
        </div>
        
        <div className="p-6">
          {vaccineBreakdown.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full clinical-table">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Vaccine Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Lots
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Total Doses
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Expiring Soon
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Expired
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vaccineBreakdown.map((vaccine, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                        {vaccine.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-slate-700">
                        {vaccine.lots}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-slate-900">
                        {vaccine.totalDoses.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {vaccine.expiringSoon > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                            {vaccine.expiringSoon}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {vaccine.expired > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                            {vaccine.expired}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">No vaccine data available</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Reports