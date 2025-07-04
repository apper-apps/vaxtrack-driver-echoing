import receiptData from '@/services/mockData/receipts.json'

class ReceiptService {
  constructor() {
    this.receipts = [...receiptData]
  }
  
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.receipts]
  }
  
  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const receipt = this.receipts.find(r => r.Id === Id)
    if (!receipt) {
      throw new Error('Receipt not found')
    }
    return { ...receipt }
  }
  
  async create(receiptData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newReceipt = {
      Id: Math.max(...this.receipts.map(r => r.Id)) + 1,
      ...receiptData
    }
    
    this.receipts.push(newReceipt)
    return { ...newReceipt }
  }
  
  async update(Id, receiptData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.receipts.findIndex(r => r.Id === Id)
    if (index === -1) {
      throw new Error('Receipt not found')
    }
    
    this.receipts[index] = { ...this.receipts[index], ...receiptData }
    return { ...this.receipts[index] }
  }
  
  async delete(Id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.receipts.findIndex(r => r.Id === Id)
    if (index === -1) {
      throw new Error('Receipt not found')
    }
    
    this.receipts.splice(index, 1)
    return true
  }
}

export const receiptService = new ReceiptService()