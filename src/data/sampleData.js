export const initialData = {
  theme: 'light',
  products: [
    { id: '1', sku: 'SKU-1001', name: 'Wireless Mouse', categoryId: '1', cost: 12, price: 29.99, quantity: 150, reorderLevel: 30, warehouseId: '1' },
    { id: '2', sku: 'SKU-1002', name: 'USB-C Hub', categoryId: '1', cost: 18, price: 45, quantity: 80, reorderLevel: 20, warehouseId: '1' },
    { id: '3', sku: 'SKU-2001', name: 'Office Chair', categoryId: '2', cost: 85, price: 199, quantity: 25, reorderLevel: 10, warehouseId: '2' },
    { id: '4', sku: 'SKU-2002', name: 'Standing Desk', categoryId: '2', cost: 220, price: 499, quantity: 12, reorderLevel: 5, warehouseId: '2' },
    { id: '5', sku: 'SKU-3001', name: 'A4 Paper Ream', categoryId: '3', cost: 3.5, price: 8.99, quantity: 8, reorderLevel: 50, warehouseId: '1' },
    { id: '6', sku: 'SKU-3002', name: 'Sticky Notes Pack', categoryId: '3', cost: 1.2, price: 3.5, quantity: 200, reorderLevel: 40, warehouseId: '1' },
    { id: '7', sku: 'SKU-1003', name: 'Mechanical Keyboard', categoryId: '1', cost: 45, price: 99, quantity: 40, reorderLevel: 15, warehouseId: '1' },
    { id: '8', sku: 'SKU-2003', name: 'Monitor 27"', categoryId: '2', cost: 160, price: 349, quantity: 18, reorderLevel: 8, warehouseId: '2' },
  ],
  categories: [
    { id: '1', name: 'Electronics', description: 'Computer peripherals and devices' },
    { id: '2', name: 'Furniture', description: 'Office furniture' },
    { id: '3', name: 'Stationery', description: 'Paper and office supplies' },
  ],
  warehouses: [
    { id: '1', name: 'Main Warehouse', location: 'Building A, Zone 1', capacity: 5000 },
    { id: '2', name: 'East Depot', location: 'Building B, Zone 3', capacity: 2000 },
  ],
  movements: [
    { id: '1', productId: '1', type: 'in', quantity: 50, warehouseId: '1', notes: 'Initial stock', date: '2025-10-01' },
    { id: '2', productId: '5', type: 'out', quantity: 42, warehouseId: '1', notes: 'Sales order', date: '2025-10-12' },
    { id: '3', productId: '3', type: 'in', quantity: 10, warehouseId: '2', notes: 'PO-001', date: '2025-10-10' },
  ],
  suppliers: [
    { id: '1', name: 'TechSupply Co', email: 'orders@techsupply.demo', phone: '+1-555-3001', address: '100 Industrial Blvd' },
    { id: '2', name: 'OfficePro Ltd', email: 'sales@officepro.demo', phone: '+1-555-3002', address: '45 Commerce St' },
    { id: '3', name: 'PaperWorld', email: 'buy@paperworld.demo', phone: '+1-555-3003', address: '8 Print Ave' },
  ],
  purchaseOrders: [
    { id: '1', number: 'PO-2025-001', supplierId: '1', warehouseId: '1', status: 'pending', items: [{ productId: '1', quantity: 100 }, { productId: '2', quantity: 50 }], total: 2100, createdAt: '2025-10-14' },
    { id: '2', number: 'PO-2025-002', supplierId: '2', warehouseId: '2', status: 'ordered', items: [{ productId: '3', quantity: 15 }], total: 1275, createdAt: '2025-10-12' },
    { id: '3', number: 'PO-2025-003', supplierId: '3', warehouseId: '1', status: 'received', items: [{ productId: '5', quantity: 100 }], total: 350, createdAt: '2025-10-05' },
  ],
}
