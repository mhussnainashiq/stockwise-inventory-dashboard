import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, X, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
const empty = { sku: '', name: '', categoryId: '', cost: 0, price: 0, quantity: 0, reorderLevel: 10, warehouseId: '' }
export default function Products() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return state.products.filter(p => !search || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
  }, [state.products, search])
  const openAdd = () => { setForm({ ...empty, categoryId: state.categories[0]?.id || '', warehouseId: state.warehouses[0]?.id || '' }); setError(''); setModal('add') }
  const openEdit = (p) => { setForm({ ...p }); setError(''); setModal(p) }
  const close = () => setModal(null)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.sku.trim() || !form.name.trim()) { setError('SKU and name required'); return }
    if (form.quantity < 0) { setError('Quantity cannot be negative'); return }
    const payload = { ...form, cost: Number(form.cost), price: Number(form.price), quantity: Number(form.quantity), reorderLevel: Number(form.reorderLevel) }
    if (modal === 'add') {
      if (state.products.some(p => p.sku === form.sku.trim())) { setError('SKU already exists'); return }
      dispatch({ type: 'ADD_PRODUCT', payload })
    } else dispatch({ type: 'UPDATE_PRODUCT', payload })
    close()
  }
  const exportCSV = () => {
    const headers = ['SKU', 'Name', 'Cost', 'Price', 'Qty', 'Reorder Level']
    const rows = filtered.map(p => [p.sku, p.name, p.cost, p.price, p.quantity, p.reorderLevel])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'products.csv'; a.click()
  }
  return (
    <div>
      <div className="toolbar">
        <div className="search-wrap"><Search size={16} /><input className="search-input form-control" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <button className="btn btn-secondary" onClick={exportCSV}><Download size={16} /> Export CSV</button>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Add Product</button>
      </div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>SKU</th><th>Name</th><th>Category</th><th>Cost</th><th>Price</th><th>Qty</th><th>Reorder</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.map(p => {
            const cat = state.categories.find(c => c.id === p.categoryId)
            const low = p.quantity <= p.reorderLevel
            return (
              <tr key={p.id}>
                <td>{p.sku}</td><td><strong>{p.name}</strong></td><td>{cat?.name || '—'}</td>
                <td>${p.cost}</td><td>${p.price}</td>
                <td style={{ color: low ? 'var(--danger)' : undefined, fontWeight: low ? 600 : undefined }}>{p.quantity}</td>
                <td>{p.reorderLevel}</td>
                <td>
                  <button className="btn-icon" onClick={() => openEdit(p)}><Pencil size={16} /></button>
                  <button className="btn-icon" onClick={() => { if (window.confirm('Delete?')) dispatch({ type: 'DELETE_PRODUCT', payload: p.id }) }}><Trash2 size={16} /></button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table></div></div>
      {modal && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">{modal === 'add' ? 'Add Product' : 'Edit Product'}<button className="btn-icon" onClick={close}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}><div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-grid">
                <div className="form-group"><label>SKU *</label><input className="form-control" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required /></div>
                <div className="form-group"><label>Name *</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="form-group"><label>Category</label><select className="form-control" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>{state.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div className="form-group"><label>Warehouse</label><select className="form-control" value={form.warehouseId} onChange={e => setForm({ ...form, warehouseId: e.target.value })}>{state.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
                <div className="form-group"><label>Cost ($)</label><input type="number" className="form-control" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} min={0} step="0.01" /></div>
                <div className="form-group"><label>Price ($)</label><input type="number" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} min={0} step="0.01" /></div>
                <div className="form-group"><label>Quantity</label><input type="number" className="form-control" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} min={0} /></div>
                <div className="form-group"><label>Reorder Level</label><input type="number" className="form-control" value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: e.target.value })} min={0} /></div>
              </div>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={close}>Cancel</button><button type="submit" className="btn btn-primary">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
