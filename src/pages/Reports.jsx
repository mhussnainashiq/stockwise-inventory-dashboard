import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
export default function Reports() {
  const { state } = useApp()
  const stats = useMemo(() => {
    const valuation = state.products.reduce((s, p) => s + p.quantity * p.cost, 0)
    const retail = state.products.reduce((s, p) => s + p.quantity * p.price, 0)
    const low = state.products.filter(p => p.quantity <= p.reorderLevel).length
    return { valuation, retail, low, products: state.products.length, movements: state.movements.length }
  }, [state])
  const printReport = () => {
    const win = window.open('', '_blank')
    win.document.write(`<html><head><title>Stock Report</title><style>body{font-family:system-ui;padding:40px}table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left}</style></head><body>
      <h1>StockWise Inventory Report</h1><p>Generated: ${new Date().toLocaleString()}</p>
      <p>Total products: ${stats.products} · Valuation: $${stats.valuation.toLocaleString()} · Retail value: $${stats.retail.toLocaleString()}</p>
      <table><tr><th>SKU</th><th>Name</th><th>Qty</th><th>Cost</th><th>Value</th></tr>
      ${state.products.map(p => `<tr><td>${p.sku}</td><td>${p.name}</td><td>${p.quantity}</td><td>$${p.cost}</td><td>$${(p.quantity * p.cost).toFixed(2)}</td></tr>`).join('')}
      </table></body></html>`)
    win.document.close(); win.print()
  }
  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-label">Inventory Cost Value</div><div className="kpi-value">${stats.valuation.toLocaleString()}</div></div>
        <div className="kpi-card"><div className="kpi-label">Retail Value</div><div className="kpi-value">${stats.retail.toLocaleString()}</div></div>
        <div className="kpi-card"><div className="kpi-label">Low Stock Items</div><div className="kpi-value">{stats.low}</div></div>
        <div className="kpi-card"><div className="kpi-label">Movements Logged</div><div className="kpi-value">{stats.movements}</div></div>
      </div>
      <button className="btn btn-primary" onClick={printReport} style={{ marginBottom: 16 }}>Print Stock Report</button>
      <div className="card"><div className="card-header">Summary</div><div className="card-body">
        <p>Products: <strong>{stats.products}</strong></p>
        <p>Warehouses: <strong>{state.warehouses.length}</strong></p>
        <p>Suppliers: <strong>{state.suppliers.length}</strong></p>
        <p>Open POs: <strong>{state.purchaseOrders.filter(p => p.status !== 'received').length}</strong></p>
      </div></div>
    </div>
  )
}
