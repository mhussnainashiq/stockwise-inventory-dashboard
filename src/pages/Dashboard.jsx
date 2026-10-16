import { useMemo } from 'react'
import { Package, AlertTriangle, DollarSign, Warehouse } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'
export default function Dashboard() {
  const { state } = useApp()
  const stats = useMemo(() => {
    const totalProducts = state.products.length
    const lowStock = state.products.filter(p => p.quantity <= p.reorderLevel).length
    const valuation = state.products.reduce((s, p) => s + p.quantity * p.cost, 0)
    const totalQty = state.products.reduce((s, p) => s + p.quantity, 0)
    return { totalProducts, lowStock, valuation, totalQty, warehouses: state.warehouses.length }
  }, [state])
  const catData = useMemo(() => {
    return state.categories.map(c => ({
      name: c.name,
      qty: state.products.filter(p => p.categoryId === c.id).reduce((s, p) => s + p.quantity, 0)
    }))
  }, [state])
  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon blue"><Package size={22} /></div><div className="kpi-label">Products</div><div className="kpi-value">{stats.totalProducts}</div></div>
        <div className="kpi-card"><div className="kpi-icon red"><AlertTriangle size={22} /></div><div className="kpi-label">Low Stock</div><div className="kpi-value">{stats.lowStock}</div></div>
        <div className="kpi-card"><div className="kpi-icon green"><DollarSign size={22} /></div><div className="kpi-label">Inventory Value</div><div className="kpi-value">${stats.valuation.toLocaleString()}</div></div>
        <div className="kpi-card"><div className="kpi-icon orange"><Warehouse size={22} /></div><div className="kpi-label">Total Units</div><div className="kpi-value">{stats.totalQty.toLocaleString()}</div></div>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">Stock by Category</div>
        <div className="card-body" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={catData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="name" stroke="var(--text-muted)" /><YAxis stroke="var(--text-muted)" /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} /><Bar dataKey="qty" fill="#0d9488" radius={[6, 6, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <div className="card-header">Low Stock Items</div>
        <div className="table-wrap"><table>
          <thead><tr><th>SKU</th><th>Product</th><th>Qty</th><th>Reorder Level</th></tr></thead>
          <tbody>
            {state.products.filter(p => p.quantity <= p.reorderLevel).map(p => (
              <tr key={p.id}><td>{p.sku}</td><td>{p.name}</td><td style={{ color: 'var(--danger)', fontWeight: 600 }}>{p.quantity}</td><td>{p.reorderLevel}</td></tr>
            ))}
            {state.products.filter(p => p.quantity <= p.reorderLevel).length === 0 && <tr><td colSpan={4} className="empty-state">No low stock items</td></tr>}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
