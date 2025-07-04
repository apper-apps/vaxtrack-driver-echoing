import inventoryData from '@/services/mockData/inventory.json'

class InventoryService {
  constructor() {
    this.inventory = [...inventoryData]
  }
  
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.inventory]
  }
  
  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const item = this.inventory.find(i => i.Id === Id)
    if (!item) {
      throw new Error('Inventory item not found')
    }
    return { ...item }
  }
  
  async create(itemData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newItem = {
      Id: Math.max(...this.inventory.map(i => i.Id)) + 1,
      ...itemData
    }
    
    this.inventory.push(newItem)
    return { ...newItem }
  }
  
  async update(Id, itemData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = this.inventory.findIndex(i => i.Id === Id)
    if (index === -1) {
      throw new Error('Inventory item not found')
    }
    
    this.inventory[index] = { ...this.inventory[index], ...itemData }
    return { ...this.inventory[index] }
  }
  
  async delete(Id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.inventory.findIndex(i => i.Id === Id)
    if (index === -1) {
      throw new Error('Inventory item not found')
    }
    
    this.inventory.splice(index, 1)
    return true
  }
}

export const inventoryService = new InventoryService()